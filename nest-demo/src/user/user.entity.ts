import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as crypto from 'crypto';
import { IsEmail } from 'class-validator';

@Entity('user')
export class UserEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({default: ''})
    image: string;

    @Column()
    password: string;

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex')
    }
}

