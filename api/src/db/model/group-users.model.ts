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
  tableName: 'group_users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class GroupUsers extends Model<GroupUsers> {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ field: 'user_id', type: DataType.INTEGER })
  userId: number;

  @Column({ field: 'group_id', type: DataType.INTEGER })
  groupId: number;

  @Column({ field: 'created_by', type: DataType.INTEGER })
  createdBy: number;

  @Column({ field: 'updated_by', type: DataType.INTEGER })
  updatedBy: number;
}
