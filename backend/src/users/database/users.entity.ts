import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../enum/role.enum';
import { Projects } from 'src/projects/database/projects.entity';
import { Tasks } from 'src/tasks/database/tasks.entity';

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 50,
        default: null
    })
    name: string;

    @Column({
        unique: true,
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    email: string;

    @Column({
        length: 255,
        type: 'varchar',
        nullable: true
    })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToMany(() => Projects, project => project.created_by)
    projects: Projects[];

    @OneToMany(() => Tasks, task => task.assigned_to)
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
