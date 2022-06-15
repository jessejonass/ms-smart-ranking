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

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get()
  findAll(@Query('_id') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-categories', _id ? _id : '');
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  update(
    @Param('_id') _id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.clientAdminBackend.emit('updaate-category', {
      id: _id,
      category: updateCategoryDto,
    });
  }
}
