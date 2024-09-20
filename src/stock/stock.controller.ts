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
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Stock } from './stock.schema';
import { UpdateStockDto } from './update-stock.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Stock Management')
@ApiBearerAuth()
@Controller('stock')
export class StockController {
  constructor(private readonly StockService: StockService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Stock' })
  @ApiBody({ type: [Stock] })
  async create(@Req() req: any, @Body() Stock: Stock[]) {
    const userId = req.user.userId;
    await this.StockService.create(Stock, userId);
    return { message: 'Stock created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all Stocks' })
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
    return this.StockService.findAll(userId, page, limit, search, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Stock by id' })
  async findOne(@Param('id') id: string) {
    return this.StockService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Stock' })
  @ApiBody({ type: UpdateStockDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    const userId = req.user.userId;
    await this.StockService.update(id, updateStockDto, userId);
    return { message: 'Stock updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Stock' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.StockService.remove(id);
    return { message: 'Stock deleted successfully!' };
  }
}
