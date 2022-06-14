import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './categories/entities/Category';
import { Player } from './players/entities/Player';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  private async categoryExists(categoryId: string): Promise<Category> {
    const categoryExists = await this.categoryModel
      .findOne({ _id: categoryId })
      .exec();

    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    return categoryExists;
  }

  async createCategory(category: Category): Promise<Category> {
    try {
      const newCategory = new this.categoryModel(category);
      return await newCategory.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async findCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().populate('players').exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async findCategory(categoryId: string): Promise<Category> {
    try {
      return await this.categoryExists(categoryId);
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async updateCategory(categoryId: string, category: Category) {
    await this.categoryExists(categoryId);

    try {
      await this.categoryModel.findOneAndUpdate(
        { category },
        { $set: category },
      );
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }
}
