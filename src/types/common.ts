import type { NextFunction, Request, Response } from 'express'
import { Roles } from '@/types/constants'

export type CatchAsync = {
	(req:Request, res:Response, next:NextFunction): Promise<any>
}

export type ErrorStatus = 'error' | 'failed' | 'AuthError' | 'PermissionDenied'
export type MyError<Status extends string = ErrorStatus> = Error & {
  message: string
  statusCode: number
  status: Status
}

export type ResponseStatus = 'success' | 'fialed' | 'error'
export type ResponseData<Data = any> = {
	status: ResponseStatus
	count?: number
	total?: number
	data?: Data,
	message?: string
}

export type Image = {
	public_id: string
	secure_url: string
}


// export type Role = 'vendor' | 'user' | 'admin' 
export type Role = (typeof Roles)[keyof typeof Roles] 						// => type Role = "vendor" | "user" | "admin"
// const roles = Object.values(Roles) 														// => [ 'vendor', 'user', 'admin' ]