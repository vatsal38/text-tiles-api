import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Machine, MachineDocument } from './machine.schema';

export class MachineRepository {
  constructor(
    @InjectModel(Machine.name) private MachineModel: Model<MachineDocument>,
  ) {}

  async create(machine: Machine, userId: string): Promise<Machine> {
    machine.createdBy = userId;
    machine.user = userId;
    const newMachine = new this.MachineModel(machine);
    return newMachine.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Machine[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.MachineModel.find(query).exec();
  }

  async findOne(id: string): Promise<Machine> {
    return this.MachineModel.findById(id).exec();
  }

  async update(id: string, Machine: Partial<Machine>): Promise<Machine> {
    return this.MachineModel.findByIdAndUpdate(id, Machine, {
      new: true,
    }).exec();
  }

  async remove(id: string): Promise<Machine> {
    return this.MachineModel.findByIdAndDelete(id).exec();
  }

  async findByMachineNumber(
    machineNumber: string,
    userId: string,
  ): Promise<Machine | null> {
    return this.MachineModel.findOne(
      { machineNumber },
      { createdBy: userId },
    ).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Machine[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.MachineModel.find(query).skip(skip).limit(limit).exec();
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
    return this.MachineModel.countDocuments(query).exec();
  }

  async highestCodeMachine(codePrefix: any) {
    return this.MachineModel.findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Machine> {
    return this.MachineModel.findByIdAndUpdate(
      id,
      { status, updatedBy: userId, updatedAt: new Date() },
      { new: true },
    ).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['floor', 'machineNumber', 'code'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
