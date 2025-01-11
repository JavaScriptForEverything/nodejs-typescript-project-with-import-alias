import 'module-alias/register'
import 'tsconfig-paths/register'

import { config } from 'dotenv'
import { connection } from 'mongoose'
import { dbConnect } from '@/models/dbConnect'

import { seederDelete, seederImport, seederRead } from '@/seeder'

	// config()
	// dbConnect()

const seederMain = async () => {
	config()
	await dbConnect()

	const arg = process.argv[2]

	switch (arg) {
		case '--import'	: seederImport(); break;
		case '--delete'	: seederDelete(); break;
		case '--read' 	: seederRead(); 	break;
	}

	// process.exit(0) // close process
}
seederMain()