import express from 'express'
import { publicRouter } from './router/public-api'
import { error } from './middleware/error'
import { apiRouter } from './router/api'

export const app = express()

app.use(express.json())
app.use(publicRouter)
app.use(apiRouter)
app.use(error)