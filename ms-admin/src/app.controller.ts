import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './categories/entities/Category';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    console.log(category);
    await this.appService.createCategory(category);
  }

  @MessagePattern('get-categories')
  async findCategories(@Payload() categoryId: string) {
    if (categoryId) {
      return await this.appService.findCategory(categoryId);
    } else {
      return await this.appService.findCategories();
    }
  }
}
