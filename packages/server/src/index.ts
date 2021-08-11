import Koa from 'koa'
import dotenv from 'dotenv'
import router from './routes'
import bodyParser from 'koa-bodyparser'
const app = new Koa()

dotenv.config()

app.listen(process.env.PORT, () => {
  console.log(`Application running on port ${process.env.PORT}`)
})

app.use(bodyParser())
app.use(router.routes())
