import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UsersService } from 'src/users/users.service';
import { TopKYCService } from 'src/topkyc/topkyc.service';
import {
  CreateDocumentSettingKycDto,
  KycSettingsDto,
} from './dto/create-kyc-setting.dto';

import { KycSetting } from './entities/kyc-setting.model';
import { User } from 'src/users/entities/user.model';
import { UsernameGenerator } from 'src/utils/unique-name-kyc-generator';
import { Address } from 'src/users/entities/address.model';
import { KycWebhook } from './entities/kyc-webhook.model';

@Injectable()
export class KycService {
  constructor(
    private readonly userService: UsersService,
    private readonly topKycService: TopKYCService,
  ) {}

  create(createKycDto: CreateKycDto) {
    return 'This action adds a new kyc';
  }

  findAll() {
    return `This action returns all kyc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kyc`;
  }

  update(id: number, updateKycDto: UpdateKycDto) {
    return `This action updates a #${id} kyc`;
  }

  remove(id: number) {
    return `This action removes a #${id} kyc`;
  }

  async createKycVerificationDocumentSetting(
    createSettingKycDto: KycSettingsDto,
  ) {
    try {
      const kycSetting = await KycSetting.create({ ...createSettingKycDto });
      return kycSetting;
    } catch (error) {
      console.log('Error creating KYC setting:', error);
    }
  }

  // async createVerificationLink(userId: number) {
  //   //
  //   // const user = await this.userService.getUserById(userId);

  //   // if (!user) {
  //   //   throw new Error('User not found');
  //   // }

  //   try {
  //     const kycSetting = await KycSetting.findOne({ raw: true });
  //     console.log('KYC Setting:', kycSetting);

  //     if (!kycSetting) {
  //       throw new Error('KYC Setting not found');
  //     }

  //     const data: CreateDocumentSettingKycDto = {
  //       name: '8',
  //       description: 'description',
  //       settings: kycSetting,
  //     };
  //     this.topKycService.createKYCProfile(data).then((response) => {
  //       console.log('Response from TopKYC-111111111:', response.profile_id);
  //       if (response) {
  //         this.topKycService
  //           .generateLinkId(response.profile_id)
  //           .then((response) => {
  //             console.log('Response from TopKYC-222222222:', response);
  //             if (response) {
  //               this.topKycService
  //                 .generatePublicUrl(response.data.link_id)
  //                 .then((response) => {
  //                   console.log('Response from TopKYC-33333333:', response);
  //                   if (response) {
  //                     return response.data.verification_url;
  //                   }
  //                 });
  //             } else {
  //               throw new Error('Error generating public link');
  //             }
  //           });
  //       }
  //     });
  //   } catch (error) {
  //     console.log('Data to error to TopKYC:', error);
  //   }
  // }

  async createVerificationLink(user: any): Promise<string | null> {
    try {
      const newUsername = await UsernameGenerator.generate({
        baseUsername: user.username,
      });
      console.log('Response from TopKYC - Profile:', newUsername);

      const kycSetting = await KycSetting.findOne({ raw: true });
      if (!kycSetting) {
        throw new Error('KYC Setting not found');
      }

      const data: CreateDocumentSettingKycDto = {
        name: newUsername,
        description: `${newUsername} description`,
        settings: kycSetting,
      };

      const profileResponse = await this.topKycService.createKYCProfile(data);
      console.log(
        'Response from TopKYC - Profile:',
        profileResponse.profile_id,
      );

      if (!profileResponse || !profileResponse.profile_id) {
        throw new Error('Failed to create KYC profile');
      }

      await User.update(
        { kyc_profile_url: profileResponse.profile_id },
        { where: { id: user.id } },
      );

      const linkResponse = await this.topKycService.generateLinkId(
        profileResponse.profile_id,
      );
      console.log('Response from TopKYC - Link ID:', linkResponse);

      if (!linkResponse || !linkResponse.data?.link_id) {
        throw new Error('Failed to generate Link ID');
      }

      const publicUrlResponse = await this.topKycService.generatePublicUrl(
        linkResponse.data.link_id,
      );
      console.log('Response from TopKYC - Public URL:', publicUrlResponse);

      if (!publicUrlResponse || !publicUrlResponse.data?.verification_url) {
        throw new Error('Failed to generate public verification URL');
      }

      return publicUrlResponse.data.verification_url;
    } catch (error) {
      console.error('Error during KYC link generation:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async verifyKYC(data: any) {
    const { payload } = data;
    console.log('ID:', payload);
    const user = await User.findOne({
      where: { kyc_profile_url: payload.profile_id },
      raw: true,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await KycWebhook.create({
      userId: user.id,
      profileId: payload.profile_id,
      status: payload.status,
      meta: payload, // store entire payload
    });

    await User.update(
      {
        kyc_approved: payload.status === 'verified',
        kyc_status: payload.status,
        kyc_expiry: payload.expires_at,
      },
      { where: { kyc_profile_url: payload.profile_id } },
    );

    await Address.create({
      userId: user.id,
      address: payload.poi_data.address,
      city: payload.poi_data.city,
      state: payload.poi_data.state,
      country: payload.poi_data.country,
    });
  }
}
