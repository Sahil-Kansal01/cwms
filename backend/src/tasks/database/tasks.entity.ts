import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Users } from 'src/users/database/users.entity';
import { Projects } from 'src/projects/database/projects.entity';
import { TaskStatus } from '../enum/tasks.enum';
import { Priority } from '../enum/priority.enum';

@Entity()
export class Tasks extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
        default: null
    })
    title: string;

    @Column({
        unique: true,
        type: 'varchar',
        nullable: true,
    })
    description: string;

    @ManyToOne(() => Projects, project => project.tasks)
    project: Projects;

    @ManyToOne(() => Users, user => user.tasks)
    assigned_to: Users;

    @Column({
        type: 'enum',
        enum: Priority,
        default: Priority.MEDIUM,
    })
    priority: Priority;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status: TaskStatus;

    @Column({ type: 'date' })
    dueDate: string;

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
