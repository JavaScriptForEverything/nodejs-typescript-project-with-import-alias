import path from 'node:path'
import fsPromises from 'node:fs/promises'
import fs from 'node:fs'
import { appError } from '@/controllers/errorController'
import { getDataUrlSize } from '@/lib/utils'
// const { Buffer } = require('node:buffer')
// const { appError } = require('../controllers/errorController');
// const Jimp = require('jimp')



/*---------------[ upload file ]----------------
*/

type Image = {
	public_id: string
	secure_url: string
}
type UploadReturn = {
	error: string
	image: Image | null
}

export const handleBase64File = async (dataUrl: string, subDir='/users', _fileType='image', _aspectRatio='video'): Promise<UploadReturn> => {
	try {
		const tempObj: UploadReturn = { error: 'dataUrl is empty or not string', image: null }

		if(!dataUrl || typeof dataUrl !== 'string' ) return tempObj
		const baseDir = '/upload'

		if( !dataUrl?.startsWith('data') ) return { error: `'${dataUrl}' is not valid dataUrl`, image: null  }


		// Step-1: seperate metadata from base64 string dataUrl 
		const [ metadata, base64 ] = dataUrl.split(';base64,')

		const mimetype = metadata.split(':').pop()!
		const [ _type, ext] = mimetype.split('/')

		if( !ext || !base64) return { error: `please upload image as base64 bit data url`, image: null  }

		// // Step-2: allow file: image(default), pdf, ...
		// if(type !== fileType) return { error: `file type: ${fileType} not valid file type` }

		const destination = path.join(process.cwd(), baseDir, subDir)
		await fsPromises.mkdir(destination, { recursive: true })

		// Step-3: Generate unique filename for file
		const filename = crypto.randomUUID() + '.' + ext
		// const filename = crypto.randomUUID() + '.png' 					// Jimp only support: jpej|png|gim|bmp|tiff
		const filePath = path.join(destination, filename)
		const buffer = Buffer.from(base64, 'base64')

		await fsPromises.writeFile(filePath, buffer) 				// Without resize


		return {
			error: '',
			image: {
				public_id: crypto.randomUUID(),
				secure_url: path.join(baseDir, subDir, filename),
			}
		}

	} catch (err) {
		if(err instanceof Error) throw appError(err.message)
		if(typeof err === 'string' ) throw appError(err)
		// if(err instanceof Error) return { error: err.message, image: null }
		// if(typeof err === 'string' ) return { error: err, image: null }
	}


	return { error: 'Unknown', image: null }
}







export const removeFile = (relativePath: string) => {
	if(typeof relativePath !== 'string') return appError(`file path must be string, but got '${relativePath}'`)

	const filePath = path.join( process.cwd(), relativePath )

	if( fs.existsSync(filePath) ) {
		fs.unlink(filePath, (err) => {
			if(err) return appError(err.message)
		})
	}
}



export const uploadFile = async (url: string, uploadTo: string): Promise<UploadReturn> => {
	if(!url?.trim()) return { error: `url is empty: ${url}`, image: null }

	if(url.startsWith('http')) {
		return {
			error: '',
			image: {
				public_id: crypto.randomUUID(),
				secure_url: url
			}
		} 

	} else if(url.startsWith('data:')) {
		const imageSize = getDataUrlSize(url)
		const maxImageSize = 1024 * 1024 * 400 			// => 400 MB
		if(imageSize > maxImageSize) return { error: 'return ', image: null }

		const { error, image } = await handleBase64File(url, uploadTo)
		if(error || !image) return { error: error || 'image upload failed', image: null }
		
		return { error: '', image } 
	} 

	return { error: 'Unknown', image: null }
}