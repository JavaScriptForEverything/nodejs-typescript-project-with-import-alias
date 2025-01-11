## NodeJs-TypeScript-with-import-alias

![absolutePath_vs_relativePath.png](https://github.com/JavaScriptForEverything/nodejs-typescript-project-with-import-alias/blob/main/public/absolutePath_vs_relativePath.png)



**Why do we need `import alias`?**

`import alias` allows to use `absolute path` instead of `relative path` which make life easier to move files to any location without worring about to re-correct import path.
bellow has some benifit of using `absolute path`

###### Benifit of `absolute path`

- No need to worry about import module path location when trying to move files one location to another. 
- Absolute Path provide cleaner and easy to understand
- Relative Paths (../../../components/Header) that can be confusing and error-prone
- ...



## Project Setup

- Step-1: setup project and install basic libraries

```
$ yarn init -y
$ yarn add express 
$ yarn add -D typescript ts-node nodemon @types/node @/types/express
$ yarn tsc --init

```


- Step-2: install `tsconfig-paths module-alias` required for node.js to compile with alias

```
$ yarn add -D tsconfig-paths module-alias
```


- Step-3: Enable path alias in both `TypeScript` and `JavaScript`

Typescript has built-in features to compile with type alias, but Javascript dosen't, so we have to make javascript to use `type alias` as well, so we have to configure manually for that. (i) allow alias in `__moduleAliases` in `package.json` (ii) build first then try to run with `tsconfig-paths` module.

###### /tsconfig.json
```
{
  "compilerOptions": {
    "target": "es2016",  
    // "lib": [],       
    "module": "commonjs",
    "rootDir": "./", 
    "outDir": "./dist",  
    "baseUrl": "./",  
    "paths": {
			"@/*": ["./*"]
		}, 
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true, 
    "allowSyntheticDefaultImports": true, 
    "noImplicitAny": true,
    "strictNullChecks": true, 
  },
}
```


###### /package.json
```
{
  "name": "nodejs-typescript-project-with-import-alias",
  "version": "1.0.0",
  "license": "MIT",
  "main": "dist/server.js",
  "_moduleAliases": {
    "@": "."
  },
  "scripts": {
    "build": "tsc",
    "dev": "nodemon server.ts",
    "start": "node .",
    "seeder:base": "ts-node ./seeder/seeder.ts",
    "seeder:read": "yarn seeder:base --read",
    "seeder:import": "yarn seeder:base --import",
    "seeder:delete": "yarn seeder:base --delete",
    "seeder": "yarn seeder:read",
    "test": "jest --no-cache",
    "test:watch": "yarn jest --watch-all"
  },
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "module-alias": "^2.2.3",
    "mongodb-memory-server": "^10.1.3",
    "mongoose": "^8.9.4",
    "morgan": "^1.10.0",
    "sanitize-html": "^2.14.0",
    "tsconfig-paths": "^4.2.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/morgan": "^1.9.9",
    "@types/node": "^22.10.5",
    "@types/sanitize-html": "^2.13.0",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "nodemon": "^3.1.9",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.3"
  },
  "author": "Riajul Islam",
  "homepage": "https://github.com/JavaScriptForEverything/nodejs-typescript-project-with-import-alias",
  "bugs": {
    "url": "https://github.com/JavaScriptForEverything/nodejs-typescript-project-with-import-alias/issue"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/JavaScriptForEverything/nodejs-typescript-project-with-import-alias.git"
  },
  "description": "to use import alias in nodejs project so that we can always use absolute path instead of relative path",
  "keywords": [
    "typescript project",
    "import alias",
    "absolute path vs relative path",
    "why do we need to use absolute path instead of relative path"
  ]
}

```


- Step-4: Now we have `import alias` setup so we can use them as `absolute` path instead of `relative path`

###### /src/controllers/productConroller.ts
```
import type { RequestHandler } from 'express'

export const getProducts: RequestHandler = (req, res) => {

	res.status(200).json({
		status: 'success',
		data: [
			{
				id: 1,
				name: 'product 1',
				price: 300
			}
		]
	})
}

export const addProduct: RequestHandler = (req, res) => {

	res.status(201).json({
		status: 'success',
		data: req.body
	})
}
---

import type { RequestHandler } from 'express'
import { promisify } from 'util'
import Product from '@/models/productModel'
import { appError, catchAsync } from '@/controllers/errorController'
import * as fileService from '@/services/fileService'
import { apiFeatures } from '@/lib/utils'


export const getProducts: RequestHandler = catchAsync(async (req, res, next) => {
	// const products = await Product.find({})
	
	let filter = {}
	const products = await apiFeatures(Product, req.query, filter)
	const total = await Product.countDocuments()

	res.json({
		status: 'success',
		total,
		count: products.length,
		data: products,
	})

})

export const addProduct: RequestHandler = catchAsync(async (req, res, next) => {
	try {
		if(req.body.coverPhoto) {
			// const { error, image: coverPhoto } = await fileService.handleBase64File(req.body.coverPhoto, '/products')
			const { error, image: coverPhoto } = await fileService.uploadFile(req.body.coverPhoto, '/products')
			if(error) return next(appError(`coverPhoto image upload error: ${error}`))
			req.body.coverPhoto = coverPhoto
		}
		const product = await Product.create(req.body)

		res.status(201).json({
			status: 'success',
			data: product
		})

	} catch (err) {
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.coverPhoto?.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
})

```

###### /src/routes/productRoutes.ts
```
import * as productController from '@/controllers/productController'
import { Router } from 'express'

export const router = Router()

// => /api/products
router.route('/')
	.get(productController.getProducts)
	.post(productController.addProduct)


```


###### /src/routes/index.ts
```
import { Router } from 'express'
import { router as productRouter } from '@/routes/productRoute' 
import { router as fileRouter } from '@/routes/fileRoute' 

// => / 	(root)
const router = Router()

router.use('/upload', fileRouter)
router.use('/api/products', productRouter)

export default router
```


###### /src/app.ts
```
import path from 'node:path'
import express from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import routes from '@/routes'
import * as errorController from '@/controllers/errorController'

dotenv.config()


errorController.exceptionErrorHandler() // put it very top

const publicDirectory = path.join(process.cwd(), 'public')

export const app = express()

app.set('trust proxy', 1) 																	// Trust the proxy, which coming via Nginx
app.set('query parser', 'simple') 													// To prevent default query query [] parser

app.use(express.static( publicDirectory ))
app.use(express.json({ limit: '400mb' }));
app.use(express.urlencoded({ limit: '400mb', extended: true }));



// middlewares
app.use(morgan('dev')) 


// Handle all Routes here
app.use(routes)

// handle errors
app.all('*', errorController.routeNotFound)
app.use(errorController.globalErrorHandler)
```

###### /src/server.ts
```
import 'module-alias/register'
import 'tsconfig-paths/register'
import { app } from '@/app'

import { dbConnect } from '@/models/dbConnect'
import * as errorController from '@/controllers/errorController'

const PORT = process.env.PORT || 5000
const httpServer = app.listen(PORT, async () => {
	await dbConnect() 		// also add dotenv.config()
	console.log(`server running on : http://localhost:${PORT}`)
})

errorController.promiseErrorHandler(httpServer) 	// put it very end
```



## Configure Jest

$ yarn add -D jest ts-jest supertest @types/jest @types/supertest
$ yarn jest --init

/src/jest.setup.ts
/src/__tests__/product.test.ts



###### /jest.config.ts
```
import type { Config } from 'jest'

const config: Config = {
	moduleNameMapper: { 				# required for `import alias: import routes from '@/routes'`
		'^@/(.*)$': '<rootDir>/src/$1'
	},

  preset: 'ts-jest',
  testEnvironment: "jest-environment-node",
	verbose: true,
	testMatch: ["**/__tests__/**/*.test.ts"],
	setupFilesAfterEnv: ['./src/jest.setup.ts'],
}
export default config
```

###### /jest.setup.ts
```
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, connection } from 'mongoose'

const mongo = new MongoMemoryServer()

// Step-1: Create database connection
beforeAll( async () => {
	await mongo.start()
	const mongoUri = mongo.getUri()

	await connect(mongoUri)
})


// Step-2: Delete old data
beforeEach( async () => {
	const collections = await connection.db?.collections()
	if(!collections) return

	for( let collection of collections ) {
		collection.deleteMany() 							// delete data from every collection
	}
})


afterAll( async () => {
	await connection.close() 								// close mongose connection
	await mongo.stop()  										// stop mongodb server
})
```


###### /src/__tests__/products/product.test.ts
```
import request from 'supertest'
import { app } from '@/app'

it('GET /api/products', async () => {
	const res = await request(app)
	.get('/api/products')

	console.log(res.body.status)
	console.log(res.body.data)
})
```





###### /__tests__/products.test.ts
```
import request from 'supertest'
import { app } from '../src/app'


it('GET /api/products', async () => {
	const res = await request(app)
	.get('/api/products')

	const statusCode = res.status 			// <= res.status( statusCode ).json(...)

	const status = res.body.status 			// <= res.json({ status: 'success' })
	const data = res.body.data 			// <= res.json({ data: [{ ... }] })

	console.log({
		statusCode,
		status,
		data
	})
})




it('POST /api/products', async () => {
	const body = {
		name: 'product 2',
		price: 400
	}

	const res = await request(app)
	.post('/api/products')
	.send(body)

	const statusCode = res.status 			// <= res.status( statusCode ).json(...)

	const status = res.body.status 			// <= res.json({ status: 'success' })
	const data = res.body.data 			// <= res.json({ data: req.body })

	console.log({
		statusCode,
		status,
		data
	})

	expect(res.body.data).toEqual(body) 		// const addProduct = ()=> { res.json({ data: req.body }) }
})
```