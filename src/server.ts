import 'module-alias/register'
import 'tsconfig-paths/register'
import app from '@/app'

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`server running on http://localhost:${PORT}`)
})