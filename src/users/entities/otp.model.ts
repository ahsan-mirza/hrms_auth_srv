import { de } from '@faker-js/faker/.';
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

export enum OtpReason {
    LOGIN = 'login',
    PASSWORD_RESET = 'password_reset',
    EMAIL_VERIFICATION = 'email_verification',
    FORGOT_PASSWORD = 'forgot_password',
    OTHERS = 'others',
}

@Table({
    tableName: 'otps',
    timestamps: true,
    paranoid: true,
})
export class Otp extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare identifier: string; // e.g., email or phone number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare otp: string; // The OTP value


    @Column({
        type: DataType.ENUM(...Object.values(OtpReason)), // Use the enum values
        allowNull: false,
        defaultValue: OtpReason.OTHERS, // Default value
    })
    declare reason: OtpReason;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare expiresAt: Date; // Expiration time for the OTP

    // status 
    @Column({
        type: DataType.ENUM('pending', 'verified'),
        defaultValue: 'pending',
    })
    declare status: 'pending' | 'verified'; // Status of the OTP



}