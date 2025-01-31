import type { Product } from '@/types/product'
import { Types } from 'mongoose'

import crypto from 'node:crypto'


export const products: Product[] = [
	{
		// _id: new Types.ObjectId('677f6f49e59bd404d1121fc2'),
		name: 'product-21',
		price: 650,
		coverPhoto: {
			public_id: crypto.randomUUID().toString(),
			// public_id: 'f61b5191-f67f-4338-ac62-388e2ce3507c',
			secure_url: '/upload/products/4735c288-47e7-4383-9ae5-1a22fbcfbfdb.gif'
		},
	},
	{
		// _id: new Types.ObjectId('677f6f49e59bd404d1121fc2'),
		name: 'product-22',
		price: 650,
		coverPhoto: {
			public_id: crypto.randomUUID().toString(),
			// public_id: 'f61b5191-f67f-4338-ac62-388e2ce3507c',
			secure_url: '/upload/products/4735c288-47e7-4383-9ae5-1a22fbcfbfdb.gif'
		},
	},
]

// export const products = [
// 	{
// 		// _id: '677e608df94b5dd496895cc2',
// 		name: 'product 1 added by script',
// 		price: 300,
// 		// coverPhoto: {
// 		// 	public_id: '',
// 		// 	secure_url: '/upload/products/image.png'
// 		// }

// 	}
// ]


		// coverPhoto: `
		// 	data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7
		// `

