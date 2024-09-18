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
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Seller } from './seller.schema';
import { UpdateSellerDto } from './update-seller.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Sellers')
@ApiBearerAuth()
@Controller('sellers')
export class SellerController {
  constructor(private readonly SellerService: SellerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Seller' })
  @ApiBody({ type: Seller })
  async create(@Req() req: any, @Body() Seller: Seller) {
    const userId = req.user.userId;
    await this.SellerService.create(Seller, userId);
    return { message: 'Seller created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all Sellers' })
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
    return this.SellerService.findAll(
      userId,
      page,
      limit,
      search,
      isSuperAdmin,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Seller by id' })
  async findOne(@Param('id') id: string) {
    return this.SellerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Seller' })
  @ApiBody({ type: UpdateSellerDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    const userId = req.user.userId;
    await this.SellerService.update(id, updateSellerDto, userId);
    return { message: 'Seller updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Seller' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.SellerService.remove(id);
    return { message: 'Seller deleted successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Update Seller status' })
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
    await this.SellerService.updateStatus(updateStatusDto, userId);
    return { message: 'Seller status updated successfully!' };
  }
}
