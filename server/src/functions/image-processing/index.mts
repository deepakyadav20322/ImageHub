// import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import Sharp from 'sharp';

// const s3Client = new S3Client();
// const S3_ORIGINAL_IMAGE_BUCKET = process.env.originalImageBucketName;
// const S3_TRANSFORMED_IMAGE_BUCKET = process.env.transformedImageBucketName;
// const TRANSFORMED_IMAGE_CACHE_TTL = process.env.transformedImageCacheTTL;
// // const MAX_IMAGE_SIZE = parseInt(process.env.maxImageSize);
// const MAX_IMAGE_SIZE =20000000;//byte    // 20mb image size

// export const handler = async (event) => {
//     try {
//         // Validate if this is a GET request
//         if (!event.requestContext || !event.requestContext.http || !(event.requestContext.http.method === 'GET')) {
//             return sendError(400, 'Only GET method is supported', event);
//         }

//         // Extract the image path and operations from the URL
//         const imagePathArray = event.requestContext.http.path.split('/');
//         const operationsPrefix = imagePathArray.pop();
//         imagePathArray.shift();
//         const originalImagePath = imagePathArray.join('/');

//         // Download the original image from S3
//         let originalImageBody;
//         let contentType;
//         try {
//             const getOriginalImageCommand = new GetObjectCommand({
//                 Bucket: S3_ORIGINAL_IMAGE_BUCKET,
//                 Key: originalImagePath,
//             });
//             const getOriginalImageCommandOutput = await s3Client.send(getOriginalImageCommand);
//             if (!getOriginalImageCommandOutput.Body) {
//                 throw new Error('S3 response body is undefined');
//             }
//             originalImageBody = await getOriginalImageCommandOutput.Body.transformToByteArray();
//             contentType = getOriginalImageCommandOutput.ContentType;
//         } catch (error) {
//             return sendError(500, 'Error downloading original image', error);
//         }

//         // Process the image using Sharp
//         let transformedImage = Sharp(originalImageBody, { failOn: 'none', animated: true });
//         const imageMetadata = await transformedImage.metadata();
//         // operation type--------------------
//         interface ImageOperations {
//             width?: string;
//             height?: string;
//             format?: string;
//             quality?: string;
//         }
        
//         type OperationEntry = [string, string];
//         const operationsJSON: ImageOperations = Object.fromEntries(
//             operationsPrefix.split(',')
//             .map((operation: string): OperationEntry => operation.split('=') as OperationEntry)
//         );

//         try {
//             // Apply transformations
//             if (operationsJSON['width'] || operationsJSON['height']) {
//                 transformedImage = transformedImage.resize({
//                     width: operationsJSON['width'] ? parseInt(operationsJSON['width']) : undefined,
//                     height: operationsJSON['height'] ? parseInt(operationsJSON['height']) : undefined,
//                 });
//             }
//             if (imageMetadata.orientation) {
//                 transformedImage = transformedImage.rotate();
//             }
//             if (operationsJSON['format']) {
//                 const format = operationsJSON['format'];
//                 const quality = operationsJSON['quality'] ? parseInt(operationsJSON['quality']) : undefined;
//                 transformedImage = transformedImage.toFormat(format, { quality });
//                 contentType = `image/${format}`;
//             }
//             transformedImage = await transformedImage.toBuffer();
//         } catch (error) {
//             return sendError(500, 'Error transforming image', error);
//         }

//         // Handle large images
//         const imageTooBig = Buffer.byteLength(transformedImage) > MAX_IMAGE_SIZE;

//         // Upload the transformed image to S3
//         if (S3_TRANSFORMED_IMAGE_BUCKET) {
//             try {
//                 const transformedKey = `transformed/${Date.now()}-${originalImagePath}`;
//                 await s3Client.send(
//                     new PutObjectCommand({
//                         Bucket: S3_TRANSFORMED_IMAGE_BUCKET,
//                         Key: transformedKey,
//                         Body: transformedImage,
//                         ContentType: contentType,
//                         CacheControl: TRANSFORMED_IMAGE_CACHE_TTL,
//                     })
//                 );

//                 // If the image is too big, return a redirect to the S3 object
//                 if (imageTooBig) {
//                     return {
//                         statusCode: 302,
//                         headers: {
//                             'Location': `https://${S3_TRANSFORMED_IMAGE_BUCKET}.s3.amazonaws.com/${transformedKey}`,
//                             'Cache-Control': 'private,no-store',
//                         },
//                     };
//                 }
//             } catch (error) {
//                 console.error('Could not upload transformed image to S3:', error);
//                 return sendError(500, 'Failed to upload transformed image', error);
//             }
//         }

//         // Return the transformed image
//         return {
//             statusCode: 200,
//             body: transformedImage.toString('base64'),
//             isBase64Encoded: true,
//             headers: {
//                 'Content-Type': contentType,
//                 'Cache-Control': TRANSFORMED_IMAGE_CACHE_TTL,
//             },
//         };
//     } catch (error) {
//         console.error('Internal server error:', error);
//         return sendError(500, 'Internal server error', error);
//     }
// };

// function sendError(statusCode, body, error) {
//     console.error('APPLICATION ERROR:', body);
//     console.error(error);
//     return {
//         statusCode,
//         body: JSON.stringify({ error: body }),
//     };
// }