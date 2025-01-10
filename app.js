const express = require('express')
const productRouter = require('@/routes/productRoutes')

const app = express()

// app.use(express.json())
app.use(express.json({ limit: '20kb' }))


app.use('/api/products', productRouter)

module.exports = app