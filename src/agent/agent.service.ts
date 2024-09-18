import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AgentRepository } from './agent.repository';
import { Agent } from './agent.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class AgentService {
  constructor(private readonly AgentRepository: AgentRepository) {}

  async create(agent: Agent, userId: string): Promise<Agent> {
    try {
      const codePrefix = 'AGNT';
      const highestCodeAgent =
        await this.AgentRepository.highestCodeAgent(codePrefix);
      let currentCode = 1;
      if (highestCodeAgent) {
        const highestCode = highestCodeAgent.code.replace(codePrefix, '');
        currentCode = parseInt(highestCode, 10) + 1;
      }
      agent.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      return await this.AgentRepository.create(agent, userId);
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
        throw new InternalServerErrorException('Failed to create Agent');
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
        this.AgentRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.AgentRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.AgentRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Agent> {
    const Agent = await this.AgentRepository.findOne(id);
    if (!Agent) {
      throw new NotFoundException('Agent not found');
    }
    return Agent;
  }

  async update(
    id: string,
    Agent: Partial<Agent>,
    userId: string,
  ): Promise<Agent> {
    try {
      const existAgent = await this.AgentRepository.findOne(id);
      if (!existAgent) {
        throw new NotFoundException('Agent not found');
      }
      return await this.AgentRepository.update(id, Agent);
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
        throw new InternalServerErrorException('Failed to update Agent');
      }
    }
  }

  async remove(id: string): Promise<Agent> {
    try {
      const deletedAgent = await this.AgentRepository.remove(id);
      if (!deletedAgent) {
        throw new NotFoundException('Agent not found');
      }
      return deletedAgent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Agent',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Agent> {
    const updatedAgent = await this.AgentRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedAgent) {
      throw new NotFoundException('Agent not found');
    }
    return updatedAgent;
  }
}
