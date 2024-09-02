import express from 'express'
import { publicRouter } from './router/public-api'
import { error } from './middleware/error'

export const app = express()

app.use(express.json())
app.use(publicRouter)
app.use(error)