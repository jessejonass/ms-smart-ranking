import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './categories/entities/Category';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(category);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (err) {
      this.logger.error(err);

      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('get-categories')
  async findCategories(
    @Payload() categoryId: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (categoryId) {
        return await this.appService.findCategory(categoryId);
      } else {
        return await this.appService.findCategories();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const categoryId = data.categoryId;
      const category: Category = data.category;

      await this.appService.updateCategory(categoryId, category);
      await channel.ack(originalMessage);
    } catch (err) {
      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }
}
