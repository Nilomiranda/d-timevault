import Koa from 'koa'
import dotenv from 'dotenv'
import router from './routes'
import bodyParser from 'koa-bodyparser'
import { PrismaClient } from '@prisma/client'

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

app.use(bodyParser())
app.use(router.routes())
