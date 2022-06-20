import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthSigninUserDto } from './dtos/auth-signin-user.dto';
import { AuthSignupUserDto } from './dtos/auth-signup-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() authSignupUserDto: AuthSignupUserDto) {
    return await this.awsCognitoService.signup(authSignupUserDto);
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() authSigninUserDto: AuthSigninUserDto) {
    return await this.awsCognitoService.signin(authSigninUserDto);
  }
}
