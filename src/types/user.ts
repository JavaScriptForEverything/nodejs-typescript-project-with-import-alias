import type { Document, Model, Types } from 'mongoose'
import type { Gender } from '@/types/constants'
import type { Image, Role } from '@/types/common'




export type CreateUser = {
	clientId: String, 		// for social media login like: Google | Facebook | ...

	name: string
	email: string
	username: string
	password: string
	confirmPassword?: string

	// coverPhoto: Image
	avatar: Image

	role: string
	// status: string

	gender: Gender
}

export type UserDocument = Document & CreateUser & {
	_id: Types.ObjectId
	isActive: boolean
	isVerified: boolean

	role: Role

	passwordResetToken?: string
	emailResetToken: string | undefined
	emailResetTokenExpires: Date | undefined

	// likes: Types.ObjectId[] 				// wishlist
	// carts: Types.ObjectId[] 				// cart items
	// orders: Types.ObjectId[]

	// otherPermissions : OtherPermissions
}

export type UserModel = Model<UserDocument> & {
	comparePassword: (password: string) => Promise<boolean>
	getPasswordResetToken: () => Promise<string>

	createEmailResetToken: () => Promise<string>
	handleEmailUpdate: (resetToken: string, email: string) => Promise<boolean>
}



export type UpdateUser = {
	name: string
	username: string
	// coverPhoto: Image
	avatar: Image
	gender: Gender
	// role: string
	isActive: boolean
	isVerified: boolean
}