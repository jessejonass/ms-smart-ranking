import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientRankingsBackend =
    this.clientProxySmartRanking.getClientProxyRankingInstance();

  @Get()
  find(
    @Query('categoryId') categoryId: string,
    @Query('dateRef') dateRef: string,
  ): Observable<any> {
    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    return this.clientRankingsBackend.send('get-rankings', {
      categoryId: categoryId,
      dateRef: dateRef ? dateRef : '',
    });
  }
}
