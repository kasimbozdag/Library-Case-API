import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { ApiError } from './utils/ApiError';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swaggerConfig';

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

// Custom error handling middleware
app.use(
  (err: Error | ApiError, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  },
);

export default app;
