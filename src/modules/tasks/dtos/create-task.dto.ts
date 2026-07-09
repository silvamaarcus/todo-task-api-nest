import { ApiProperty } from '@nestjs/swagger';
import { TaskType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Nova tarefa' })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'Descrição da nova tarefa' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: TaskType.TODO, enum: TaskType })
  @IsEnum(TaskType)
  @IsOptional()
  status?: TaskType;
}
