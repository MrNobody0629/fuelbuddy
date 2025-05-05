import { IsUUID, IsString } from 'class-validator';

export class ShareTaskDto {
  @IsUUID()
  taskId: string;

  @IsString()
  email: string;
}
