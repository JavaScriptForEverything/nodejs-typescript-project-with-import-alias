import { Router } from 'express'
import * as productController from '@/controllers/productController'

const router = Router()

router.route('/')
	.get(productController.getAllProducts)
	.post(productController.addProduct)

export default router
