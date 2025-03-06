import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import {pool,db} from './db/db_connect'
import authRoute from './routes/auth.route'
import userRoute from './routes/user.route'


const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors())

// routes middleware
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    pool.connect().then(()=>{
        console.log("DB connected successfully...")
    }).catch(err=>{
        console.log("DB connection error",err)
    })
  
});

