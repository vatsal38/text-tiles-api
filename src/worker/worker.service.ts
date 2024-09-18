import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { WorkerRepository } from './worker.repository';
import { Worker } from './worker.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class WorkerService {
  constructor(private readonly WorkerRepository: WorkerRepository) {}

  async create(Worker: Worker, userId: string): Promise<Worker> {
    try {
      const codePrefix = 'FAR';
      const highestCodeWorker =
        await this.WorkerRepository.highestCodeWorker(codePrefix);
      let currentCode = 1;
      if (highestCodeWorker) {
        const highestCode = highestCodeWorker.code.replace(codePrefix, '');
        currentCode = parseInt(highestCode, 10) + 1;
      }
      Worker.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      return await this.WorkerRepository.create(Worker, userId);
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
        throw new InternalServerErrorException('Failed to create Worker');
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
        this.WorkerRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.WorkerRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.WorkerRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Worker> {
    const Worker = await this.WorkerRepository.findOne(id);
    if (!Worker) {
      throw new NotFoundException('Worker not found');
    }
    return Worker;
  }

  async update(
    id: string,
    Worker: Partial<Worker>,
    userId: string,
  ): Promise<Worker> {
    try {
      const existWorker = await this.WorkerRepository.findOne(id);
      if (!existWorker) {
        throw new NotFoundException('Worker not found');
      }
      return await this.WorkerRepository.update(id, Worker);
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
        throw new InternalServerErrorException('Failed to update Worker');
      }
    }
  }

  async remove(id: string): Promise<Worker> {
    try {
      const deletedWorker = await this.WorkerRepository.remove(id);
      if (!deletedWorker) {
        throw new NotFoundException('Worker not found');
      }
      return deletedWorker;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Worker',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Worker> {
    const updatedWorker = await this.WorkerRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedWorker) {
      throw new NotFoundException('Worker not found');
    }
    return updatedWorker;
  }
}
