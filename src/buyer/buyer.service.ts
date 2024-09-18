import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BuyerRepository } from './buyer.repository';
import { Buyer } from './buyer.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class BuyerService {
  constructor(private readonly BuyerRepository: BuyerRepository) {}

  async create(Buyer: Buyer, userId: string): Promise<Buyer> {
    try {
      const codePrefix = 'BUYR';
      const highestCodeBuyer =
        await this.BuyerRepository.highestCodeBuyer(codePrefix);
      let currentCode = 1;
      if (highestCodeBuyer) {
        const highestCode = highestCodeBuyer.code.replace(codePrefix, '');
        currentCode = parseInt(highestCode, 10) + 1;
      }
      Buyer.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      return await this.BuyerRepository.create(Buyer, userId);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create Buyer');
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
        this.BuyerRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.BuyerRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.BuyerRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Buyer> {
    const Buyer = await this.BuyerRepository.findOne(id);
    if (!Buyer) {
      throw new NotFoundException('Buyer not found');
    }
    return Buyer;
  }

  async update(
    id: string,
    Buyer: Partial<Buyer>,
    userId: string,
  ): Promise<Buyer> {
    try {
      const existBuyer = await this.BuyerRepository.findOne(id);
      if (!existBuyer) {
        throw new NotFoundException('Buyer not found');
      }
      return await this.BuyerRepository.update(id, Buyer);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update Buyer');
      }
    }
  }

  async remove(id: string): Promise<Buyer> {
    try {
      const deletedBuyer = await this.BuyerRepository.remove(id);
      if (!deletedBuyer) {
        throw new NotFoundException('Buyer not found');
      }
      return deletedBuyer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Buyer',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Buyer> {
    const updatedBuyer = await this.BuyerRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedBuyer) {
      throw new NotFoundException('Buyer not found');
    }
    return updatedBuyer;
  }
}
