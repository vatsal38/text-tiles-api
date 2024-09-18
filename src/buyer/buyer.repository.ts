import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buyer, BuyerDocument } from './buyer.schema';

export class BuyerRepository {
  constructor(
    @InjectModel(Buyer.name) private BuyerModel: Model<BuyerDocument>,
  ) {}

  async create(Buyer: Buyer, userId: string): Promise<Buyer> {
    Buyer.createdBy = userId;
    Buyer.user = userId;
    const newBuyer = new this.BuyerModel(Buyer);
    return newBuyer.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Buyer[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.BuyerModel.find(query).exec();
  }

  async findOne(id: string): Promise<Buyer> {
    return this.BuyerModel.findById(id).exec();
  }

  async update(id: string, Buyer: Partial<Buyer>): Promise<Buyer> {
    return this.BuyerModel.findByIdAndUpdate(id, Buyer, { new: true }).exec();
  }

  async remove(id: string): Promise<Buyer> {
    return this.BuyerModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Buyer | null> {
    return this.BuyerModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Buyer | null> {
    return this.BuyerModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Buyer[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.BuyerModel.find(query).skip(skip).limit(limit).exec();
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
    return this.BuyerModel.countDocuments(query).exec();
  }

  async highestCodeBuyer(codePrefix: any) {
    return this.BuyerModel.findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Buyer> {
    return this.BuyerModel.findByIdAndUpdate(
      id,
      { status, updatedBy: userId, updatedAt: new Date() },
      { new: true },
    ).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['code', 'name', 'phone', 'address'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
