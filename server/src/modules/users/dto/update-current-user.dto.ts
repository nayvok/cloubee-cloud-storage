import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCurrentUserDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    name?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    @ApiProperty()
    currentPassword?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    @ApiProperty()
    newPassword?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    avatarPath?: string;
}
