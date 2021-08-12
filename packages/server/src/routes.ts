import Router from 'koa-router'
import { PrismaClient } from '@prisma/client'
import {createTimeCapsule} from "./timeCapsule/timeCapsuleCreate";

const router = new Router({
  prefix: "/api"
})

router.get("/status", async (context) => {
  return context.response.body = {
    online: true,
  }
})

router.post('/time-capsules/create', createTimeCapsule)

export default router
