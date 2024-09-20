import { MachineService } from './../machine/machine.service';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Stock } from './stock.schema';
import { UpdateStockDto } from './update-Stock.dto';
import { StockRepository } from './stock.repository';

@Injectable()
export class StockService {
  constructor(
    private readonly StockRepository: StockRepository,
    private readonly machineService: MachineService,
  ) {}

  async create(stockData: Stock[], userId: string): Promise<any> {
    try {
      const machineData: any = await this.machineService.findAll(userId);
      const machineNumbers = machineData.map(
        (machine) => machine.machineNumber,
      );
      const filteredStockData = stockData.filter(
        (stock) => !machineNumbers.includes(stock.machine as any),
      );

      if (filteredStockData.length !== 0) {
        throw new NotFoundException(
          `Machine numbers ${Array.from(new Set(filteredStockData?.map((i: any) => i.machine)))} not found`,
        );
      }
    } catch (error) {
      console.log('error::: ', error);
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create Stock');
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
        this.StockRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.StockRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.StockRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Stock> {
    const Stock = await this.StockRepository.findOne(id);
    if (!Stock) {
      throw new NotFoundException('Stock not found');
    }
    return Stock;
  }

  async update(
    id: string,
    Stock: UpdateStockDto,
    userId: string,
  ): Promise<Stock> {
    try {
      const existStock = await this.StockRepository.findOne(id);
      if (!existStock) {
        throw new NotFoundException('Stock not found');
      }
      return await this.StockRepository.update(id, Stock);
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
        throw new InternalServerErrorException('Failed to update Stock');
      }
    }
  }

  async remove(id: string): Promise<Stock> {
    try {
      const deletedStock = await this.StockRepository.remove(id);
      if (!deletedStock) {
        throw new NotFoundException('Stock not found');
      }
      return deletedStock;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Stock',
          error.message,
        );
      }
    }
  }
}
