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
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Roles extends Model<Roles> {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ field: 'name', type: DataType.STRING })
  name: string;

  @Column({ type: DataType.INTEGER })
  status: number;

  @Column({ field: 'created_by', type: DataType.INTEGER })
  createdBy: number;

  @Column({ field: 'updated_by', type: DataType.INTEGER })
  updatedBy: number;
  firstName: any;
}
