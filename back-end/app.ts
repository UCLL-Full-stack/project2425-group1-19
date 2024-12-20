import * as dotenv from 'dotenv';
import express, {Response, Request, NextFunction} from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {expressjwt} from 'express-jwt';
import itemRouter from './controller/item.routes';
import shoppingListRouter from './controller/shoppingList.routes';
import userRouter from './controller/user.routes';
import profileRouter from './controller/profile.routes';
import helmet from 'helmet';

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3000;

// Middleware for parsing and security
app.use(helmet());
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self'"],
//         connectSrc: [`'self', 'http://localhost:${port}'`],
//     },
// })
// );

app.use(cors());
app.use(bodyParser.json());

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || "default_secret",
        algorithms: ['HS256'],
    }).unless({
        path: [
            '/status',
            '/',
            '/user/login',
            '/user/signup',
            '/api-docs',
            /^\/api-docs\/.*/, // Allow Swagger subpaths
        ],
    })
);

// Status and root routes
app.get('/status', (req, res) => {
    res.json({message: 'Back-end is running...'});
});
app.get('/', (req, res) => {
    res.json({
        message: `Back-end is running... Use http://localhost:${port}/api-docs/ to find available endpoints.`,
    });
});

// Swagger configuration
const swaggerOpts = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Grocery manager x",
            version: "1.0.0",
        },
    },
    apis: ["./controller/*.ts"],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint routing
app.use('/item', itemRouter);
app.use('/shoppingList', shoppingListRouter);
app.use('/user', userRouter);
app.use('/profile', profileRouter);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({status: 'unauthorized', message: err.message});
    } else {
        res.status(400).json({status: 'application error', message: err.message});
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});
