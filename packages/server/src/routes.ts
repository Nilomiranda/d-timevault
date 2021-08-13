import Router from 'koa-router'
import { PrismaClient } from '@prisma/client'
import {createTimeCapsule} from "./timeCapsule/timeCapsuleCreate";
import {deleteTimeCapsule} from "./timeCapsule/timeCapsuleDelete";

const router = new Router({
  prefix: "/api"
})

router.get("/status", async (context) => {
  return context.response.body = {
    online: true,
  }
})

router.post('/time-capsules/create', createTimeCapsule)
router.delete('/time-capsules/delete', deleteTimeCapsule)

export default router
