import type { RequestHandler } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { appError } from '@/controllers/errorController'

// GET /upload/*
export const getUserFile: RequestHandler = (req, res, next) => {
	try {
		const file = path.join(process.cwd(), req.originalUrl)

		if( !fs.existsSync(file) ) return next(appError('file not exists'))
		// res.sendFile( file )

		const readStream = fs.createReadStream(file)
		readStream.pipe(res)

	} catch (err: unknown) {
		if(err instanceof Error) return next( appError(`Read uploaded file: ${err.message}`)	)
		if(typeof err === 'string') return next(appError(err))
		next(err)
	}
}