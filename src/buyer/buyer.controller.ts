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
import { BuyerService } from './buyer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Buyer } from './buyer.schema';
import { UpdateBuyerDto } from './update-buyer.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Buyers')
@ApiBearerAuth()
@Controller('buyers')
export class BuyerController {
  constructor(private readonly BuyerService: BuyerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Buyer' })
  @ApiBody({ type: Buyer })
  async create(@Req() req: any, @Body() Buyer: Buyer) {
    const userId = req.user.userId;
    await this.BuyerService.create(Buyer, userId);
    return { message: 'Buyer created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all Buyers' })
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
    return this.BuyerService.findAll(userId, page, limit, search, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Buyer by id' })
  async findOne(@Param('id') id: string) {
    return this.BuyerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Buyer' })
  @ApiBody({ type: UpdateBuyerDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateBuyerDto: UpdateBuyerDto,
  ) {
    const userId = req.user.userId;
    await this.BuyerService.update(id, updateBuyerDto, userId);
    return { message: 'Buyer updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Buyer' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.BuyerService.remove(id);
    return { message: 'Buyer deleted successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Update Buyer status' })
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
    await this.BuyerService.updateStatus(updateStatusDto, userId);
    return { message: 'Buyer status updated successfully!' };
  }
}
