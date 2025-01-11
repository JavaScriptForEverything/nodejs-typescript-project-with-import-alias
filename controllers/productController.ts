import type { RequestHandler } from 'express'
import { promisify } from 'util'
import Product from '@/models/productModel'
import { appError, catchAsync } from '@/controllers/errorController'
import * as fileService from '@/services/fileService'
import { apiFeatures } from '@/lib/utils'


export const getProducts: RequestHandler = catchAsync(async (req, res, next) => {
	// const products = await Product.find({})
	
	let filter = {}
	const products = await apiFeatures(Product, req.query, filter)
	const total = await Product.countDocuments()

	res.json({
		status: 'success',
		total,
		count: products.length,
		data: products,
	})

})

export const addProduct: RequestHandler = catchAsync(async (req, res, next) => {
	try {
		if(req.body.coverPhoto) {
			// const { error, image: coverPhoto } = await fileService.handleBase64File(req.body.coverPhoto, '/products')
			const { error, image: coverPhoto } = await fileService.uploadFile(req.body.coverPhoto, '/products')
			if(error) return next(appError(`coverPhoto image upload error: ${error}`))
			req.body.coverPhoto = coverPhoto
		}
		const product = await Product.create(req.body)

		res.status(201).json({
			status: 'success',
			data: product
		})

	} catch (err) {
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.coverPhoto?.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
})