import { Router } from 'express'
import { router as productRouter } from '@/routes/productRoute' 
import { router as fileRouter } from '@/routes/fileRoute' 


// => / 	(root)
const router = Router()

router.use('/upload', fileRouter)
router.use('/api/products', productRouter)


export default router
