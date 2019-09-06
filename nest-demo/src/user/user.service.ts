import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../constants/secret';
import { UserRO } from './user.interface';
import * as crypto from 'crypto';
import { validate } from 'class-validator';
import { onErrorResumeNext } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findOne(LoginUserDto: LoginUserDto): Promise<UserEntity> {
        const findOneOption = {
            email: LoginUserDto.email,
            password: crypto.createHmac('sha256', LoginUserDto.password).digest("hex"),
        };
        return await this.userRepository.findOne(findOneOption);
    }

    async create(CreateUserDto: CreateUserDto): Promise<UserRO> {
        const { username, email, password } = CreateUserDto;
        const qb = await getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .orWhere('user.email = :email', { email });
        const user = await qb.getOne

        if(user) {
            const errors = {username: 'Username and email must be unique'}
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST)
        }
        //创建新的User
        let newUser = new UserEntity();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;

        const errors = await validate(newUser);
        if(errors.length > 0) {
            const _errors = {username: 'Userinput is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            const savedUser = await this.userRepository.save(newUser);
            return this.buildUserRO(savedUser);
        }
    }
    async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
        let toUpdate = await this.userRepository.findOne(id);
        delete toUpdate.password;
    
        let updated = Object.assign(toUpdate, dto);
        return await this.userRepository.save(updated);
    }
    async delete(email: string): Promise<DeleteResult> {
        return await this.userRepository.delete({ email: email});
    }
    async findByEmail(email: string): Promise<UserRO>{
        const user = await this.userRepository.findOne({email: email});
        return this.buildUserRO(user);
      }

    //加密
    public generateJWT(user) {
        let today = new Date();
        let exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        return jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            exp: exp.getTime() / 1000,
        }, SECRET)
    }
    private buildUserRO(user: UserEntity) {
        const userRO = {
          username: user.username,
          email: user.email,
          token: this.generateJWT(user),
          image: user.image
        };
        return {user: userRO};
    }
}
