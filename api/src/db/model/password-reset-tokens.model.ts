import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'password_reset_tokens',
})
export class PasswordResetTokens extends Model {
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
  })
  token: string;
}
