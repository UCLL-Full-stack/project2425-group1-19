import * as dotenv from 'dotenv';
import express, {Response, Request,NextFunction} from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import itemRouter from './controller/item.routes';
import shoppingListRouter from './controller/shoppingList.routes';
import userRouter from './controller/user.routes';
import profileRouter from './controller/profile.routes';
import {expressjwt} from 'express-jwt';



const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

//Security
app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({status: 'unauthorized', message: err.message})
    } else {
        res.status(400).json({status: 'application error', message: err.message})
    }
})

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || "default_secret",
        algorithms: ['HS256'],
    }).unless({
        path: ['api-docs',/^\/api-docs\/.*/ ,'/user/login' , '/user/signup' , '/', '/status']
    })
);

app.use(cors());
app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.json({message: 'Back-end is running...'});
});
app.get('/', (req, res) => {
    res.json({message:`Back-end is running... Use the path http://localhost:${port}/api-docs/ To find the available endpoints.`});
});

app.listen(port || 8000, () => {
    console.log(`Back-end is running on port ${port}.`);
});

const swaggerOpts = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Grocery manager x",
            version: "1.0.0",
        },
    },
    apis: ["*controller/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Middleware configs (van jr/sr project)

app.use(cors({
    origin: [
        'http://localhost:8000', // Allow local development
        ]
  }));

//Endpoints

app.use('/item', itemRouter);
app.use('/shoppingList', shoppingListRouter);
app.use('/user', userRouter);
app.use('/profile', profileRouter);
