import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import {pool,db} from './db/db_connect'
import authRoute from './routes/auth.route'
import userRoute from './routes/user.route'
import globalErrorHandler from './middlewares/globalErrorHandler.middleware';
import notFoundHandler from './middlewares/notFoundApi.middleware';


const app = express();
const port = process.env.PORT || 4000;

const corsOptions = {
    origin: ['http://localhost:5174', 'http://localhost:5173'], 
    credentials: true, // Allow credentials for cookies and ....
};

// Middleware
app.use(cors(corsOptions))
app.use(express.json());

// routes middleware
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);

// 404 Not Found Handler
app.use("*", notFoundHandler);

// Global Error handler middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    globalErrorHandler(err, req, res, next);
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    pool.connect().then(()=>{
        console.log("DB connected successfully...")
    }).catch(err=>{
        console.log("DB connection error",err)
    })
  
});

