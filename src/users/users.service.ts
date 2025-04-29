import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.model';
import { Sequelize } from 'sequelize-typescript';
import { BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/utils/OtpService';
import { Otp } from './entities/otp.model';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  // constructor(
  //   @Inject(USERS_REPOSITORY)
  //   private userRepository: typeof User, // Ensure the correct type for the repository
  // ) {}
  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,

    @Inject('REQUEST') private readonly request: Request, // Add this
  ) {}

  // constructor(
  //   @InjectModel(User)
  //   private readonly userModel: typeof User,
  //   private readonly sequelize: Sequelize, // Inject Sequelize instance for transactions
  // ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async cehckEmailAvailability(email: string): Promise<any> {
    const existingEmail = await User.findOne({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    return {
      message: 'Email available',
      available: true,
    };
  }

  async userNameAvailability(userName: string): Promise<any> {
    const existingUsername = await User.findOne({
      where: {
        userName: userName,
      },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }
    return {
      message: 'Username available',
      available: true,
    };
  }

  async checkUsername(userName: string): Promise<boolean> {
    const existingUsername = await User.findOne({
      where: {
        userName: userName,
      },
    });

    if (!existingUsername) {
      throw new BadRequestException('Username not found');
    }
    return true;
  }

  async sendOtpForRegistration(requestUser: CreateUserDTO) {
    try {
      if (requestUser.userName) {
        const chekUsername = await User.findOne({
          where: { userName: requestUser.userName },
        });
        if (chekUsername) {
          throw new ConflictException('Username already exists');
        }
      }

      if (requestUser.email) {
        const chekUserMail = await User.findOne({
          where: { email: requestUser.email },
        });
        if (chekUserMail) {
          throw new ConflictException('Email already exists');
        }
      }

      // Generate a unique OTP
      // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

      const otp = '123456'; // 6-digit OTP for testing
      // Set expiration time (e.g., 5 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      // Save OTP to the database
      await Otp.create({
        identifier: requestUser.email,
        otp: otp,
        expiresAt: expiresAt,
        status: 'pending', // Set initial status to 'pending'
      });
      // Send OTP to the user (e.g., via email or SMS)
      const otpService = new OtpService();
      const otpResponse = await otpService.sendOtp(requestUser.email, otp);

      const token = await this.jwtService.signAsync(
        {
          ...requestUser,
          otp: otp,
          expiresAt: expiresAt,
        },
        {
          secret: process.env.OTP_GENERATION_SECRET,
          expiresIn: '10m', // token will expire in 10 minutes
        },
      );

      return {
        message: 'OTP sent successfully!',
        token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Rethrow the ConflictException
      } else {
        throw new BadRequestException('Error sending OTP');
      }
    }
  }

  async verifyOtp(identifier: string, otp: string): Promise<boolean> {
    const otpRecord = await Otp.findOne({
      where: { identifier, otp, status: 'pending' },
      order: [['createdAt', 'DESC']], // Get the most recent OTP
      limit: 1,
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check if the OTP is expired
    const currentTime = new Date();
    if (currentTime > otpRecord.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark the OTP as verified
    await Otp.update({ status: 'verified' }, { where: { id: otpRecord.id } });
    return true;
  }

  async verifyOtpAndCreateUser(token: string, otp: string): Promise<any> {
    // Decode the JWT token to get the identifier
    console.log(token, otp);

    const user: CreateUserDTO = await this.jwtService.verifyAsync(token, {
      secret: process.env.OTP_GENERATION_SECRET,
    });

    console.log('========');

    console.log(user);

    await this.verifyOtp(user.email, otp);
    await this.create(user);
    const data = await this.loginUser(user.email, user.password);

    return { ...data, message: 'User created successfully!' };
  }

  async loginUser(identifier: string, password: string): Promise<any> {
    console.log({ identifier, password });

    // const user = await User.findOne({
    //   where: {
    //     [Op.or]: [{ email: identifier }, { userName: identifier }],
    //   },
    // });

    // if (!user) {
    //   throw new BadRequestException('Invalid email or password');
    // }

    // // Check if the password matches
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new BadRequestException('Invalid email or password');
    // }

    // // Generate access token
    // const accessToken = await this.jwtService.signAsync(
    //   {
    //     id: user.id,
    //     email: user.email,
    //     userName: user.userName,
    //   },
    //   {
    //     secret: process.env.USER_LOGIN_SECRET,
    //     expiresIn: '1h', // Access token expiration time
    //   },
    // );
    // const data = await this.getUserDocumentAcceptanceStatus(user.id);
    // const userdevice = await this.userDevicesService.saveUserDevice(
    //   user.id,
    //   this.request,
    // );

    // // console.log('aaaaa', userdevice, data);

    // return {
    //   message: 'Login successful',
    //   accessToken,
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //     userName: user.userName,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     ...data,
    //   },
    // };
  }

  async sendOtpForgotPassword(email: string): Promise<any> {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // generate a token using jwt
    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: process.env.FORGOT_PASSWORD_SECRET,
        expiresIn: '10m', // token will expire in 10 minutes
      },
    );

    // Generate a link for password reset
    const resetLink = `https://your-app.com/reset-password/${token}`;

    // Send this link to email throw email service

    return {
      message: `Email sent successfully! Please check your inbox. `,
      data: {
        token,
      },
    };
  }

  async verifyForgotPasswordToken(token: string): Promise<any> {
    // Decode the JWT token to get the identifier
    const user: {
      id: number;
      email: string;
    } = await this.jwtService.verifyAsync(token, {
      secret: process.env.FORGOT_PASSWORD_SECRET,
    });

    // Check if the user exists
    const userExists = await User.findOne({
      where: { id: user.id, email: user.email },
    });
    if (!userExists) {
      throw new BadRequestException('Invalid token');
    }

    return {
      message: 'Forgot Password Token is valid',
    };
  }

  async updatePassword(token: string, newPassword: string): Promise<any> {
    // Decode the JWT token to get the identifier
    const user: {
      id: number;
      email: string;
    } = await this.jwtService.verifyAsync(token, {
      secret: process.env.FORGOT_PASSWORD_SECRET,
    });

    // check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      );
    }

    // Check if the user exists
    const userExists = await User.findOne({
      where: { id: user.id, email: user.email },
    });
    if (!userExists) {
      throw new BadRequestException('Invalid token');
    }

    // check this is the old password and
    const isPasswordValid = await bcrypt.compare(
      newPassword,
      userExists.password,
    );
    if (isPasswordValid) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await User.update({ password: hashed }, { where: { id: user.id } });

    return {
      message: 'Password updated successfully',
    };
  }

  async resetPassword(userId: number, newPassword: string): Promise<any> {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // check password strength
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      );
    }

    // check this is the old password and
    const isPasswordValid = await bcrypt.compare(newPassword, user.password);
    if (isPasswordValid) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    // Update the password in the database & Automatically convert to hash at the model level
    await User.update({ password: newPassword }, { where: { id: userId } });

    return {
      message: 'Password updated successfully',
    };
  }

  async create(createUserDTO: CreateUserDTO): Promise<any> {
    try {
      //   const { password, referredBy, firstName, lastName, email } =
      //     createUserDTO;
      //   let parentUser: User | null | any = null;
      //   console.log({ referredBy });
      //   // Check if the user already exists
      //   const existingUser = await User.findOne({ where: { email } });
      //   if (existingUser) {
      //     throw new ConflictException('Email already exists');
      //   }
      //   // Check if the referral code is valid
      //   if (referredBy) {
      //     if (createUserDTO.questions && createUserDTO.questions.length > 0) {
      //       throw new BadRequestException('Questions is not required');
      //     }
      //     parentUser = await User.findOne({
      //       where: { referralCode: referredBy },
      //       raw: true,
      //     });
      //     if (!parentUser) {
      //       throw new BadRequestException('Invalid referral code');
      //     }
      //   }
      //   const newQuestionAns: {
      //     questionId: number;
      //     answer: string;
      //   }[] = [];
      //   if (createUserDTO.questions && createUserDTO.questions.length > 0) {
      //     if (!referredBy) {
      //       throw new BadRequestException('Referral code is required');
      //     }
      //     const list = await this.questionValidation(createUserDTO.questions);
      //     newQuestionAns.push(...list);
      //   }
      //   if (!PasswordValidator.isValid(password)) {
      //     const issues = PasswordValidator.getValidationErrors(password);
      //     throw new BadRequestException(
      //       `Password is invalid:\n${issues.join('\n')}`,
      //     );
      //   }
      //   // const hashedPassword = await bcrypt.hash(password, 10);
      //   const referralCode = await this.generateUniqueReferralCode();
      //   let currentUserUplinePath: string | null = null;
      //   let currentUserUploineIds: number[] = [];
      //   let level = 1;
      //   let depth = 0;
      //   if (parentUser) {
      //     currentUserUplinePath = parentUser?.uplinePath
      //       ? `${parentUser.uplinePath}/${parentUser.id}`
      //       : `${parentUser.id}`;
      //     currentUserUploineIds = parentUser?.uplineIds
      //       ? [...parentUser?.uplineIds, parentUser.id]
      //       : [parentUser.id];
      //     await User.increment(['directReferrals', 'totalTeamMembers'], {
      //       where: { id: parentUser.id },
      //     });
      //     depth = currentUserUploineIds.length;
      //     ``;
      //     if (parentUser?.uplineIds?.length > 0) {
      //       await User.increment('totalTeamMembers', {
      //         by: 1,
      //         where: {
      //           id: {
      //             [Op.in]: parentUser.uplineIds, // Matches all user IDs in the uplineIds array
      //           },
      //         },
      //       });
      //     }
      //   }
      //   const user = new User({
      //     referralCode: referralCode,
      //     firstName: firstName,
      //     lastName: lastName,
      //     email: email,
      //     password: password,
      //     referredBy: referredBy || null,
      //     uplinePath: currentUserUplinePath,
      //     uplineIds: currentUserUploineIds,
      //     parentId: parentUser ? parentUser?.id : null,
      //     depth: depth,
      //     status: UserStatus.ACTIVE,
      //     level: level,
      //     registerReferCode: referralCode,
      //   });
      //   await user.save();
      //   if (user) {
      //     if (createUserDTO.questions && createUserDTO.questions.length > 0) {
      //       const user_answers = newQuestionAns.map((question) => {
      //         return {
      //           ...question,
      //           userId: user.id,
      //         };
      //       });
      //       await QuestionAnswer.bulkCreate(user_answers);
      //       // user.$add('questions', user_answers.map((question) => question.question_id));
      //     }
      //   }
      //   // return only the user object without password
      //   const userWithoutPassword = user.get({ plain: true });
      //   const userInfor = {
      //     id: userWithoutPassword.id,
      //     firstName: userWithoutPassword.firstName,
      //     lastName: userWithoutPassword.lastName,
      //     email: userWithoutPassword.email,
      //     referralCode: userWithoutPassword.referralCode,
      //   };
      //   return userInfor;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async bulkCreateUserSeederWithNested(): Promise<any> {
    // const createdUsers: any[] = [];
    // const referralCodeMap = new Map<string, User>(); // key: referralCode, value: created User
    // let referredBy = null;
    // for (let index = 0; index < 1000; index++) {
    //   const hashedPassword = await bcrypt.hash('Abcd123@', 10);
    //   const firstName = faker.person.firstName();
    //   const lastName = faker.person.lastName();
    //   const email = faker.internet
    //     .email({
    //       firstName: firstName,
    //       lastName: lastName,
    //     })
    //     .replace('@', `.${Date.now()}@`);
    //   const phone = faker.phone.number({
    //     style: 'international',
    //   });
    //   const dob = faker.date.birthdate({
    //     min: 18,
    //     max: 60,
    //     mode: 'age',
    //   });
    //   const referralCode = await this.generateUniqueReferralCode();
    //   let parentUser: User | null = null;
    //   if (referredBy) {
    //     parentUser =
    //       referralCodeMap.get(referredBy) ||
    //       (await User.findOne({
    //         where: { referralCode: referredBy },
    //         raw: true,
    //       }));
    //     if (!parentUser) {
    //       // console.log(`Invalid referral code "${referredBy}" for user ${email}. Skipping...`);
    //       continue;
    //     }
    //   }
    //   let currentUserUplinePath: string | null = null;
    //   let currentUserUploineIds: number[] = [];
    //   let level = 1;
    //   let depth = 0;
    //   if (parentUser) {
    //     currentUserUplinePath = parentUser?.uplinePath
    //       ? `${parentUser.uplinePath}/${parentUser.id}`
    //       : `${parentUser.id}`;
    //     currentUserUploineIds = parentUser?.uplineIds
    //       ? [...parentUser?.uplineIds, parentUser.id]
    //       : [parentUser.id];
    //     await User.increment(['directReferrals', 'totalTeamMembers'], {
    //       where: { id: parentUser.id },
    //     });
    //     depth = currentUserUploineIds.length;
    //     if (parentUser?.uplineIds?.length > 0) {
    //       await User.increment('totalTeamMembers', {
    //         by: 1,
    //         where: {
    //           id: {
    //             [Op.in]: parentUser.uplineIds, // Matches all user IDs in the uplineIds array
    //           },
    //         },
    //       });
    //     }
    //   }
    //   const newUser = await User.create({
    //     referralCode,
    //     firstName: firstName,
    //     lastName: lastName,
    //     email: email,
    //     password: hashedPassword,
    //     phone: phone || null,
    //     referredBy: referredBy || null,
    //     uplinePath: currentUserUplinePath,
    //     uplineIds: currentUserUploineIds,
    //     parentId: parentUser ? parentUser.id : null,
    //     depth: depth,
    //     status: UserStatus.ACTIVE,
    //     level: level,
    //     profileImage: faker.image.avatar(),
    //     dateOfBirth: dob,
    //   });
    //   createdUsers.push(newUser);
    //   referralCodeMap.set(referralCode, newUser);
    // }
    // return createdUsers;
  }

  async kycVerificationRequest(userId: number, kycData: any): Promise<any> {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      message: 'KYC verified successfully',
    };
  }

  async findAll(): Promise<User[]> {
    return await User.findAll<User>();
  }

  async getUserInformation(id: number) {
    const userExcludeColumns = [
      'password',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'uplineIds',
      'uplinePath',
      'referredBy',
    ];
    const rootUser = await User.findByPk(id, {
      raw: true,
      attributes: {
        exclude: userExcludeColumns,
      },
    });
    return rootUser;
  }

  async getImageFromCloudStorage(path: any) {
    const pathString = path.join('/');
    const originalPath =
      'https://storage.googleapis.com/quickdropx-storage/media/public/' +
      pathString;
    const response = await firstValueFrom(
      this.httpService.get(originalPath, {
        responseType: 'arraybuffer',
      }),
    );
    const contentType = response.headers['content-type']; // e.g., 'image/jpeg'
    const buffer = response.data;
    return {
      contentType,
      buffer,
    };
  }

  async getDirectCommunity(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'referralCode'],
    });
    if (!user) throw new BadRequestException('User not found');

    const children = await User.findAll({
      where: { parentId: userId },
      attributes: {
        exclude: [
          'password',
          'createdAt',
          'updatedAt',
          'uplinePath',
          'uplineIds',
        ],
      },
    });

    return {
      user,
      children,
    };
  }

  update(id: number, updateUserDto: UpdateUserDTO) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // private async getUserDocumentAcceptanceStatus(userId: number) {
  //   console.log('userId', userId);
  //   const acceptedDocuments = await UserLegalAcceptance.findAll({
  //     where: { user_id: userId, accepted: true },
  //     include: [
  //       {
  //         model: LegalDocument,
  //         attributes: ['type'],
  //       },
  //     ],
  //   });

  //   return {
  //     is_terms: acceptedDocuments.some((doc) => doc.documnet?.type === 'terms'),
  //     is_privacy: acceptedDocuments.some(
  //       (doc) => doc.documnet?.type === 'privacy',
  //     ),
  //     is_risk: acceptedDocuments.some((doc) => doc.documnet?.type === 'risk'),
  //     is_tax: acceptedDocuments.some((doc) => doc.documnet?.type === 'tax'),
  //   };
  // }

  async resendEmailOtp(token: string) {
    try {
      // Verify and decode the token
      const decodedUser = await this.jwtService.verifyAsync(token, {
        secret: process.env.OTP_GENERATION_SECRET,
      });

      // Remove sensitive data
      const { otp, expiresAt, ...userData } = decodedUser;
      console.log('userData', userData);

      return { message: 'OTP send successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
