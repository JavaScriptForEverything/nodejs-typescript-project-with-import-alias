import express from 'express'
import productRouter from '@/routes/productRoutes'

const app = express()

// app.use(express.json())
app.use(express.json({ limit: '20kb' }))


app.use('/api/products', productRouter)

export default app