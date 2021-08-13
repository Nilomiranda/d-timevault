import Router from 'koa-router'
import {createTimeCapsule} from "./timeCapsule/timeCapsuleCreate";
import {deleteTimeCapsule} from "./timeCapsule/timeCapsuleDelete";
import {updateTimeCapsule} from "./timeCapsule/timeCapsuleUpdate";

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
router.patch('/time-capsules/confirm', updateTimeCapsule)

export default router
