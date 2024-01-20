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
  tableName: 'applications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Applications extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ field: 'name', type: DataType.STRING })
  name: string;

  @Unique
  @Column({ field: 'application', type: DataType.STRING })
  application: string;

  @Column({ field: 'base_url', type: DataType.STRING })
  baseUrl: string;

  @Column({ field: 'client_secret_id', type: DataType.STRING })
  clientSecretId: string;

  @Column({ field: 'client_secret_key', type: DataType.STRING })
  clientSecretKey: string;

  @Column({ field: 'created_by', type: DataType.INTEGER })
  createdBy: number;

  @Column({ field: 'updated_by', type: DataType.INTEGER })
  updatedBy: number;

  @Column({ defaultValue: true })
  isActive: boolean;
}
