import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { Category } from './entities/Category';

const ackErrors: string[] = ['E11000'];

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  logger = new Logger(CategoriesController.name);

  @EventPattern('create-category')
  async create(@Payload() category: Category, @Ctx() context: RmqContext) {
    this.logger.log(category);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.categoriesService.create(category);
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
  async find(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (_id) {
        return await this.categoriesService.findOne(_id);
      } else {
        return await this.categoriesService.find();
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
      const _id = data._id;
      const category: Category = data.category;

      await this.categoriesService.update(_id, category);
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
