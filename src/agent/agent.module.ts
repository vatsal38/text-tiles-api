import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { Agent, AgentSchema } from './agent.schema';
import { AgentRepository } from './agent.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
  ],
  controllers: [AgentController],
  providers: [AgentService, AgentRepository],
  exports: [AgentRepository],
})
export class AgentModule {}
