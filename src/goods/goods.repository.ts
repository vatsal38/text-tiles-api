import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Goods, GoodsDocument } from './goods.schema';

export class GoodsRepository {
  constructor(
    @InjectModel(Goods.name) private GoodsModel: Model<GoodsDocument>,
  ) {}

  async create(Goods: Goods, userId: string): Promise<Goods> {
    Goods.createdBy = userId;
    Goods.user = userId;
    const newGoods = new this.GoodsModel(Goods);
    return newGoods.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Goods[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.GoodsModel.find(query).populate('buyer').exec();
  }

  async findOne(id: string): Promise<Goods> {
    return this.GoodsModel.findById(id).populate('buyer').exec();
  }

  async update(id: string, Goods: Partial<Goods>): Promise<Goods> {
    return this.GoodsModel.findByIdAndUpdate(id, Goods, { new: true }).exec();
  }

  async remove(id: string): Promise<Goods> {
    return this.GoodsModel.findByIdAndDelete(id).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Goods[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.GoodsModel.find(query)
      .skip(skip)
      .limit(limit)
      .populate('buyer')
      .exec();
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
    return this.GoodsModel.countDocuments(query).populate('buyer').exec();
  }

  async highestCodeGoods(codePrefix: any) {
    return this.GoodsModel.findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Goods> {
    return this.GoodsModel.findByIdAndUpdate(
      id,
      { status, updatedBy: userId, updatedAt: new Date() },
      { new: true },
    ).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['productName', 'gstNo'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
