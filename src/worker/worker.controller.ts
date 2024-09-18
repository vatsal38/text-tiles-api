import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Worker } from './worker.schema';
import { UpdateWorkerDto } from './update-worker.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Workers')
@ApiBearerAuth()
@Controller('workers')
export class WorkerController {
  constructor(private readonly WorkerService: WorkerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Worker' })
  @ApiBody({ type: Worker })
  async create(@Req() req: any, @Body() Worker: Worker) {
    const userId = req.user.userId;
    await this.WorkerService.create(Worker, userId);
    return { message: 'Worker created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all Workers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;
    return this.WorkerService.findAll(
      userId,
      page,
      limit,
      search,
      isSuperAdmin,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Worker by id' })
  async findOne(@Param('id') id: string) {
    return this.WorkerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Worker' })
  @ApiBody({ type: UpdateWorkerDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ) {
    const userId = req.user.userId;
    await this.WorkerService.update(id, updateWorkerDto, userId);
    return { message: 'Worker updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Worker' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.WorkerService.remove(id);
    return { message: 'Worker deleted successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Update Worker status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'boolean' },
      },
    },
  })
  async updateStatus(
    @Req() req: any,
    @Body() updateStatusDto: { id: string; status: boolean },
  ) {
    const userId = req.user.userId;
    await this.WorkerService.updateStatus(updateStatusDto, userId);
    return { message: 'Worker status updated successfully!' };
  }
}
