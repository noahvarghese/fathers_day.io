import { PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export default abstract class BaseModel {
    @PrimaryGeneratedColumn()
    public id!: number;
    @CreateDateColumn()
    public readonly created_on!: Date;
    @UpdateDateColumn()
    public readonly updated_on!: Date;
    @DeleteDateColumn()
    public readonly deleted_on!: Date;
}
