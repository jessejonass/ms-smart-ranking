import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post('categories')
  @UsePipes(ValidationPipe)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get('categories')
  findAll(@Query('categoryId') categoryId: string): Observable<any> {
    return this.clientAdminBackend.send(
      'get-categories',
      categoryId ? categoryId : '',
    );
  }

  @Put('categories/:categoryId')
  @UsePipes(ValidationPipe)
  update(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.clientAdminBackend.emit('updaate-category', {
      id: categoryId,
      category: updateCategoryDto,
    });
  }
}
