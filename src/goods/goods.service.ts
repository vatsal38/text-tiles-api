import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { GoodsRepository } from './goods.repository';
import { Goods, GoodsStatus } from './goods.schema';

@Injectable()
export class GoodsService {
  constructor(private readonly GoodsRepository: GoodsRepository) {}

  async create(Goods: Goods, userId: string): Promise<Goods> {
    try {
      return await this.GoodsRepository.create(Goods, userId);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.gstNo) {
        throw new ConflictException('GST number already exists');
      }
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create Goods');
      }
    }
  }

  async findAll(
    userId: string,
    page?: number,
    limit?: number,
    search?: string,
    isSuperAdmin?: boolean,
  ) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.GoodsRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.GoodsRepository.countAll(userId, search, isSuperAdmin),
      ]);
      const totalPages = Math.ceil(totalRecords / limit);
      return {
        items,
        recordsPerPage: limit,
        totalRecords,
        currentPageNumber: page,
        totalPages,
      };
    } else {
      const items = await this.GoodsRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Goods> {
    const Goods = await this.GoodsRepository.findOne(id);
    if (!Goods) {
      throw new NotFoundException('Goods not found');
    }
    return Goods;
  }

  async update(
    id: string,
    Goods: Partial<Goods>,
    userId: string,
  ): Promise<Goods> {
    try {
      const existGoods = await this.GoodsRepository.findOne(id);
      if (!existGoods) {
        throw new NotFoundException('Goods not found');
      }
      return await this.GoodsRepository.update(id, Goods);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.gstNo) {
        throw new ConflictException('GST number already exists');
      }
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update Goods');
      }
    }
  }

  async remove(id: string): Promise<Goods> {
    try {
      const deletedGoods = await this.GoodsRepository.remove(id);
      if (!deletedGoods) {
        throw new NotFoundException('Goods not found');
      }
      return deletedGoods;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Goods',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Goods> {
    if (!Object.values(GoodsStatus).includes(updateStatusDto.status)) {
      throw new BadRequestException(
        `Status must be one of: Pending, Paid, Over Due Date, Paid (Over Due Date)`,
      );
    }
    const updatedGoods = await this.GoodsRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedGoods) {
      throw new NotFoundException('Goods not found');
    }
    return updatedGoods;
  }
}
