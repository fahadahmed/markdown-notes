import app from './app.ts'
import logger from './utils/logger.ts'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swaggerConfig.ts'

const PORT = process.env.PORT || 3000

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`)
  logger.info(`📖 API documentation available at http://localhost:${PORT}/api-docs`)
})
