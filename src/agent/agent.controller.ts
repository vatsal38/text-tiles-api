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
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Agent } from './agent.schema';
import { UpdateAgentDto } from './update-agent.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Agents')
@ApiBearerAuth()
@Controller('agents')
export class AgentController {
  constructor(private readonly AgentService: AgentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Agent' })
  @ApiBody({ type: Agent })
  async create(@Req() req: any, @Body() agent: Agent) {
    const userId = req.user.userId;
    await this.AgentService.create(agent, userId);
    return { message: 'Agent created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all Agents' })
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
    return this.AgentService.findAll(
      userId,
      page,
      limit,
      search,
      isSuperAdmin,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Agent by id' })
  async findOne(@Param('id') id: string) {
    return this.AgentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Agent' })
  @ApiBody({ type: UpdateAgentDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    const userId = req.user.userId;
    await this.AgentService.update(id, updateAgentDto, userId);
    return { message: 'Agent updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Agent' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.AgentService.remove(id);
    return { message: 'Agent deleted successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Update Agent status' })
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
    await this.AgentService.updateStatus(updateStatusDto, userId);
    return { message: 'Agent status updated successfully!' };
  }
}
