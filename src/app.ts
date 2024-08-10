import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swaggerConfig';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app: Application = express();

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware for security headers
app.use(helmet());

// Middleware for CORS
app.use(cors());

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api', routes);

// Handle 404 errors
app.use(notFoundHandler);

// Custom error handling middleware
app.use(errorHandler);

export default app;
