import { Request, Response, NextFunction } from "express";
import { InvokeCommand, Lambda } from "@aws-sdk/client-lambda";
import multer from "multer";
import { resources } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../db/db_connect";
export const getAllResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

// ================== checking the lambada ===========================

const lambda = new Lambda({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
// Middleware to handle multipart form-data (for file uploads)

// export const uploadResources = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   console.log("Incoming Request Data:", req.body); // ✅ Log incoming request body
//   // console.log("Uploaded File Data:", req.file);      // ✅ Log file details

//   try {
//     const { originalBucket, transformedBucket, imagePath } = req.body;
//     console.log("imagePath", imagePath);
//     if (!req.file) {
//       console.log("❌ No file uploaded");

//       return res.status(400).json({ error: "Image file is required" });
//     }

//     const params = {
//       FunctionName: "imageHub-processing-1",
//       Payload: JSON.stringify({
//         body: JSON.stringify({
//           image: req.file.buffer.toString("base64"),
//           imagePath,
//           originalBucket,
//           transformedBucket,
//           contentType: req.file.mimetype,
//         }),
//       }),
//     };

//     console.log("Sending Payload to Lambda:", params); // ✅ Log payload details

//     const result = await lambda.send(new InvokeCommand(params));

//     const payloadString = result.Payload
//       ? new TextDecoder().decode(result.Payload)
//       : "{}";

//     console.log("Lambda Response Payload:", payloadString); // ✅ Log Lambda response

//     const payload = JSON.parse(payloadString);

//     if (payload.statusCode === 200) {
//        res.status(200).json(payload);
//        return
//     } else {
//       const statusCode = payload.statusCode || 500;
//       return res
//         .status(statusCode)
//         .json({ error: payload.error || "Unknown error occurred" });
//     }
//   } catch (error) {
//     console.error("❌ Error invoking Lambda:", error);
//     return res.status(500).json({ error: "Failed to process image" });
//   }
// };

export const uploadResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("Incoming Request Data:", req.body);

  try {
    // const { originalBucket, transformedBucket, imagePath } = req.body;
    const { originalBucket, transformedBucket, imagePath } = req.body;
    console.log("imagePath", imagePath);

    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ error: "Image file is required" });
    }

    const params = {
      FunctionName: "imageHub-processing-1",
      Payload: JSON.stringify({
        body: JSON.stringify({
          image: req.file.buffer.toString("base64"),
          imagePath,
          originalBucket,
          transformedBucket,
          contentType: req.file.mimetype,
        }),
      }), // ✅ Corrected: Wrapped in `body`
    };

    console.log("Sending Payload to Lambda:", params);

    const result = await lambda.send(new InvokeCommand(params));

    const payloadString = result.Payload
      ? new TextDecoder().decode(result.Payload)
      : "{}";

    console.log("Lambda Response Payload:", payloadString);

    const payload = JSON.parse(payloadString);

    if (!res.headersSent) {
      // ✅ **FIXED: Prevents "Cannot set headers after they are sent" issue**
      return res.status(payload.statusCode || 500).json(payload);
    }
  } catch (error) {
    console.error("❌ Error invoking Lambda:", error);
    if (!res.headersSent) {
      // ✅ **FIXED: Ensures response is sent only once**
      return res.status(500).json({ error: "Failed to process image" });
    }
  }
};

// ================== checking the lambada ===========================

export const findAndOptimizeReourse = async (
  req: Request<{ 0: string }>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const originalBucket =
    "image-tool-36d46958-af66-4840-a421-481c8a7e459f-original";
  const transformedBucket =
    "image-tool-36d46958-af66-4840-a421-481c8a7e459f-transformed";

  // Extract the image path
  const imagePath = req.params[0]; // Captures everything after `/image/`

  // Extract query parameters
  const { width, height, quality, format } = req.query;

  // Construct the queryParams string only if parameters exist
  const queryParams = [];
  if (width) queryParams.push(`width=${width}`);
  if (height) queryParams.push(`height=${height}`);
  if (quality) queryParams.push(`quality=${quality}`);
  if (format) queryParams.push(`format=${format}`);

  // Combine query parameters string (only if there are valid params)
  const queryParamsString = queryParams.length ? queryParams.join(",") : "";
  console.log(queryParamsString);
  console.log("imagePat", imagePath);
  // Prepare Lambda parameters
  const params = {
    originalImageBucketName: originalBucket,
    transformedImageBucketName: transformedBucket,
    transformedImageCacheTTL: "max-age=31536000",
    imagePath: imagePath,
    queryParams: queryParamsString,
  };

  const command = new InvokeCommand({
    FunctionName: "testFunction1",
    Payload: JSON.stringify(params),
  });

  try {
    const result = await lambda.send(command);

    const payloadString = result.Payload
      ? new TextDecoder().decode(result.Payload)
      : "{}";

    let payload;
    try {
      payload = JSON.parse(payloadString);
      if (payload.body) {
        payload.body = JSON.parse(payload.body); // Parse inner JSON body
      }
    } catch (parseError) {
      console.error("Error parsing Lambda response:", parseError);
      return res.status(500).json({ error: "Invalid Lambda response format." });
    }

    if (payload.statusCode === 200) {
      return res.status(200).json(payload);
    } else {
      const statusCode = payload.statusCode || 500;
      return res.status(statusCode).json({
        error: payload.body?.error || "Unknown error occurred",
        details: payload.body?.details || "",
        suggestion: payload.body?.suggestion || "",
      });
    }
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
    res.status(500).send("Internal Server Error");
  }
};


export const getAllBucketsForAccount = async (req: Request, res: Response):Promise<any> => {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    // Fetch all resources with type "bucket" and matching accountId
    const buckets = await db
      .select()
      .from(resources)
      .where(and(
        eq(resources.accountId, accountId),
        eq(resources.type, "bucket")
      ));
    return res.status(200).json({ success: true, data: buckets });
  } catch (error) {
    console.error("Error fetching buckets:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};