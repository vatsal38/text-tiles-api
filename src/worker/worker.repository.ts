import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Worker, WorkerDocument } from './worker.schema';

export class WorkerRepository {
  constructor(
    @InjectModel(Worker.name) private WorkerModel: Model<WorkerDocument>,
  ) {}

  async create(Worker: Worker, userId: string): Promise<Worker> {
    Worker.createdBy = userId;
    Worker.user = userId;
    const newWorker = new this.WorkerModel(Worker);
    return newWorker.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Worker[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.WorkerModel.find(query).exec();
  }

  async findOne(id: string): Promise<Worker> {
    return this.WorkerModel.findById(id).exec();
  }

  async update(id: string, Worker: Partial<Worker>): Promise<Worker> {
    return this.WorkerModel.findByIdAndUpdate(id, Worker, { new: true }).exec();
  }

  async remove(id: string): Promise<Worker> {
    return this.WorkerModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Worker | null> {
    return this.WorkerModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Worker | null> {
    return this.WorkerModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Worker[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.WorkerModel.find(query).skip(skip).limit(limit).exec();
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
    return this.WorkerModel.countDocuments(query).exec();
  }

  async highestCodeWorker(codePrefix: any) {
    return this.WorkerModel.findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Worker> {
    return this.WorkerModel.findByIdAndUpdate(
      id,
      { status, updatedBy: userId, updatedAt: new Date() },
      { new: true },
    ).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = [
      'code',
      'name',
      'aadharNo',
      'phone',
      'currentAddress',
      'permanentAddress',
      'referenceName',
    ];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
