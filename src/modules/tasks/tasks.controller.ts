import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateTaskUseCase } from '@/domain/use-cases/tasks/create-task.use-case';
import { DeleteTaskUseCase } from '@/domain/use-cases/tasks/delete-task.use-case';
import { GetTaskUseCase } from '@/domain/use-cases/tasks/get-task.use-case';
import { ListTasksUseCase } from '@/domain/use-cases/tasks/list-tasks.use-case';
import { UpdateTaskUseCase } from '@/domain/use-cases/tasks/update-task.use-case';
import { JwtGuard } from '@/modules/auth/guards/jwt.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks') // Define a rota base para este controller, todas as rotas serão prefixadas com /tasks
@UseGuards(JwtGuard) // Garante que todas as rotas deste controller estarão protegidas pelo JWT
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  // POST /tasks -> criar uma nova tarefa do usuário autenticado
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: JwtPayload) {
    const createTask = await this.createTaskUseCase.execute({
      ...dto, // Desestrutura o DTO para passar os dados da task
      user_id: user.sub, // Adiciona o user_id vindo do token, não do body p/ criar a task
    });

    return createTask;
  }

  // GET /tasks -> listar todas as tarefas do usuário autenticado
  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    const allTasks = await this.listTasksUseCase.execute({ user_id: user.sub });

    return allTasks;
  }

  // GET /tasks/:id -> obter uma task pelo Id do usuário autenticado
  @Get(':id')
  async getById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const task = await this.getTaskUseCase.execute({ id, user_id: user.sub });

    return task;
  }

  // PATCH /tasks/:id -> atualizar uma task pelo Id do usuário autenticado
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const updateTask = await this.updateTaskUseCase.execute({
      id,
      user_id: user.sub,
      ...dto, // Desestrutura o DTO para passar os dados da task
    });

    return updateTask;
  }

  // DELETE /tasks/:id -> deletar uma task pelo Id do usuário autenticado
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const deleteTask = await this.deleteTaskUseCase.execute({
      id,
      user_id: user.sub,
    });

    return deleteTask;
  }
}
