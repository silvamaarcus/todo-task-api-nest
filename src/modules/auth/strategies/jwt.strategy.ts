import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token JWT do cabeçalho Authorization como Bearer token
      secretOrKey: config.get<string>('JWT_ACCESS_TOKEN_SECRET')!, // Obtém a chave secreta do JWT do arquivo de configuração
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  } // Valida e retorna o payload do token JWT, que será anexado ao objeto de solicitação (request) para uso posterior nos controladores e serviços
}
