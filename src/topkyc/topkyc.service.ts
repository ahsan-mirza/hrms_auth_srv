import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { TOP_KYC_PROFILE, TOP_KYC_PROFILE_LINK } from './topkyc.routes';
import { CreateDocumentSettingKycDto } from 'src/kyc/dto/create-kyc-setting.dto';

@Injectable()
export class TopKYCService {
  constructor(private readonly httpService: HttpService) {}

  async createKYCProfile(
    createDocumentSettingKycDto: CreateDocumentSettingKycDto,
  ): Promise<{ profile_id: any }> {
    const { name, description, settings } = createDocumentSettingKycDto;
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(
          `${process.env.TOP_KYC_API_URL}${TOP_KYC_PROFILE}`,
          {
            name,
            description,
            settings: {
              poi_required: settings.profileIdentity,
              poi_allowed_documents: settings.profileIdentityDocument,
              face_comparison_required: settings.faceComparisonRequired,
              face_comparison_allowed_documents:
                settings.faceComparisonAllowedDocuments,
              poa_required: settings.addressVerification,
              allow_poi_manual_uploads: settings.allowPoiManualUploads,
              allow_desktop: settings.allowDesktop,
            },
          },
          {
            headers: {
              'ds-api-token': process.env.TOP_KYC_KEY,
            },
          },
        ),
      );

      console.log('Response from TopKYC:', response.data);
      return {
        profile_id: response.data.id,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Unknown error',
        error.response?.status || 500,
      );
    }
  }

  async generateLinkId(
    // createDocumentSettingKycDto: CreateDocumentSettingKycDto,
    profileId: string,
  ): Promise<{ data: any }> {
    // const { name, description, settings } = createDocumentSettingKycDto;
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(
          `${process.env.TOP_KYC_API_URL}${TOP_KYC_PROFILE}/${profileId}/link`,
          {
            profile_id: profileId,
          },
          {
            headers: {
              'ds-api-token': process.env.TOP_KYC_KEY,
            },
          },
        ),
      );

      console.log('Response from TopKYC:', response.data);
      return {
        data: response.data,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Unknown error',
        error.response?.status || 500,
      );
    }
  }

  async generatePublicUrl(
    // createDocumentSettingKycDto: CreateDocumentSettingKycDto,
    linkId: string,
  ): Promise<{ data: any }> {
    // const { name, description, settings } = createDocumentSettingKycDto;
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(
          `${process.env.TOP_KYC_API_URL}${TOP_KYC_PROFILE_LINK}/${linkId}`,

          {
            headers: {
              'ds-api-token': process.env.TOP_KYC_KEY,
            },
          },
        ),
      );

      console.log('Response from TopKYC:', response.data);
      return {
        data: response.data,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Unknown error',
        error.response?.status || 500,
      );
    }
  }
}
