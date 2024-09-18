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
import { GoodsService } from './goods.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Goods } from './goods.schema';
import { UpdateGoodsDto } from './update-goods.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Goods')
@ApiBearerAuth()
@Controller('goods')
export class GoodsController {
  constructor(private readonly GoodsService: GoodsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Goods' })
  @ApiBody({ type: Goods })
  async create(@Req() req: any, @Body() Goods: Goods) {
    const userId = req.user.userId;
    await this.GoodsService.create(Goods, userId);
    return { message: 'Goods created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all Goodss' })
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
    return this.GoodsService.findAll(userId, page, limit, search, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Goods by id' })
  async findOne(@Param('id') id: string) {
    return this.GoodsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Goods' })
  @ApiBody({ type: UpdateGoodsDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateGoodsDto: UpdateGoodsDto,
  ) {
    const userId = req.user.userId;
    await this.GoodsService.update(id, updateGoodsDto, userId);
    return { message: 'Goods updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Goods' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.GoodsService.remove(id);
    return { message: 'Goods deleted successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Update Goods status' })
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
    await this.GoodsService.updateStatus(updateStatusDto, userId);
    return { message: 'Goods status updated successfully!' };
  }
}
