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
import { MachineService } from './machine.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Machine } from './machine.schema';
import { UpdateMachineDto } from './update-machine.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Machines')
@ApiBearerAuth()
@Controller('machines')
export class MachineController {
  constructor(private readonly MachineService: MachineService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Machine' })
  @ApiBody({ type: Machine })
  async create(@Req() req: any, @Body() machine: Machine) {
    const userId = req.user.userId;
    await this.MachineService.create(machine, userId);
    return { message: 'Machine created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all Machines' })
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
    return this.MachineService.findAll(
      userId,
      page,
      limit,
      search,
      isSuperAdmin,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Machine by id' })
  async findOne(@Param('id') id: string) {
    return this.MachineService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Machine' })
  @ApiBody({ type: UpdateMachineDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    const userId = req.user.userId;
    await this.MachineService.update(id, updateMachineDto, userId);
    return { message: 'Machine updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Machine' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.MachineService.remove(id);
    return { message: 'Machine deleted successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Update Machine status' })
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
    await this.MachineService.updateStatus(updateStatusDto, userId);
    return { message: 'Machine status updated successfully!' };
  }
}
