import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Users extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ field: 'user_name', type: DataType.STRING })
  userName: string;

  @Column({ field: 'display_name', type: DataType.STRING })
  displayName: string;

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

  @Column({ defaultValue: true })
  isTwoFactorEnabled: boolean;

  @Column({ field: 'two_factor_recovery_codes', type: DataType.STRING })
  twoFactorRecoveryCodes: string;

  @Column({ field: 'created_by', type: DataType.INTEGER })
  createdBy: string;

  @Column({ field: 'updated_by', type: DataType.INTEGER })
  updatedBy: string;

  @Column({ field: 'email_verification_token', type: DataType.STRING })
  emailVerificationToken: string;

  @Column({ defaultValue: true })
  isActive: boolean;
}
