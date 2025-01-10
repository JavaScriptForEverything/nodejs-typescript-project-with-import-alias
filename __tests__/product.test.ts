import request from 'supertest'
import app from '../src/app'

it('GET /api/products', async () => {
	const res = await request(app)
	.get('/api/products')

	console.log(res.body.status)
	console.log(res.body.data)
})

