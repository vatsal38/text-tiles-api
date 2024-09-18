import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SellerRepository } from './seller.repository';
import { Seller } from './seller.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class SellerService {
  constructor(private readonly SellerRepository: SellerRepository) {}

  async create(seller: Seller, userId: string): Promise<Seller> {
    try {
      const codePrefix = 'SELL';
      const highestCodeSeller =
        await this.SellerRepository.highestCodeSeller(codePrefix);
      let currentCode = 1;
      if (highestCodeSeller) {
        const highestCode = highestCodeSeller.code.replace(codePrefix, '');
        currentCode = parseInt(highestCode, 10) + 1;
      }
      seller.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      return await this.SellerRepository.create(seller, userId);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
      if (error.keyPattern && error.keyPattern.gstNo) {
        throw new ConflictException('GST number already exists');
      }
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create Seller');
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
        this.SellerRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.SellerRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.SellerRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Seller> {
    const Seller = await this.SellerRepository.findOne(id);
    if (!Seller) {
      throw new NotFoundException('Seller not found');
    }
    return Seller;
  }

  async update(
    id: string,
    seller: Partial<Seller>,
    userId: string,
  ): Promise<Seller> {
    try {
      const existSeller = await this.SellerRepository.findOne(id);
      if (!existSeller) {
        throw new NotFoundException('Seller not found');
      }
      return await this.SellerRepository.update(id, seller);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
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
        throw new InternalServerErrorException('Failed to update Seller');
      }
    }
  }

  async remove(id: string): Promise<Seller> {
    try {
      const deletedSeller = await this.SellerRepository.remove(id);
      if (!deletedSeller) {
        throw new NotFoundException('Seller not found');
      }
      return deletedSeller;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Seller',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Seller> {
    const updatedSeller = await this.SellerRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedSeller) {
      throw new NotFoundException('Seller not found');
    }
    return updatedSeller;
  }
}
