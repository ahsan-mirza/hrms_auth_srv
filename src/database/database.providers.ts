import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.model';
import { SEQUELIZE } from 'src/utils/constants';
import databaseConfig from './database.config';
import { join } from 'path';
import { readdirSync } from 'fs';
import { Otp } from 'src/users/entities/otp.model';
import { Question } from 'src/users/entities/question.model';
import { QuestionAnswer } from 'src/users/entities/question-answer.model';
import { KycSetting } from 'src/kyc/entities/kyc-setting.model';
import { KycDocumentType } from 'src/kyc/entities/kyc-document-types';
import { Kyc } from 'src/kyc/entities/kyc.model';
import { UserLegalAcceptance } from 'src/users/entities/user-legal-acceptance.model';
import { LegalDocument } from 'src/users/entities/legal-document.model';
import { UserDevices } from 'src/users/entities/user.devices.model';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const env = process.env.NODE_ENV || 'development';
      const config = databaseConfig[env];

      const sequelize = new Sequelize({
        dialect: config.dialect,
        ...config,
        logging: false,
        define: {
          underscored: true,
          timestamps: true,
          paranoid: true,
        },
      });
      sequelize.addModels([
        User,
        Otp,
        Question,
        QuestionAnswer,
        KycSetting,
        KycDocumentType,
        Kyc,
        UserLegalAcceptance,
        LegalDocument,
        UserDevices,
      ]);
      await sequelize.sync({
        alter: true,
        // force: true,
      });
      return sequelize;
    },
  },
];
