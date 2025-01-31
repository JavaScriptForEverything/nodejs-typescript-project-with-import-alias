import type { UserDocument, UserModel } from '@/types/user'
import { Roles, Collection, Gender } from '@/types/constants'
import { model, Schema } from 'mongoose'
import bcryptjs from 'bcryptjs'
import crypto from 'node:crypto'
import isEmail from 'validator/lib/isEmail'
import { sanitizeSchema } from '@/services/sanitizeService'


/*
{
	"name" : "Riajul Islam",
	"email" : "riajul@gmail.com",
	"password" : "asdfasdf",
	"confirmPassword?" : "asdfasdf",
	"coverPhoto" : "",
	"avatar" : "",
	"phone" : "",
	"gender" : "",

	status: "pending", 
}
*/




const userSchema = new Schema<UserDocument>({
	clientId: String, 		// for social media login like: Google | Facebook | ...

	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 30,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		unique: true,
		validate: isEmail
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		select: false, 									// no need this any more because we hide in toJSON 
	},
	confirmPassword: {
		type: String,
		// required: true,
		validate: function(this: UserDocument, val: string, ) {
			return this.password === val
		},
	},

	// role: {
	// 	type: String,
	// 	enum: Object.values(Role),
	// 	trim: true,
	// 	lowercase: true,
	// 	default: Role.user,
	// },
	role: {
		type: String,
		enum: Object.values(Roles),
		trim: true,
		lowercase: true,
		default: 'user'
	},

	isActive: {
		type: Boolean,
		default: false
	},
	isVerified: {
		type: Boolean,
		default: false
	},

	// coverPhoto: {
	// 	public_id: String,
	// 	secure_url: String,
	// },
	avatar: {
		public_id: String,
		secure_url: {
			type: String,
			// default: '/upload/default.png'
		},
	},


	gender: {
		type: String,
		lowercase: true, 											
		enum: Object.values(Gender), 						// if use Enum value, then default value must be comes from Gender, hardCoded value throw error.
		default: Gender.other
		// enum: ['male', 'female', 'other'],
		// default: 'undefined'
	},


	// likes: [{ 													
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Product',
	// }],
	// carts: [{ 													
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Product',
	// }],

	// orders: [{ 													
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Payment',
	// }],


	passwordResetToken: String,
	emailResetToken: String,
	emailResetTokenExpires: Date

}, {
	timestamps: true,
	toJSON: {
		transform(_doc, ret, _options) {
			ret.id = ret._id
			// delete ret._id
			delete ret.__v
			delete ret.password  					// hide password, so no need extra code other palaces
			delete ret.confirmPassword  	// hide confirmPassword, so no need extra code other palaces
		},
	}
})

userSchema.plugin(sanitizeSchema)

userSchema.pre('save', async function(next) {
	if( !this.isModified('password') ) return

	this.password = await bcryptjs.hash(this.password, 12)
	this.confirmPassword = undefined
	next()
})

userSchema.methods.comparePassword = async function(this: UserDocument, password: string ) {
	return await bcryptjs.compare(password, this.password)
}

/* 	const user = await User.findOne()
		const token = await user.passwordResetToken() */
userSchema.methods.getPasswordResetToken = async function (this: UserDocument) {
	const resetToken = crypto.randomBytes(32).toString('hex')

	// save the hashed version in database, and return unhashed, so that hash it again then compare it
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	await this.save({ validateBeforeSave: false }) 	// validation requires all the fields

	// return to unhashed version to user, which will be send via email (securely)
	return resetToken
}


userSchema.methods.createEmailResetToken = async function() {
	const resetToken = crypto.randomBytes(32).toString('hex')

	// save the hashed version in database, and return unhashed, so that hash it again then compare it
	this.emailResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.emailResetTokenExpires = Date.now() + 1000 * 60 * 10 	// now + 10 Minure
	await this.save({ validateBeforeSave: false })

	// return to unhashed version to user, which will be send via email (securely)
	return resetToken
}

userSchema.methods.handleEmailUpdate = async function(this: UserDocument, resetToken: string, email: string) {
	/* if expire date is not bigger than current time, that means time expires
			We can it in 2 ways:
				1. when we query 	: 	await User.findOne({ passwordResetToken: resetToken, passwordResetTokenExpires: {$gt: Date.now()} })
				2. const isExpires = new Date(this.passwordResetTokenExpires) < new Date()
	*/

	if( !this.emailResetToken ) return false 						// don't have resetToken so no need to perform next
	if( !this.emailResetTokenExpires ) return false 		// don't have resetToken so no need to perform next
	if(!isEmail(email)) return false

	if( new Date(this.emailResetTokenExpires) < new Date() ) return false

	const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	if( hashedResetToken !== this.emailResetToken ) return false

	this.email = email

	this.emailResetToken = undefined
	this.emailResetTokenExpires = undefined

	/* Must need to update passwordChangedAt property, so that password changed after login or not, can be chedked
			We can it also in 2 ways/place:
				1. here like this 	:	this.passwordChangedAt = new Date()
				2. in middleware 		:

				.pre('save', function() {
					if( !this.isModified('password') ) return
					this.passwordChangedAt: new Date();
					next()
				})
						. middleware is the parject place for this job, because it run everytime automatically without any warry.
							but because it is only need to update once, so method (1) is ok too */

	await this.save({ validateBeforeSave: false })

	return this
}


export const User = model<UserDocument, UserModel>(Collection.User, userSchema)
export default User