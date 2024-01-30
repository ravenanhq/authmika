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
  tableName: 'client_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class AuthClients extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ field: 'client_secret_id', type: DataType.STRING })
  clientSecretId: string;

  @Column({ field: 'client_secret_key', type: DataType.STRING })
  clientSecretKey: string;

  @Column({ field: 'redirect_url', type: DataType.STRING })
  redirectUrl: string;
}
