import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import {pool,db} from './db/db_connect'
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors())

// Simple route
app.get('/', (req, res) => {
    res.send('Hello, World!');
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
