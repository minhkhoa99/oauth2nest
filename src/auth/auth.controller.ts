import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}
  @Get('/test')
  @Render('test')
  async getTitlte() {
    return { message: 'hehehe' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    return this.appService.googleRedirect(req, res);
  }

  @Post('google/login')
  googleLogin(@Req() req, @Res() res) {
    return this.appService.googleLogin(req, res);
  }
}
