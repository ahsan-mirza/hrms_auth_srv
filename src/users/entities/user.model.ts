import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Sequelize,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
  Index,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { QuestionAnswer } from './question-answer.model';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Table({
  tableName: 'users',
  indexes: [
    {
      fields: ['email'],
      unique: true,
    }, // ✅ Frequently searched during login or uniqueness checks

    {
      fields: ['username'],
      unique: true,
    }, // ✅ Useful for login/search and ensures uniqueness

    {
      fields: ['referral_code'],
      unique: true,
    }, // ✅ Used to generate referral links and check ownership

    {
      fields: ['register_refer_code'],
    }, // ✅ When tracking who used whose referral link during registration

    {
      fields: ['parent_id'],
    }, // ✅ For fetching downlines or building the referral tree

    {
      fields: ['referred_by'],
    }, // ✅ search by referrer code instead of ID

    {
      fields: ['status'],
    }, // ✅ Filtering by ACTIVE, INACTIVE, etc.

    {
      fields: ['upline_path'],
      // using: 'gin',
    }, // ✅ query users by path segments (Postgres text search)

    {
      fields: ['upline_ids'],
      using: 'gin',
    }, //  ✅ For array field querying (Postgres only)
  ],
})
export class User extends Model {
  @Column(DataType.STRING)
  declare firstName: string;

  @Column(DataType.STRING)
  declare lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare username: string;

  @Column(DataType.DATE)
  declare dateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare referralCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare kyc_profile_url: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare parentId: number | null;

  @Column(DataType.STRING)
  declare referredBy: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare registerReferCode: string;

  @Column(DataType.TEXT)
  declare uplinePath: string;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: true,
    defaultValue: Sequelize.literal('ARRAY[]::INTEGER[]'),
  })
  declare uplineIds: number[];

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare directReferrals: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare totalTeamMembers: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare depth: number; // Depth of the user in the referral tree

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare kyc_approved: boolean;

  @Column({ type: DataType.STRING, defaultValue: '' })
  declare kyc_status: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  declare kyc_expiry: string;

  @Column(DataType.STRING)
  declare profileImage: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserStatus),
    defaultValue: UserStatus.ACTIVE,
  })
  declare status: UserStatus;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare metadata: object;

  @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      return this.directReferrals > 0;
    },
  })
  declare hasCommunity: boolean;

  @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    },
  })
  declare fullName: string;

  // ==== HOOKS ====

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const hashed = await bcrypt.hash(instance.password, 10);
      instance.password = hashed;
    }
  }
  @BeforeCreate
  static setDefaultUsername(instance: User) {
    if (!instance.username) {
      const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      instance.username =
        `${instance.firstName}${instance.lastName}${randomNum}`.toLowerCase();
    }
  }

  // ==== RELATIONS ====

  @HasMany(() => QuestionAnswer)
  questionAnswers: QuestionAnswer[]; // User can have multiple question answers

  // ==== METHODS ====
  // Optional method to compare password
  async checkPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
