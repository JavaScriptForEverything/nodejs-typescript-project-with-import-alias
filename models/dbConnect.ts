import dotenv from 'dotenv'
import { connect, connection } from 'mongoose'

dotenv.config()




export const dbConnect = async () => {
	try {
		// const MONGO_HOST = process.env.MONGO_HOST
		const DATABASE_URL = process.env.MONGO_URI

		if(!DATABASE_URL ) throw new Error(`Database Connection Error: => DATABASE_URL: ${DATABASE_URL}`)

		if(connection.readyState >= 1) return
		const conn = await connect(DATABASE_URL)	
		const { host, port, name } = conn.connection
		console.log(`---- Database connected to : [${host}:${port}/${name}]----` )

	} catch (err: unknown) {
		if( err instanceof Error) return console.log(`database connection failed: ${err.message}`)
		console.log(err)
	}
}

