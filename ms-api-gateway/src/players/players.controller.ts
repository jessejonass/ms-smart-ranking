import { Controller } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();
}
