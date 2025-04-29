import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.model';
import { SEQUELIZE } from 'src/utils/constants';
import databaseConfig from './database.config';
import { Otp } from 'src/users/entities/otp.model';
import { KycSetting } from 'src/kyc/entities/kyc-setting.model';
import { KycDocumentType } from 'src/kyc/entities/kyc-document-types';
import { Kyc } from 'src/kyc/entities/kyc.model';
import { Role } from 'src/users/entities/roles.model';
import { UserRole } from 'src/users/entities/userRole.model';

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
        KycSetting,
        KycDocumentType,
        Kyc,
        Role,
        UserRole,
      ]);
      await sequelize.sync({
        alter: true,
        // force: true,
      });
      return sequelize;
    },
  },
];
