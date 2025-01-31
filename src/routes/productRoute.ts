import * as productController from '@/controllers/productController'
import { Router } from 'express'

export const router = Router()

// => /api/products
router.route('/')
	.get(productController.getProducts)
	.post(productController.addProduct)

