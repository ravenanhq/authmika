import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Groups } from './groups.model';

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Users extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ field: 'first_name', type: DataType.STRING })
  firstName: string;

  @Column({ field: 'last_name', type: DataType.STRING })
  lastName: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ field: 'email_verified_at', type: DataType.STRING })
  emailVerifiedAt: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.STRING })
  mobile: string;

  @Column({ field: 'role', type: DataType.STRING })
  role: string;

  @ForeignKey(() => Groups)
  @Column({ field: 'group_id', type: DataType.INTEGER })
  groupId: number;

  @Column({ defaultValue: false })
  isTwoFactorEnabled: boolean;

  @Column({ field: 'is_two_factor_enabled' })
  is_two_factor_enabled: boolean;

  @Column({ field: 'two_factor_secret', type: DataType.TEXT })
  two_factor_secret: string;

  @Column({ field: 'two_factor_recovery_codes', type: DataType.STRING })
  twoFactorRecoveryCodes: string;

  @Column({ field: 'created_by', type: DataType.INTEGER })
  createdBy: string;

  @Column({ field: 'updated_by', type: DataType.INTEGER })
  updatedBy: string;

  @Column({ field: 'email_verification_token', type: DataType.STRING })
  emailVerificationToken: string;

  @Column({ type: DataType.INTEGER })
  status: number;

  @Column({ type: DataType.INTEGER })
  otp: number;

  @Column({ type: DataType.BIGINT })
  otp_expiration: number;

  isSelected: boolean;
  created_at: any;

  @BelongsTo(() => Groups)
  groups: Groups;
}
