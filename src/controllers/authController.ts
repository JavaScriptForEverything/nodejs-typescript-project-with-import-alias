import type { Request, Response, NextFunction, RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import { appError, catchAsync } from '@/controllers/errorController'
import crypto from 'node:crypto'
import passport from 'passport'
// import * as userDto from '@/dtos/userDtos'
import * as tokenService from '@/services/tokenService'
import User from '@/models/userModel'
import { promisify } from 'node:util'
import * as fileService from '@/services/fileService'
import { Session } from '@/types/session'

type CustomSession = {
  state: string
}

type CustomUser = Express.User & {
	_id: string
}
	


// router.get('/api/users' protect, ...)
export const protect:RequestHandler = catchAsync( async (req, res, next) => {
	const errorMessage = 'you are not authenticated user, plsese login first'

	const authToken = req.session?.authToken
	if(!authToken) return next(appError(errorMessage, 401, 'AuthError'))

	const { id } = await tokenService.verifyUserAuthToken(authToken)
	if(!id) return next(appError('payload.id missing error ', 401, 'AuthError'))

	const user = await User.findById(id)
	if(!user) return next(appError('No user Found, authentication failed', 401, 'AuthError'))

	req.session = { 
		// ...req.session, 
		authToken,
		user: {
			role: user.role,
			id: user.id
		}
	}

	next()
})

// router.get('/api/users' protect, restrictTo('admin', 'leader'), getAllUsers)
export const restrictTo = (...roles: string[]) => (req:Request, _res:Response, next:NextFunction) => {
	const session = req.session as Session
	const user = session.user

	if(!user?.role) return next(appError('user.role not found', 404, 'AuthError'))

	const message = `Sorry you ( role: '${user?.role}' ) don't have permission to perform this action.`
	if(!roles.includes(user.role)) return next(appError(message, 403, 'PermissionDenied'))

	next()
}


// POST 	/api/auth/register
export const register: RequestHandler =  async (req, res, next) => {
	try {
		const userFound = await User.findOne({ email: req.body.email })
		if(userFound) return next(appError('This email already registerted'))

		if(req.body.avatar) {
			const { error, image: avatar } = await fileService.uploadFile(req.body.avatar, '/users')
			if(error) return next(appError(`avatar image upload error: ${error}`))

			// update with new image, if update fialed then delete this image from catch block
			req.body.avatar = avatar
		}

		// const filteredBody = userDto.filterBodyForCreateUser(req.body)
		const user = await User.create(req.body)
		if(!user) return next(appError('user not found'))


		// send email to active account instead of success response
		
		const responseData: ResponseData = {
			status: 'success',
			data: user,
			message: 'you successfully registerted!!!'
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.avatar?.secure_url) promisify(fileService.removeFile)(req.body.avatar.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}


// POST 	/api/auth/login 	: Because POST not send cookie on { sameSite: 'lax' } 
export const login:RequestHandler = catchAsync( async (req, res, next) => {
	if(!req.body.email || !req.body.password) return next(appError('please pass email and password'))
	
	passport.authenticate('local', async (err: unknown, user: CustomUser) => {
		if(err) return next(err)
		if(!user) return next(appError('user not found'))


		await tokenService.sendTokenInCookie(req, user._id)

		const responseData: ResponseData = {
			status: 'success',
			message: 'login successfully!!!',
			// data: user,
		}
		res.status(200).json( responseData )

	})(req, res, next)
})


// GET 	/api/auth/logout 	: Because POST not send cookie on { sameSite: 'lax' } 
export const logout:RequestHandler = catchAsync( async (req, res, next) => {

	await tokenService.removeTokenFromCookie(req)

	// req.session = null 												// destroy req.session  and auto delete cookie my cookieSession middleware
	const responseData: ResponseData = {
		status: 'success',
		data: 'logout success'
	}
	res.status(200).json( responseData )
})







// POST 	/api/auth/forgot-password 	: Because POST not send cookie on { sameSite: 'lax' } 
export const forgotPassword: RequestHandler = (req, res, next) => {
	
	const responseData: ResponseData = {
		status: 'success',
		data: 'forgot password'
	}
	res.status(200).json( responseData )
}

// PATCH 	/api/auth/reset-password 	: Because POST not send cookie on { sameSite: 'lax' } 
export const resetPassword: RequestHandler = (req, res, next) => {
	
	const responseData: ResponseData = {
		status: 'success',
		data: 'reset password'
	}
	res.status(200).json( responseData )
}

// PATCH 	/api/auth/update-password 	: Because POST not send cookie on { sameSite: 'lax' } 
export const updatePassword: RequestHandler = (req, res, next) => {
	
	const responseData: ResponseData = {
		status: 'success',
		data: 'update password'
	}
	res.status(200).json( responseData )
}


// GET 	/api/auth/google
export const googleLoginRequest: RequestHandler = (req, res, next) => {
  const state = crypto.randomUUID(); 							// Semi-clone required because next line type casting
  req.session = { state }
  // (req.session as CustomSession).state = state; 	// Store the state in the session

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state  																					// Include the state in the request to Google
  })(req, res, next)
}


// GET 	/api/auth/google/callback
export const googleCallbackHandler: RequestHandler = (req, res, next) => {
	
	 passport.authenticate('google', async (err: unknown, user: CustomUser ) => {
    if (err) return next(err) 
    if (!user) return res.redirect('/auth/login') 

    // Validate the state parameter to prevent CSRF attacks
    if (req.query.state !== (req.session as CustomSession).state) {
      return next(appError('invalid state parameter', 403, 'GoogleError'))
    }


		try {
			await tokenService.sendTokenInCookie(req, user._id)

			const responseData: ResponseData = {
				status: 'success',
				message: 'login successfully!!!',
				// data: user,
			}
			res.status(200).json( responseData )

		} catch (err: unknown) {
    	if (err instanceof Error) return next(err.message) 
    	next(err) 
		}
  })(req, res, next)
}




// GET 	/api/auth/facebook
export const facebookLoginRequest: RequestHandler = (req, res, next) => {
	
  const state = crypto.randomUUID(); 							// Semi-clone required because next line type casting
  req.session = { state }
  // (req.session as CustomSession).state = state; 	// Store the state in the session

  passport.authenticate('facebook', {
    scope: ['profile', 'email'],
    state  																					// Include the state in the request to Google
  })(req, res, next)
}





// POST 	/api/auth/update-email
export const sendUpdateEmailRequest: RequestHandler = (req, res, next) => {
	
	const responseData: ResponseData = {
		status: 'success',
		data: 'google googleAuthFailure '
	}
	res.status(200).json( responseData )
}



// GET 	/api/auth/update-email/:resetToken
export const updateEmail: RequestHandler = (req, res, next) => {
	
	const responseData: ResponseData = {
		status: 'success',
		data: 'google googleAuthFailure '
	}
	res.status(200).json( responseData )
}