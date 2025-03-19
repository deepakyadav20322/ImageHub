import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import {pool,db} from './db/db_connect'
import authRoute from './routes/auth.route'
import userRoute from './routes/user.route'
import resourceRoute from './routes/resource.route'
import globalErrorHandler from './middlewares/globalErrorHandler.middleware';
import notFoundHandler from './middlewares/notFoundApi.middleware';
import { InvokeCommand, Lambda } from '@aws-sdk/client-lambda';
import multer from 'multer'
import { Request,Response } from 'express';


const app = express();
const port = process.env.PORT || 4000;

const corsOptions = {
    origin: ['http://localhost:5174', 'http://localhost:5173'], 
    credentials: true, // Allow credentials for cookies and ....
};

// Middleware
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes middleware
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/resource', resourceRoute);


// ================== checking the lambada ===========================

const lambda = new Lambda({
    region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
// Middleware to handle multipart form-data (for file uploads)


const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('file');


app.post('/upload', upload, async (req, res):Promise<any> => {
    console.log("Incoming Request Data:", req.body);  // ✅ Log incoming request body
    // console.log("Uploaded File Data:", req.file);      // ✅ Log file details

    try {
        const { originalBucket, transformedBucket, imagePath } = req.body;
        console.log('imagePath',imagePath)
        if (!req.file) {
            console.log("❌ No file uploaded");
          
            return res.status(400).json({ error: 'Image file is required' });
        }

    
        const params = {
            FunctionName: 'imageHub-processing-1',
            Payload: JSON.stringify({
                body: JSON.stringify({
                    image: req.file.buffer.toString('base64'),
                    imagePath,
                    originalBucket,
                    transformedBucket,
                    contentType: req.file.mimetype,
                })
            }),
        };

        console.log("Sending Payload to Lambda:", params);  // ✅ Log payload details

        const result = await lambda.send(new InvokeCommand(params));

        const payloadString = result.Payload
            ? new TextDecoder().decode(result.Payload)
            : '{}';

        console.log("Lambda Response Payload:", payloadString);  // ✅ Log Lambda response

        const payload = JSON.parse(payloadString);

        if (payload.statusCode === 200) {
            return res.status(200).json(payload);
        } else {
            const statusCode = payload.statusCode || 500;
            return res.status(statusCode).json({ error: payload.error || 'Unknown error occurred' });
        }
    } catch (error) {
        console.error('❌ Error invoking Lambda:', error);
        return res.status(500).json({ error: 'Failed to process image' });
    }
});




// ================== checking the lambada ===========================


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

