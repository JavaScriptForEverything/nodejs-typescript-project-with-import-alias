import type { Document, Types } from 'mongoose'
import type { Image } from '@/types/common'

/*
Split bellow to 2 different type:

export type ProductDocument = Document & {
	name: string
	price: number
	coverPhoto: Image
}

So that seeder script can used with types.
*/

export type Product = {
	_id?: Types.ObjectId

	name: string
	slug: string
	price: number
	coverPhoto: Image
}
export type ProductDocument = Document & Product