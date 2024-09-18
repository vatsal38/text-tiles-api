import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent, AgentDocument } from './agent.schema';

export class AgentRepository {
  constructor(
    @InjectModel(Agent.name) private AgentModel: Model<AgentDocument>,
  ) {}

  async create(agent: Agent, userId: string): Promise<Agent> {
    agent.createdBy = userId;
    agent.user = userId;
    const newAgent = new this.AgentModel(agent);
    return newAgent.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Agent[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.AgentModel.find(query).exec();
  }

  async findOne(id: string): Promise<Agent> {
    return this.AgentModel.findById(id).exec();
  }

  async update(id: string, agent: Partial<Agent>): Promise<Agent> {
    return this.AgentModel.findByIdAndUpdate(id, agent, { new: true }).exec();
  }

  async remove(id: string): Promise<Agent> {
    return this.AgentModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Agent | null> {
    return this.AgentModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Agent | null> {
    return this.AgentModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Agent[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.AgentModel.find(query).skip(skip).limit(limit).exec();
  }

  async countAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<number> {
    const query = this.createSearchQuery(search);

    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.AgentModel.countDocuments(query).exec();
  }

  async highestCodeAgent(codePrefix: any) {
    return this.AgentModel.findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Agent> {
    return this.AgentModel.findByIdAndUpdate(
      id,
      { status, updatedBy: userId, updatedAt: new Date() },
      { new: true },
    ).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['code', 'name', 'phone'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
