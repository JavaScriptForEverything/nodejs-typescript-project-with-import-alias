import { RequestHandler } from 'express'

export const getAllProducts: RequestHandler = (req, res) => {

	const products = [
		{
			id: 1,
			name: 'product 1',
			price: 300
		}
	]

	res.status(200).json({
		status: 'success',
		data: products
	})

}

export const addProduct: RequestHandler= (req, res) => {

	res.status(201).json({
		status: 'success',
		data: req.body
	})

}