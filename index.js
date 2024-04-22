import express from 'express'
import { User } from './models/init.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { AuthInit } from './routes/auth.js';
import cors from 'cors'

const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'API Documentation using Swagger',
        },
        basePath: '/',
    },
    apis: ['./routes/*.js'], // Path to the API routes folder
};


AuthInit(app)

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));











const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});
