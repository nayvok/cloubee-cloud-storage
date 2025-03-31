import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MkdirDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    idContext: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    folderName: string;
}
