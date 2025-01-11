import request from 'supertest'
import { app } from '@/app'
import { products } from '@/seeder/data'


describe.skip('GET /api/products', () => {

	it('get all products', async () => {
		const res = await request(app)
		.get('/api/products')

		console.log(res.body.status)
		console.log(res.body.data)
	})

})


describe('POST /api/products', () => {
	const [ firstProduct ] = products

	it('add product', async () => {
		const res = await request(app)
		.post('/api/products')
    .set('Content-Type', 'application/json')
		.set('Authorization', 'Bearer your_token') 	
		.send(firstProduct)

		console.log(res.body.status)
		console.log(res.body.message)
		console.log(res.body.data)
	})

	it('get all products', async () => {
		const res = await request(app)
		.get('/api/products')

		console.log(res.body.status)
		console.log(res.body.data)
	})
})
