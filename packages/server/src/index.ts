import Koa from 'koa'
import dotenv from 'dotenv'
import cors from '@koa/cors'
import router from './routes'
import bodyParser from 'koa-bodyparser'
import { PrismaClient } from '@prisma/client'
import Bree from 'bree'
import path from 'path'

const prisma = new PrismaClient()
const app = new Koa()

dotenv.config()

app.listen(process.env.PORT, () => {
  console.log(`Application running on port ${process.env.PORT}`)
})

prisma?.$connect().then(() => {
  console.log("Successfully connected to prisma client")
}).catch(err => {
  console.error("Error trying to connect to prisma client", err)
})

app.context.prisma = prisma

app.use(cors({
  allowMethods: ['OPTIONS', 'GET', 'HEAD', 'POST', 'DELETE', 'PATCH'],
}))

app.use(bodyParser())
app.use(router.routes())

const bree = new Bree({
  root: false,
  jobs: [
    {
      name: 'sendTimeCapsuleEmail',
      interval: 'Every 5 seconds',
      path: path.join(__dirname, '../jobs', 'sendTimeCapsuleEmail.js')
    },
    {
      name: 'deleteTimeCapsules',
      interval: 'Every 5 seconds',
      path: path.join(__dirname, '../jobs', 'deleteTimeCapsules.js')
    }
  ]
})

bree.stop().then(() => {
  bree.start()
})
