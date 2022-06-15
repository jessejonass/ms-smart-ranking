import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/Category';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  private readonly logger = new Logger(CategoriesService.name);

  private async categoryExists(_id: string): Promise<Category> {
    const categoryExists = await this.categoryModel
      .findOne({ _id })
      .populate('players')
      .exec();

    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    return categoryExists;
  }

  async create(category: Category): Promise<Category> {
    try {
      const newCategory = new this.categoryModel(category);
      return await newCategory.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async find(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().populate('players').exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async findOne(_id: string): Promise<Category> {
    try {
      return await this.categoryExists(_id);
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async update(_id: string, category: Category) {
    await this.categoryExists(_id);

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
