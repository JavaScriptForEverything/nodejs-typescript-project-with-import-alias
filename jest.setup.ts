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