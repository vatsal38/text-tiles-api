import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AgentRepository } from '../agent/agent.repository';
import { BuyerRepository } from '../buyer/buyer.repository';
import { MachineRepository } from '../machine/machine.repository';
import { SellerRepository } from '../seller/seller.repository';
import { StockRepository } from '../stock/stock.repository';
import { WorkerRepository } from '../worker/worker.repository';

@ApiTags('Dashboard')
@Controller('dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly buyerRepository: BuyerRepository,
    private readonly machineRepository: MachineRepository,
    private readonly sellerRepository: SellerRepository,
    private readonly workerRepository: WorkerRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get count of all modules' })
  @ApiResponse({
    status: 200,
    description: 'Count data retrieved successfully.',
  })
  @Get('counts')
  async getCounts(@Req() req: any) {
    console.log('req::: ', req);
    const userId = req.user.userId;
    const [agentCount, buyerCount, machineCount, sellerCount, workerCount] =
      await Promise.all([
        this.agentRepository.countAll(userId),
        this.buyerRepository.countAll(userId),
        this.machineRepository.countAll(userId),
        this.sellerRepository.countAll(userId),
        this.workerRepository.countAll(userId),
      ]);

    return {
      agentCount,
      buyerCount,
      machineCount,
      sellerCount,
      workerCount,
    };
  }
}
