import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Cache } from 'cache-manager';
import { uuid as uuidv4, isUuid as uuidValidate } from 'uuidv4';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async googleRedirect(req: Request, res: Response) {
    try {
      const code = req.query.code as string;

      const { id_token, access_token } = await this.getGoogleAuthTokens({
        code,
      });

      console.log(id_token);

      // res.redirect(`http://localhost:3001/#/auth/login?id=${userTempId}`);
    } catch (error) {
      console.error(error);
      res.redirect('http://localhost:3001/oauth/error');
    }
  }

  public async googleLogin(req: Request, res: Response) {
    const authorzation = req.get('authorization');
    if (!authorzation) throw new UnauthorizedException();
    const userId = authorzation.replace('Bearer', '');
    if (!uuidValidate(userId)) throw new UnauthorizedException();

    const googleUser = await this.cacheManager.get(
      `temp-google-user__${userId}`,
    );

    return googleUser;
  }

  async getGoogleAuthTokens({
    code,
  }: {
    code: string;
  }): Promise<GoogleTokensResult> {
    try {
      const url = 'https://oauth2.googleapis.com/token';
      const values = {
        code,
        client_id:
          '490727912631-0a5k0bd303pukkf664dd79aruadpotq5.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:3000/auth/google/callback',
        grant_type: 'authorization_code',
      };

      console.log('valuesss:', values.toString());

      const qs = JSON.stringify(new URLSearchParams(values));
      const res = await axios.post<GoogleTokensResult>(url, qs, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoding' },
      });
      console.log({ values });

      return res.data;
    } catch (error) {
      console.error(error.response.data.error);
      console.error(error, 'Failed to fetch Google Oauth Tokens');
      throw new Error(error.message);
    }
  }
}

interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}
