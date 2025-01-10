const request = require('supertest')
const app = require('@/app')

it('GET /api/products', async () => {
	const res = await request(app)
	.get('/api/products')

	console.log(res.body.status)
	console.log(res.body.data)
})

