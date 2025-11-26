import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateUserByAdminDto {
    @IsInt({ message: 'Quota must be an integer' })
    @Min(1, { message: 'Quota must be at least 1MB' })
    @IsOptional()
    @ApiProperty()
    storageQuota?: number;
}
