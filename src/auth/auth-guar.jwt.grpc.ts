import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Metadata } from '@grpc/grpc-js';
import { AuthGuardJwt } from './auth-guard.jwt';
import * as jwt from 'jsonwebtoken';

interface Claim {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuardJwtGrpc extends AuthGuardJwt {
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToRpc();
    const metadata = ctx.getContext<Metadata>();
    const token = metadata.get('authorization')[0].toString();

    const claim = jwt.verify(token, process.env.JWT_SECRET) as Claim;
    if (claim.sub) {
      ctx.getContext().user = { id: claim.sub };
    }

    return { headers: { authorization: `Bearer ${token}` } };
  }
}
