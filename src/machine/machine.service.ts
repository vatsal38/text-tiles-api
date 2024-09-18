import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MachineRepository } from './machine.repository';
import { Machine } from './machine.schema';

@Injectable()
export class MachineService {
  constructor(private readonly MachineRepository: MachineRepository) {}

  async create(machine: Machine, userId: string): Promise<Machine> {
    try {
      const codePrefix = 'MCH';
      const highestCodeMachine =
        await this.MachineRepository.highestCodeMachine(codePrefix);
      let currentCode = 1;
      if (highestCodeMachine) {
        const highestCode = highestCodeMachine.code.replace(codePrefix, '');
        currentCode = parseInt(highestCode, 10) + 1;
      }
      machine.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      return await this.MachineRepository.create(machine, userId);
    } catch (error) {
      if (error.keyPattern && error.keyValue.machineNumber) {
        throw new ConflictException('Machine already exists');
      }
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create Machine');
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
        this.MachineRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.MachineRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.MachineRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Machine> {
    const Machine = await this.MachineRepository.findOne(id);
    if (!Machine) {
      throw new NotFoundException('Machine not found');
    }
    return Machine;
  }

  async update(
    id: string,
    Machine: Partial<Machine>,
    userId: string,
  ): Promise<Machine> {
    try {
      const existMachine = await this.MachineRepository.findOne(id);
      if (!existMachine) {
        throw new NotFoundException('Machine not found');
      }
      return await this.MachineRepository.update(id, Machine);
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
        throw new InternalServerErrorException('Failed to update Machine');
      }
    }
  }

  async remove(id: string): Promise<Machine> {
    try {
      const deletedMachine = await this.MachineRepository.remove(id);
      if (!deletedMachine) {
        throw new NotFoundException('Machine not found');
      }
      return deletedMachine;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Machine',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Machine> {
    const updatedMachine = await this.MachineRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedMachine) {
      throw new NotFoundException('Machine not found');
    }
    return updatedMachine;
  }
}
