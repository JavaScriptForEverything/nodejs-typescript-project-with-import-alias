/* eslint-disable @typescript-eslint/no-explicit-any */
/* Handle Common utility functions here */

import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'

// const path = require('path')
// const fs = require('fs');
// const { appError } = require('../controllers/errorController');


export const getDataUrlSize = (dataUrl: string) => {
	if( !dataUrl?.startsWith('data') ) throw new Error(`'${dataUrl}' is not valid dataUrl`) 
	
	const base64 = dataUrl.split(';base64,').pop()
	if(!base64) throw new Error(`base64: ${base64} is empty`)

	const buffer = Buffer.from(base64, 'base64')
	return buffer.byteLength
}



/*
	{{origin}}/api/reviews
		?_page=2
		&_limit=3
		&_sort=-createdAt,user
		&_search= riajul,email,name 					// find text 'riajul' in email, or name or ... any of  field
		&_fields=review,user,createdAt

	const reviews = await apiFeatures(Review, req.query)
*/
export const apiFeatures = (Model:any, query:any, newFilter={}) => {
	/* make sure use app.use( hpp() ), to prevent multiple params: 
				?_page=1&_page=3 				=> { _page: [1,3] } 			: without hpp() middleware
				?_page=1&_page=3 				=> { _page: 3 } 					: applied hpp() middleware
	*/ 

	const page = +query._page || 1
	const limit = +query._limit || 20
	const skip = page <= 0 ? 0 : (page - 1) * limit 

	const sort = query._sort?.toString().trim().split(',').join(' ') || 'createdAt'
	const select = query._fields?.toString().trim().split(',').join(' ') || '-_v'

	const search = query._search?.toString().trim().split(',') || ['', '']
	const [ searchValue, ...searchFields ] = search
	let searchObj:any = {
		"$or" : searchFields.map( (field: any) => ({ [field]: { "$regex": searchValue, "$options": "i" } }))
	}
	searchObj = search[1] ? searchObj : {}

	// const _filter = query._filter || newFilter 				// it bypass newFilter, so 
	const _filter = { ...query._filter, ...newFilter } 		// we need merge both filter
	const filter = { ...searchObj, ..._filter }

	return Model.find(filter) 					// => Searching
		.skip(skip).limit(limit) 					// => Pagination
		.sort( sort ) 										// => Sorting
		.select(select) 									// => Filtering

	/*
		const searchObj = { firstName: { $regex: 'name', $options: 'i'} } 		// single field
		const searchObj = { 																									// multi field
			$or: [
				{ firstName: { $regex: req.query.search, $options: 'i'} },
				{ lastName : { $regex: req.query.search, $options: 'i'} },
				{ username : { $regex: req.query.search, $options: 'i'} },
			]
		} 		
	*/
}


type TempObj = {
	[key: string]: unknown
}
export const filterObjectByArray = (body={}, allowedFields=['']) => {
	const tempObj:TempObj = {}

	Object.entries(body).forEach(([key, value]) => {
		if(allowedFields.includes(key)) tempObj[key] = value
	})

	return tempObj
}



/*
const currentDocuments = await Product.countDocuments()
const vendorId = generateRandomVendorId('babur hat', 'electronics', currentDocuments)
console.log({ vendorId })
*/
export const generateRandomVendorId = (projectName: string, categoryName: string, countDocuments: number) => {
	
	const productCode = projectName.split(' ').map( (item: string) => item[0]).join('').toUpperCase()
	const categoryCode = categoryName[0].toUpperCase()
	const sequentialDecimalValue = String(countDocuments + 1).padStart(8, '0')

	const vendorId = `${productCode}${categoryCode}${sequentialDecimalValue}`
	return vendorId
}

type CustomIdProps = {
	projectName?: string, 
	categoryName: string, 
	// countDocuments?: number
}
export const generateSequentialCustomId = (props: CustomIdProps) => {
	const {
		projectName='babur hat',
		categoryName,
	} = props
	
	const productCode = projectName.split(' ').map( (item: string) => item[0]).join('').toUpperCase()
	const categoryCode = categoryName[0].toUpperCase()
	const sequentialDecimalValue = crypto.randomUUID()

	return `${productCode}${categoryCode}-${sequentialDecimalValue}`
}
