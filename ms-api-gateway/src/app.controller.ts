import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);
  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqp://user:o68wbnCiT1Yf@18.208.114.214:5672/api-smart-ranking',
        ],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get('categories')
  findCategories(@Query('categoryId') categoryId: string): Observable<any> {
    return this.clientAdminBackend.send(
      'get-categories',
      categoryId ? categoryId : '',
    );
  }

  @Put('categories/:categoryId')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.clientAdminBackend.emit('updaate-category', {
      id: categoryId,
      category: updateCategoryDto,
    });
  }
}
