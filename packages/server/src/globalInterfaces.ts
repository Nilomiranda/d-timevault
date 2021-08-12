import {ParameterizedContext} from "koa";
import type { PrismaClient, Prisma } from '@prisma/client'
import Router from "koa-router";

export interface KoaContext extends ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any> {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation>
}
