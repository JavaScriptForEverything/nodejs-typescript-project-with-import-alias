import path from 'node:path'
import express from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import routes from '@/routes'
import * as errorController from '@/controllers/errorController'

dotenv.config()


errorController.exceptionErrorHandler() // put it very top

const publicDirectory = path.join(process.cwd(), 'public')

// // MONGO_HOST required into session({ store })
// const { SESSION_SECRET,  MONGO_HOST, NODE_ENV } = process.env || {}
// const DATABASE_URL = `mongodb://${MONGO_HOST}/babur-hat`
// if(!MONGO_HOST) throw new Error(`Error => MONGO_HOST: ${MONGO_HOST}`)
// if(!SESSION_SECRET) throw new Error(`Error: => SESSION_SECRET=${SESSION_SECRET}`)



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
