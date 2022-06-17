import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  create(createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  async find(_id: string): Promise<any> {
    return await lastValueFrom(
      this.clientAdminBackend.send('get-categories', _id ? _id : ''),
    );
  }

  update(updateCategoryDto: UpdateCategoryDto, _id: string) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: updateCategoryDto,
    });
  }
}
