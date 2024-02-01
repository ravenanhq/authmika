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
  tableName: 'user_applications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UserApplications extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ field: 'user_id', type: DataType.INTEGER })
  userId: number;

  @Column({ field: 'application_id', type: DataType.INTEGER })
  applicationId: number;

  @Column({ field: 'created_by', type: DataType.INTEGER })
  createdBy: number;

  @Column({ field: 'updated_by', type: DataType.INTEGER })
  updatedBy: number;
}
