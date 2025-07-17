import swaggerJsDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Markdown Notes API',
      version: '1.0.0',
      description: 'API for managing markdown notes',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/docs/openapi/*.yaml'],
})
