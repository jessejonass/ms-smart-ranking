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

  private async categoryExists(category: string): Promise<Category> {
    const categoryExists = await this.categoryModel
      .findOne({ category })
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
      console.log(err);
      throw new RpcException(err.message);
    }
  }

  async findCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().populate('players').exec();
    } catch (err) {
      console.log(err);
      throw new RpcException(err.message);
    }
  }

  async findCategory(category: string): Promise<Category> {
    try {
      return await this.categoryExists(category);
    } catch (err) {
      console.log(err);
      throw new RpcException(err.message);
    }
  }
}
