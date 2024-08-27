import { Type } from 'class-transformer';
import {
    IsInt,
    IsJSON,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './Base';
import { User } from './User';

/**
 * 课程上课星期
 */
export enum CourseOpenWeek{
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}

/**
 * 课程开设那节课,一天8节课
 */
export enum CourseOpenTimeRange{
    First = 1,
    Second = 2,
    Third = 3,
    Fourth = 4,
    Fifth = 5,
    Sixth = 6,
    Seventh = 7,
    Eighth = 8
}

/**
 * 注册课程数据
 */
export class CourseAddData implements Required<Pick<Course, 'openTime' | 'name' | 'capacity' | 'description'>>
{
    @IsInt()
    capacity: number;

    @IsString()
    @IsOptional()
    description: string;

    @IsJSON()
    openTime: string;

    /** 课程名称 */
    @IsString()
    name: string;
}

/**
 * 更新课程数据
 */
export class CourseUpdateData implements Required<Pick<Course, 'openTime' | 'name' | 'capacity' | 'description' | 'id'>>
{
    @IsInt()
    id: number;
    
    @IsInt()
    capacity: number;

    @IsString()
    @IsOptional()
    description: string;

    @IsJSON()
    openTime: string;

    /** 课程名称 */
    @IsString()
    name: string;
}


@Entity()
export class Course extends Base {
    /** 课程名 */
    @IsString()
    @Column()
    name: string;

    /** 课程容量 */
    @IsInt()
    @Column()
    capacity: number;

    /** 课程描述 */
    @IsString()
    @Column()
    @IsOptional()
    description?: string;

    /** 开课时间周, 形如 [11,12] 第一位是星期几，第二位是第几节课 */
    @IsString()
    @Column('simple-json')
    openTime: string;

    /** 已经报名人数 */
    @IsInt()
    @Column()
    joinCount: number
}

export abstract class CourseBase extends Base {
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
