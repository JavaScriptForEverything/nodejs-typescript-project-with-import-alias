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