import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Challenge } from './entities/Challenge';
import { Player } from './entities/Player';
import { ClientProxySmartRanking } from './proxy/client-proxy';
import HTML_NOTIFICATION_OPPONENT from './static/html-notification-opponent';

@Injectable()
export class AppService {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private mailerService: MailerService,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async sendNotificationToOpponent(challenge: Challenge): Promise<void> {
    try {
      // identify opponent id
      let opponentId = '';

      challenge.players.map((player) => {
        if (String(player) != String(challenge.requester)) {
          opponentId = player;
        }
      });

      // get add info player
      const opponent: Player = await this.clientAdminBackend
        .send('get-players', opponentId)
        .toPromise();

      // .then((opp) => console.log('opponent', opp));

      const requester: Player = await this.clientAdminBackend
        .send('get-players', challenge.requester)
        .toPromise();

      // .then((req) => console.log('opponent', req));

      let markup = '';
      markup = HTML_NOTIFICATION_OPPONENT;
      markup = markup.replace(/#OPPONENT_NAME/g, opponent.name);
      markup = markup.replace(/#REQUESTER_NAME/g, requester.name);

      await this.mailerService
        .sendMail({
          to: opponent.email,
          from: `"SMART_RANKING" <jj13dev@gmail.com>`,
          subject: 'Challenge request',
          html: markup,
        })
        .then((success) => {
          console.log(success);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  }
}
