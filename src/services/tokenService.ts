import type { Request } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


const { JWT_AUTH_TOKEN_SECRET, JWT_EXPIRES_IN } = process.env


if(!JWT_AUTH_TOKEN_SECRET || !JWT_EXPIRES_IN) throw new Error(`${JWT_AUTH_TOKEN_SECRET}`)

export const generateTokenForUser = async (id: string): Promise<string> => {
	// return jwt.sign({ id }, JWT_AUTH_TOKEN_SECRET, { expiresIn: JWT_EXPIRES_IN })
	return ''
}


export const verifyUserAuthToken = async (authToken: string): Promise<JwtPayload> => {
	return jwt.verify(authToken, JWT_AUTH_TOKEN_SECRET) as JwtPayload
}

export const sendTokenInCookie = async (req: Request, userId: string): Promise<void> => {
	const authToken = await generateTokenForUser(userId) 
	// req.session = { authToken, userId }
}

export const removeTokenFromCookie = async (req: Request): Promise<void> => {
	const authToken = req.session?.authToken
	if(!authToken) return
	const { id } = await verifyUserAuthToken(authToken)
	if(id) req.session = null
}