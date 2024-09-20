import { MachineRepository } from './../machine/machine.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from './stock.schema';
import { UpdateStockDto } from './update-stock.dto';
import { NotFoundException } from '@nestjs/common';
import { MachineService } from 'src/machine/machine.service';

export class StockRepository {
  constructor(
    @InjectModel(Stock.name) private StockModel: Model<StockDocument>,
    private readonly machineService: MachineService,
  ) {}

  async create(stockData: Stock[], userId: any): Promise<Stock[]> {
    const createdStocks = [];
    for (const data of stockData) {
      const machine: any = await this.machineService.findByMachineNumber(
        data.machine as any,
        userId,
      );
      const newStock = new this.StockModel({
        serialNumber: data.serialNumber,
        machine: machine._id,
        meter: data.meter,
        type: data.type,
        createdBy: userId,
        user: userId,
      });

      createdStocks.push(await newStock.save());
    }
    return createdStocks;
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Stock[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return await this.StockModel.find(query).populate('machine').exec();
  }

  async findOne(id: string): Promise<Stock> {
    return this.StockModel.findById(id).populate('machine').exec();
  }

  async update(id: string, Stock: UpdateStockDto): Promise<Stock> {
    return this.StockModel.findByIdAndUpdate(id, Stock, { new: true }).exec();
  }

  async remove(id: string): Promise<Stock> {
    return this.StockModel.findByIdAndDelete(id).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Stock[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.StockModel.find(query)
      .skip(skip)
      .limit(limit)
      .populate('machine')
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
    return this.StockModel.countDocuments(query).populate('machine').exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Stock> {
    return this.StockModel.findByIdAndUpdate(
      id,
      { status, updatedBy: userId, updatedAt: new Date() },
      { new: true },
    ).exec();
  }

  private createSearchQuery(search: any): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['serialNumber', 'machine', 'type'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
