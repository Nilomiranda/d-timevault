import Router from 'koa-router'

const router = new Router({
  prefix: "/api"
})

router.get("/status", (context) => {
  context.status = 200
  return context.response.body = {
    online: true
  }
})

export default router
