import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthSigninUserDto } from 'src/auth/dtos/auth-signin-user.dto';
import { AuthSignupUserDto } from 'src/auth/dtos/auth-signup-user.dto';
import { AwsCognitoConfig } from './aws-cognito.config';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor(private authConfig: AwsCognitoConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }
  async signup(authSignupUserDto: AuthSignupUserDto) {
    const { name, email, password, phoneNumber } = authSignupUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err.message);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async signin(authSigninUserDto: AuthSigninUserDto) {
    const { email, password } = authSigninUserDto;

    const authenticateDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticateDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err.message);
        },
      });
    });
  }
}
