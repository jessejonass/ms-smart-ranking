import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';

@Injectable()
export class RankingsService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientRankingsBackend =
    this.clientProxySmartRanking.getClientProxyRankingInstance();

  async find(categoryId: string, dateRef: string): Promise<any> {
    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    return await lastValueFrom(
      this.clientRankingsBackend.send('get-rankings', {
        categoryId: categoryId,
        dateRef: dateRef ? dateRef : '',
      }),
    );
  }
}
