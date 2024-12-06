import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { ProjectStatus } from '../enum/status.enum';
import { Users } from 'src/users/database/users.entity';
import { Tasks } from 'src/tasks/database/tasks.entity';

@Entity()
export class Projects extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
        default: null
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    dueDate: string;

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.OPEN,
    })
    status: ProjectStatus;

    @ManyToOne(() => Users, user => user.projects)
    created_by: Users;

    @ManyToMany(() => Users, user => user.projects)
    @JoinTable()
    members: Users[];

    @OneToMany(() => Tasks, task => task.project)
    tasks: Tasks[];

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: null
    })
    updated_at: Date;

    @DeleteDateColumn({
        type: 'timestamptz',
        default: null,
    })
    deleted_at?: Date;
}
