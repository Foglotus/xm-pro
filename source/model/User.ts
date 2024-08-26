import { Type } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsInt,
    IsJWT,
    IsMobilePhone,
    IsOptional,
    IsString,
    IsStrongPassword,
    Min,
    ValidateNested
} from 'class-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import { NewData } from 'mobx-restful';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Base, BaseFilter, InputData, ListChunk } from './Base';

/** 用户性别枚举 */
export enum Gender {
    Female = 0,
    Male = 1,
    Other = 2
}

/** 用户角色 */
export enum Role {
    Administrator,
    Manager,
    Client
}

export type UserInputData<T> = NewData<Omit<T, keyof UserBase>, Base>;

export class UserFilter extends BaseFilter implements Partial<InputData<User>> {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsMobilePhone()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;
}

export class UserListChunk implements ListChunk<User> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => User)
    @ValidateNested({ each: true })
    list: User[];
}

/**
 * 登录数据
 */
export class SignInData implements Required<Pick<User, 'username' | 'password'>> {
    /** 用户名 */
    @IsString()
    username: string;
    /** 密码 */
    @IsString()
    password: string;
}

/**
 * 注册用户数据
 */
export class SignUpData
    extends SignInData
    implements Required<Pick<User, 'name' | 'username' | 'password'>>
{
    /** 用户姓名 */
    @IsString()
    name: string;

    /** 性别 */
    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    /** 邮箱 */
    @IsEmail()
    @IsOptional()
    email?: string;

    /** 手机号 */
    @IsMobilePhone()
    @IsOptional()
    phone?: string;
}

export interface JWTAction {
    context?: ParameterizedContext<JsonWebTokenError | { user: User }>;
}

@Entity()
export class User extends Base {
    /** 用户姓名 */
    @IsString()
    @Column()
    name: string;

    /** 用户登录名 */
    @IsString()
    @Column()
    username: string;

    /** 性别 */
    @IsEnum(Gender)
    @IsOptional()
    @Column({ enum: Gender, nullable: true })
    gender?: Gender;

    /** 邮箱 */
    @IsEmail()
    @IsOptional()
    @Column({ nullable: true })
    email?: string;

    /** 手机号 */
    @IsMobilePhone()
    @IsOptional()
    @Column({ nullable: true })
    phone?: string;

    /** 密码 */
    @IsStrongPassword()
    @IsOptional()
    @Column({ nullable: true, select: false })
    password?: string;

    /** 角色 */
    @IsEnum(Role, { each: true })
    @IsOptional()
    @Column('simple-json')
    roles: Role[];

    @IsJWT()
    @IsOptional()
    token?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    avatar?: string;
}

export abstract class UserBase extends Base {
    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    createdBy: User;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    updatedBy?: User;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    deletedBy?: User;
}
