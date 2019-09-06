import { Controller, Get, Put, Body, UsePipes, Post, Delete, Param, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { User } from './user.decorator';
import { UserRO } from './user.interface'
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

import {
    ApiUseTags,
    ApiBearerAuth
} from '@nestjs/swagger';

// @ApiBearerAuth()
// @ApiUseTags('user')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('user')
    async findMe(@User('email') email: string): Promise<UserRO> {
        return await this.userService.findByEmail(email);
    }

    @Put('user')
    async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto): Promise<UserEntity> {
        return await this.userService.update(userId, userData);
    }

    @UsePipes(new ValidationPipe())
    @Post('users')
    async create(@Body('user') userDate: CreateUserDto): Promise<UserRO> {
        return this.userService.create(userDate);
    }

    @Delete('users/:username')
    async delete(@Param() params) {
        return this.userService.delete(params.username);
    }
    @UsePipes(new ValidationPipe())
    @Post('users/login')
    async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
        const _user = await this.userService.findOne(loginUserDto);

        const errors = { User: ' not found' };
        if (!_user) throw new HttpException({ errors }, 401);
        const token = await this.userService.generateJWT(_user)
        const { username, email, password, image } = _user;
        const user = { username, token, email, image };
        return { user }
    }
}
