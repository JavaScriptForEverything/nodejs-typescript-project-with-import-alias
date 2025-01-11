import type { Model } from 'mongoose'
import type { ProductDocument } from '@/types/product'
import { model, Schema } from 'mongoose'
import { Collection } from '@/types/constants'
import { sanitizeSchema } from '@/services/sanitizeService'


const productSchema = new Schema<ProductDocument>({
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
	},

	price: {
		type: Number,
		required: true,
		min: 0
	},

	coverPhoto: {
		public_id: {
			type: String,
			// required: true,
		},
		secure_url: {
			type: String,
			// required: true,
		}
	}

})


productSchema.plugin(sanitizeSchema)


// => use constansts
const Product = model<ProductDocument, Model<ProductDocument>>(Collection.Product, productSchema)
export default Product



/*
.get()
.set()
.method()
.methods

.static()
.statics

.virtual
.virtuals
.virtualPath

.pre
.post
.pick
.plugin

.query
.queue
.remove
.requiredPath

.emit
.on
.once
.off
.add
.addListener
.eventNames
.getMaxListeners
.listenerCounts
.listeners
.removeListener
.removeAllListeners

.alias
.childSchemas
.clone
.path
.paths
.pathType
.eachPath
.loadClass

.discriminator
.discriminators

.index
.indexes
.searchIndex
.clearIndexes
.removeIndex


*/