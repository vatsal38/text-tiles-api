import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller, SellerDocument } from './seller.schema';

export class SellerRepository {
  constructor(
    @InjectModel(Seller.name) private SellerModel: Model<SellerDocument>,
  ) {}

  async create(seller: Seller, userId: string): Promise<Seller> {
    seller.createdBy = userId;
    seller.user = userId;
    const newSeller = new this.SellerModel(seller);
    return newSeller.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Seller[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.SellerModel.find(query).exec();
  }

  async findOne(id: string): Promise<Seller> {
    return this.SellerModel.findById(id).exec();
  }

  async update(id: string, Seller: Partial<Seller>): Promise<Seller> {
    return this.SellerModel.findByIdAndUpdate(id, Seller, { new: true }).exec();
  }

  async remove(id: string): Promise<Seller> {
    return this.SellerModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Seller | null> {
    return this.SellerModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Seller | null> {
    return this.SellerModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Seller[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.SellerModel.find(query).skip(skip).limit(limit).exec();
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
    return this.SellerModel.countDocuments(query).exec();
  }

  async highestCodeSeller(codePrefix: any) {
    return this.SellerModel.findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Seller> {
    return this.SellerModel.findByIdAndUpdate(
      id,
      { status, updatedBy: userId, updatedAt: new Date() },
      { new: true },
    ).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['code', 'name', 'gstNo', 'phone', 'shopAddress'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
