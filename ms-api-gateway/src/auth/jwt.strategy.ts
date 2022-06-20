import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AwsCognitoConfig } from '../aws/aws-cognito.config';
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authConfig: AwsCognitoConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: authConfig.clientId,
      issue: authConfig.clientId,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    console.log('PAYLOAD', payload);
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
