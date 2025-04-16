import { Request, Response, NextFunction } from "express";
import {S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { InvokeCommand, Lambda } from "@aws-sdk/client-lambda";
import multer from "multer";
import { resources } from "../db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/db_connect";
import AppError from "../utils/AppError";
import path from "path";
import { validateTransformations } from "../utils/transformations";

export const getAllResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => { };

// ================== checking the lambada ===========================

const lambda = new Lambda({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., "us-east-1"
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

const SUPPORTED_TYPES: Record<string, string[]> = {
  image: ["auto","jpg", "jpeg", "png", "gif", "webp", "svg"],
  video: ["mp4", "avi", "mov", "mkv", "webm"],
  audio: ["mp3", "wav", "aac", "flac", "ogg"],
};
 
export const uploadResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {

  try {
    const { bucket_name, resource_type } = req.params;
    let { accountId: userAccountId } = req.user
    console.log(bucket_name,"bucketName");
    // here we check that bucket present or not?(if it in db then must it is s3)
    const [existingBucket] = await db.select().from(resources).where(and(
      eq(resources.name, bucket_name),
      eq(resources.accountId, userAccountId)))
      .limit(1);

    if (!existingBucket) {
      return res.status(400).json({ message: "Your environment not exist!", success: false })
    }


    if (resource_type !== "image") {
      res.status(400).json({ message: "In present only image support!" });
      return;
    }

    const { folderId } = req.body;
    // here we check that folder present or not in db

    const [folder] = await db
      .select()
      .from(resources)
      .where(and(
        eq(resources.resourceId, folderId),
        eq(resources.type, "folder")
      ))
      .limit(1);
      

    if (!folder) {
      return res.status(400).json({ message: "Folder not exist!", success: false });
    }


    // in req imagePath comes like /default/abc.png but it convert to default/abc.png because this type path support in s3
    // 👇Todo:  💀💀💀💀 if we use get call from api dashboard then file path comes like /original/default/subhamPandeySir.png (you also need to convert to(remove /original/) default/subhamPandeySir.png)
    const normalizeImagePath = (originalPath:string) => {
      // Remove leading/trailing slashes
      let path = originalPath.replace(/^\/+|\/+$/g, '');
      
      // Remove 'original/' prefix if present
      if (path.startsWith('original/')) {
      path = path.substring('original/'.length);
      }
      
      return path 
    };

    const { t_addOn } = req.body;
    if (bucket_name.split("-").length == 2) {
      next(new AppError("your bucket name is wrong", 500));
      return;
    }
    const originalBucket = bucket_name;

    console.log("Bucket Name:", bucket_name);
    console.log("Resource Type:", resource_type);

    // we check that resourceType and given file type mached ?
    const file = req.file;
    if (!req.file) {
      console.log("file req", req.file);
      return res.status(400).json({ mess: "file is not comming.." });
    }
    // Validate if resource_type is supported
    if (!SUPPORTED_TYPES[resource_type]) {
      return res.status(400).json({
        error: `Unsupported resource type: ${resource_type}. Supported types are: ${Object.keys(
          SUPPORTED_TYPES
        ).join(", ")}`,
      });
    }

    // ✅ Validate file upload
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Check file type matches resource type
    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .replace(".", "");

    if (!SUPPORTED_TYPES[resource_type].includes(fileExtension)) {
      return res.status(400).json({
        error: `File type '${fileExtension}' does not match resource type '${resource_type}'. Expected: ${SUPPORTED_TYPES[
          resource_type
        ].join(", ")}`,
      });
    }

    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ error: "Image file is required" });
    }
  //   const fullPath = `${correctedImagePathForS3}/${(req.file.originalname).replace(/\s/g, "")}`;
  // console.log(fullPath,"fullPath")
    //Todo: 👉👉 file path ke according , you make changes in lambda funciton code

  const ImagePathForLambda = normalizeImagePath(folder.path);
  console.log(ImagePathForLambda,"imagep")
   
  const params = {
    FunctionName: "testFunction1",
    Payload: JSON.stringify({
      body: JSON.stringify({
        image: req.file.buffer.toString("base64"),
        imagePath: `${ImagePathForLambda}/${(file.originalname).replace(/\s/g, "")}`,
        originalImageBucketName: originalBucket,
        // transformedBucket,
        t_addOn,
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

  // ✅ Check if Lambda returned an error
  if (payload.statusCode !== 200) {
    return res.status(payload.statusCode).json(JSON.parse(payload.body));
  }

  // ---------------------------------
  // ✅ Save file info to PostgreSQL (resources table)
  const fileUrl = payload.fileUrl;
  const fileType = file.mimetype;
  const fileName = (file.originalname).replace(/\s/g, "");
  const accountId =
    req.user.accountId;

  const insertedResource = await db
    .insert(resources)
    .values({
      accountId,
      parentResourceId: folderId || null,
      type: "file",
      name: fileName,
      path: `${folder.path}/${fileName}`, // We save path with including bucket(to mentain the parent child relationship hirirechi)
      visibility: "public",
      inheritPermissions: true,
      overridePermissions: false,
      metadata: {
        size: file.size,
        mimetype: fileType,
      },
      resourceTypeDetails: {
        format: fileType,
        dimensions: payload.dimensions || null, // Assuming Lambda provides this
      },
      status: "active",
    })
    .returning();

  if (!res.headersSent) {
    // ✅ **FIXED: Prevents "Cannot set headers after they are sent" issue**
    // return res.status(payload.statusCode || 500).json(payload);
    return res.status(200).json({
      success: true,
       data:{...payload,url:`${process.env.SERVER_BASE_URL}/api/v1/resource/${bucket_name}/image/upload/${fileName}`}
    });
    
    
    
  }
  
  } catch (error) {
    console.error("❌ Error invoking Lambda:", error);
    if (!res.headersSent) {
      // ✅ **FIXED: Ensures response is sent only once**
      return res.status(500).json({ error: "Failed to process image" });
    }
  }
};

export const uploadResourcess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { bucket_name, resource_type } = req.params;
    console.log(req.headers)
    const t_addOn = req.body.t_addOn;
    const folderId = req.body.folderId || req.headers['x-folder-id'] || req.query.folderId;
    const { accountId: userAccountId } = req.user;
  console.log(folderId,"folderIdd")
  console.log(req.files)
    const [existingBucket] = await db.select().from(resources).where(
      and(eq(resources.name, bucket_name), eq(resources.accountId, userAccountId))
    ).limit(1);

    if (!existingBucket) {
      return res.status(400).json({ message: "Your environment does not exist!", success: false });
    }

    if (resource_type !== "image") {
      return res.status(400).json({ message: "Only image type is supported currently." });
    }

    const [folder] = await db.select().from(resources).where(
      and(eq(resources.resourceId, folderId), eq(resources.type, "folder"))
    ).limit(1);

    if (!folder) {
      return res.status(400).json({ message: "Folder does not exist!", success: false });
    }

    if (!Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const normalizeImagePath = (originalPath: string) => {
      let path = originalPath.replace(/^\/+|\/+$/g, '');
      if (path.startsWith('original/')) {
        path = path.substring('original/'.length);
      }
      return path;
    };

    const originalBucket = bucket_name;
    const ImagePathForLambda = normalizeImagePath(folder.path);

    const uploadedFiles = [];

    for (const file of req.files as Express.Multer.File[]) {
      const fileExtension = path.extname(file.originalname).toLowerCase().replace(".", "");
      const fileName = file.originalname.replace(/\s/g, "");

      // Skip unsupported file types
      if (!SUPPORTED_TYPES[resource_type]?.includes(fileExtension)) {
        uploadedFiles.push({
          fileName,
          success: false,
          error: `Unsupported file type: ${fileExtension}`,
        });
        continue;
      }

      const lambdaParams = {
        FunctionName: "testFunction1",
        Payload: JSON.stringify({
          body: JSON.stringify({
            image: file.buffer.toString("base64"),
            imagePath: `${ImagePathForLambda}/${fileName}`,
            originalImageBucketName: originalBucket,
            t_addOn,
            contentType: file.mimetype,
          }),
        }),
      };

      try {
        const result = await lambda.send(new InvokeCommand(lambdaParams));
        const payloadString = result.Payload ? new TextDecoder().decode(result.Payload) : "{}";
        const payload = JSON.parse(payloadString);

        if (payload.statusCode !== 200) {
          uploadedFiles.push({
            fileName,
            success: false,
            error: JSON.parse(payload.body).error || "Lambda failed",
          });
          continue;
        }

        const { fileUrl, dimensions } = payload;

        await db.insert(resources).values({
          accountId: userAccountId,
          parentResourceId: folderId || null,
          type: "file",
          name: fileName,
          path: `${folder.path}/${fileName}`,
          visibility: "public",
          inheritPermissions: true,
          overridePermissions: false,
          metadata: {
            size: file.size,
            mimetype: file.mimetype,
          },
          resourceTypeDetails: {
            format: file.mimetype,
            dimensions: dimensions || null,
          },
          status: "active",
        });
      
        const fullPath =  `${folder.path}/${fileName}`;
        console.log("fullpath",fullPath)
        console.log("fullpath replace",fullPath.replace("/original/default/", ""))
        uploadedFiles.push({
          fileName,
          success: true,
          url: `${process.env.SERVER_BASE_URL}/api/v1/resource/${bucket_name}/image/upload/${fullPath.replace("/original/default/", "")}`,
          dimensions,
        });

      } catch (lambdaErr) {
        console.error(`❌ Lambda error for file ${fileName}:`, lambdaErr);
        uploadedFiles.push({
          fileName,
          success: false,
          error: "Lambda invocation failed",
        });
      }
    }
    console.log(uploadedFiles)

    return res.status(200).json({
      success: true,
      uploadedFiles,
    });

  } catch (error) {
    console.error("❌ Error processing files:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to process files" });
    }
  }
};


export const findAndOptimizeResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {

  const { bucket, transformations, path } = req.params;
  const overallStart = Date.now();
console.log(req.params,"params")
  try {
    // ⏱ Step 1: DB validation
    const dbStart = Date.now();
    const [existingBucket] = await db
      .select()
      .from(resources)
      .where(and(eq(resources.name, bucket), eq(resources.type, "bucket")))
      .limit(1);
    const dbEnd = Date.now();
    console.log(`📦 DB validation took ${dbEnd - dbStart}ms`);

    if (!existingBucket) {
      console.log("bucket not exist")
      return res.status(404).send();
      // return res.status(404).json({ error: "Invalid bucket environment" });
    }
   

    // ⏱ Step 2: Transformation validation
    const validateStart = Date.now();
    if (transformations && transformations !== 'original') {
      const { valid, error } = validateTransformations(transformations);
      const validateEnd = Date.now();
      console.log("transformations",transformations)
      console.log(`🔍 Transformation validation took ${validateEnd - validateStart}ms`);
     console.log("valid",valid)
      if (!valid) {
        if (process.env.NODE_ENV === 'development') {
          return res.status(400).json({ error });
        }
        return res.status(404).send();
      }
    }
console.log("chaaaall2")
    // ⏱ Step 3: Lambda Invocation
    const lambdaPayload = {
      bucket,
      path: `default/${path}`,
      transformations,
      headers: req.headers,
      query: req.query,
    };

    const lambdaStart = Date.now();
    const lambdaResponse = await lambda.send(new InvokeCommand({
      FunctionName: process.env.IMAGE_PROCESSOR_LAMBDA!,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify(lambdaPayload)),
    }));
    const lambdaEnd = Date.now();
    console.log(`⚙️ Lambda execution took ${lambdaEnd - lambdaStart}ms`);

    // ⏱ Step 4: Response parsing
    const parseStart = Date.now();
    const responseText = new TextDecoder().decode(lambdaResponse.Payload);
    const parsedResponse = JSON.parse(responseText);
    const parseEnd = Date.now();
    console.log(`📦 Lambda response parse took ${parseEnd - parseStart}ms`);
     console.log("parsedResponse",parsedResponse)
    if (!parsedResponse.statusCode) {
      throw new Error('Lambda response missing statusCode');
    }

    const totalDuration = Date.now() - overallStart;
    console.log(`✅ Total request handled in ${totalDuration}ms`);

    // ✅ Step 5: Send final response---------------------------
    // if (parsedResponse.isBase64Encoded) {
    //   return res
    //     .status(parsedResponse.statusCode)
    //     .set(parsedResponse.headers || {})
    //     .send(Buffer.from(parsedResponse.body, 'base64'));
    // }



    // return res
    //   .status(parsedResponse.statusCode)
    //   .set(parsedResponse.headers || {})
    //   .json({
    //     ...parsedResponse.body,
    //     duration: `${totalDuration}ms`,
    //   });


    // ✅ Step 5: Send final response ---------------------------
const { statusCode, body, headers, isBase64Encoded } = parsedResponse;

// ⛔ Handle 404: Image not found
if (statusCode === 404) {
  const errorBody = typeof body === "string" ? JSON.parse(body) : body;
  // return res.status(404).json({
  //   error: "Image not found",
  //   message: errorBody?.message || "Requested file does not exist in S3",
  //   duration: `${totalDuration}ms`,
  // });
  console.log('bucket key does not exist')
  return res.status(404).send()
}

// ⛔ Handle other non-200 errors
if (statusCode !== 200) {
  const errorBody = typeof body === "string" ? JSON.parse(body) : body;
  return res.status(statusCode).json({
    error: "Image processing failed",
    message: errorBody?.message || "An error occurred during processing",
    duration: `${totalDuration}ms`,
    ...(process.env.NODE_ENV === 'development' && {
      details: errorBody?.stack,
    }),
  });
}

// ✅ Success response
if (isBase64Encoded) {
  return res
    .status(statusCode)
    .set(headers || {})
    .send(Buffer.from(body, 'base64'));
}

// ✅ JSON response
// return res
//   .status(statusCode)
//   .set(headers || {})
//   .json({
//     ...(typeof body === "string" ? JSON.parse(body) : body),
//     duration: `${totalDuration}ms`,
//   });

  return res.status(404).send()


  } catch (err) {
    const totalDuration = Date.now() - overallStart;
    console.error(`❌ Request failed after ${totalDuration}ms`, err);

    return res.status(500).json({
      error: "Image processing failed",
      duration: `${totalDuration}ms`,
      ...(process.env.NODE_ENV === 'development' && {
        details: err instanceof Error ? err.message : 'Unknown error',
      }),
    });
  }
};


// Extracted validation function
// function validateTransformations(transformStr: string) {
//   type SupportedConfig = {
//     c: string[];
//     w: { min: number; max: number };
//     h: { min: number; max: number };
//     q: { min: number; max: number };
//     f: string[];
//   };

//   const SUPPORTED: SupportedConfig = {
//     c: ["fill", "fit", "limit", "pad", "scale", "thumb", "crop"],
//     w: { min: 1, max: 5000 },
//     h: { min: 1, max: 5000 },
//     q: { min: 1, max: 100 },
//     f: ["auto", "jpg", "jpeg", "webp", "avif", "png"],
//   };

//   const transformations = transformStr.split(',');

//   for (const t of transformations) {
//     const [key, value] = t.split('_');

//     if (!SUPPORTED[key as keyof SupportedConfig]) {
//       return { valid: false, error: `Unsupported transformation: ${key}` };
//     }

//     const config = SUPPORTED[key as keyof SupportedConfig];

//     if (Array.isArray(config)) {
//       if (!config.includes(value)) {
//         return {
//           valid: false,
//           error: `Invalid value for ${key}: ${value}`,
//           allowedValues: config
//         };
//       }
//     } else {
//       const num = parseInt(value, 10);
//       if (isNaN(num) || num < config.min || num > config.max) {
//         return {
//           valid: false,
//           error: `${key} must be between ${config.min}-${config.max}`,
//           received: value
//         };
//       }
//     }
//   }

//   return { valid: true };
// }

export const getAllBucketsForAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    // Fetch all resources with type "bucket" and matching accountId
    const buckets = await db
      .select()
      .from(resources)
      .where(
        and(eq(resources.accountId, accountId), eq(resources.type, "bucket"))
      );
    return res.status(200).json({ success: true, data: buckets });
  } catch (error) {
    console.error("Error fetching buckets:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


// export const getCurrentFoldersWithAllParents = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { folderId } = req.params;
//     console.log("fId", folderId);
//     console.log(req.params);
//     if (!folderId) {
//       res
//         .status(400)
//         .json({ success: false, message: "Folder ID is required" });
//       return;
//     }

//     // Function to fetch current folder and parents recursively
//     const getFolderWithParents = async (
//       currentFolderId: string
//     ): Promise<any[]> => {
//       const [folder] = await db
//         .select()
//         .from(resources)
//         .where(
//           and(
//             eq(resources.resourceId, currentFolderId),
//             eq(resources.type, "folder")
//           )
//         )
//         .limit(1);

//       // Return empty if folder not found
//       if (!folder) return [];

//       // Recursively fetch parent folders
//       if (!folder.parentResourceId) return [folder];

//       const parents = await getFolderWithParents(folder.parentResourceId);
//       return [...parents, folder];
//     };

//     const folderHierarchy = await getFolderWithParents(folderId);

//     res.status(200).json({
//       success: true,
//       data: folderHierarchy,
//     });
//     return;
//   } catch (error: Error | any) {
//     console.error("Error fetching folder hierarchy:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred",
//       error: error?.message,
//     });
//     return;
//   }
// };

// export const getAssetsOfParticularFolder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const folderId = req.params.folderId;
//     if (!folderId) {
//       res.status(400).json({ message: "Folder ID is required" });
//       return;
//     }

//     // 🟢 Recursive Query to Fetch All Files
//     const query = sql`
//       WITH RECURSIVE folder_hierarchy AS (
//           -- Start with the target folder, selecting all fields
//           SELECT
//               *
//           FROM resources
//           WHERE resource_id = ${folderId} AND type = 'folder'

//           UNION ALL

//           -- Recursively fetch subfolders, selecting all fields
//           SELECT
//               r.*
//           FROM resources r
//           INNER JOIN folder_hierarchy fh ON r.parent_resource_id = fh.resource_id
//           WHERE r.type = 'folder'
//       )
//       -- Retrieve all files in the folder hierarchy, selecting all fields
//       SELECT
//           r.*
//       FROM resources r
//       WHERE r.type = 'file' AND r.parent_resource_id IN (SELECT resource_id FROM folder_hierarchy);
//     `;

//     //  Execute Query
//     const filesInFolder = await db.execute(query);

//     return res.status(200).json({
//       success: true,
//       data: filesInFolder.rows,
//     });
//   } catch (error) {
//     next(
//       new AppError("Something wentwrong during getting asets of folder", 500)
//     );
//   }
// };

// it send folders with one level subfolders
// export const getCurrentFoldersWithAllParents = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { folderId } = req.params;

//     if (!folderId) {
//       res
//         .status(400)
//         .json({ success: false, message: "Folder ID is required" });
//       return;
//     }

//     // Recursive function to fetch the current folder and all parents
//     const getFolderWithParents = async (
//       currentFolderId: string
//     ): Promise<any[]> => {
//       const [folder] = await db
//         .select()
//         .from(resources)
//         .where(
//           and(
//             eq(resources.resourceId, currentFolderId),
//             eq(resources.type, "folder")
//           )
//         )
//         .limit(1);

//       // Return empty if folder not found
//       if (!folder) return [];

//       // Recursively get parent folders
//       if (!folder.parentResourceId) return [folder];

//       const parents = await getFolderWithParents(folder.parentResourceId);
//       return [...parents, folder];
//     };

//     // Get all parent folders including the current folder
//     const folderHierarchy = await getFolderWithParents(folderId);

//     // Get immediate subfolders of the current folder
//     const subfolders = await db
//       .select()
//       .from(resources)
//       .where(
//         and(
//           eq(resources.parentResourceId, folderId),
//           eq(resources.type, "folder")
//         )
//       );

//     // Combine parent hierarchy and subfolders into a flat array
//     const flatResult = [...folderHierarchy, ...subfolders];

//     res.status(200).json({
//       success: true,
//       data: flatResult,
//     });
//     return;
//   } catch (error: Error | any) {
//     console.error("Error fetching folder hierarchy:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred",
//       error: error?.message,
//     });
//     return;
//   }
// };


export const getCurrentFoldersWithAllParents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { folderId } = req.params;

    if (!folderId) {
      return res
        .status(400)
        .json({ success: false, message: "Folder ID is required" });
    }

    // Define camelCase mapping for all fields
    const camelCaseMap: Record<string, string> = {
      resource_id: 'resourceId',
      account_id: 'accountId',
      parent_resource_id: 'parentResourceId',
      type: 'type',
      name: 'name',
      displayName: 'displayName',
      path: 'path',
      visibility: 'visibility',
      inherit_permissions: 'inheritPermissions',
      override_permissions: 'overridePermissions',
      metadata: 'metadata',
      resource_type_details: 'resourceTypeDetails',
      version_id: 'versionId',
      expires_at: 'expiresAt',
      status: 'status',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      deleted_at: 'deletedAt'
    };

    // Using Drizzle's SQL expression builder with proper table references
    const query = sql`
      WITH RECURSIVE folder_ancestors AS (
        SELECT * FROM ${resources}
        WHERE ${and(
      eq(resources.resourceId, sql`${folderId}`),
      eq(resources.type, 'folder'),
      eq(resources.status, 'active')
    )}
        
        UNION ALL
        
        SELECT resources.* FROM ${resources}
        JOIN folder_ancestors fa ON resources.resource_id = fa.parent_resource_id
        WHERE ${and(
      eq(resources.type, 'folder'),
      eq(resources.status, 'active')
    )}
      ),
      
      target_folder AS (
        SELECT parent_resource_id FROM folder_ancestors 
        WHERE resource_id = ${folderId}
        LIMIT 1
      ),
      
      folder_siblings AS (
        SELECT resources.* FROM ${resources}
        WHERE ${and(
      eq(resources.parentResourceId, sql`(SELECT parent_resource_id FROM target_folder)`),
      eq(resources.type, 'folder'),
      eq(resources.status, 'active'),
      sql`resources.resource_id != ${folderId}`
    )}
      ),
      
      folder_children AS (
        SELECT resources.* FROM ${resources}
        WHERE ${and(
      eq(resources.parentResourceId, sql`${folderId}`),
      eq(resources.type, 'folder'),
      eq(resources.status, 'active')
    )}
      )
      
      SELECT * FROM folder_ancestors
      UNION ALL
      SELECT * FROM folder_siblings
      UNION ALL
      SELECT * FROM folder_children
    `;

    const result = await db.execute(query);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found or empty hierarchy" });
    }

    // Convert snake_case to camelCase
    const camelCaseResults = result.rows.map(row => {
      const camelCaseRow: any = {};
      for (const [key, value] of Object.entries(row)) {
        const camelKey = camelCaseMap[key] || key;
        camelCaseRow[camelKey] = value;
      }
      return camelCaseRow;
    });

    return res.status(200).json({
      success: true,
      data: camelCaseResults
    });

  } catch (error) {
    console.error("Error fetching folder hierarchy:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};

// ---------------------------------------------------------------
export const getAllFoldersDataByAccountId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { accountId } = req.user;

    // // Validate accountId format (basic UUID check)
    // if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(accountId)) {
    //   return res.status(400).json({ error: 'Invalid account ID format' });
    // }



    const folders = await db
      .select({
        resourceId: resources.resourceId,
        accountId: resources.accountId,
        parentResourceId: resources.parentResourceId,
        type: resources.type,
        name: resources.name,
        displayName: resources.displayName,
        path: resources.path,
        visibility: resources.visibility,
        inheritPermissions: resources.inheritPermissions,
        overridePermissions: resources.overridePermissions,
        metadata: resources.metadata,
        resourceTypeDetails: resources.resourceTypeDetails,
        versionId: resources.versionId,
        expiresAt: resources.expiresAt,
        status: resources.status,
        createdAt: resources.createdAt,
        updatedAt: resources.updatedAt,
        deletedAt: resources.deletedAt
      })
      .from(resources)
      .where(
        and(
          eq(resources.accountId, accountId),
          eq(resources.type, 'folder'),
          // isNull(resources.deletedAt),
          eq(resources.status, 'active')
        )
      )
      .orderBy(resources.path);

    res.json({ data: folders, success: true });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}


// ------------------------------------





export const getAssetsOfParticularFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { folderId } = req.params;

    if (!folderId) {
      res.status(400).json({ message: "Folder ID is required" });
      return;
    }

    // Fetch folder and parent hierarchy using ORM
    const getFolderHierarchy = async (
      currentFolderId: string
    ): Promise<any[]> => {
      const currentFolder = await db
        .select()
        .from(resources)
        .where(
          and(
            eq(resources.resourceId, currentFolderId),
            eq(resources.type, "folder")
          )
        );

      // If folder not found, return empty
      if (currentFolder.length === 0) return [];

      // Recursively fetch child folders
      const childFolders = await db
        .select()
        .from(resources)
        .where(
          and(
            eq(resources.parentResourceId, currentFolderId),
            eq(resources.type, "folder")
          )
        );

      // Recursively get subfolders
      const nestedFolders = await Promise.all(
        childFolders.map((folder) => getFolderHierarchy(folder.resourceId))
      );

      // Flatten nested arrays and combine with current folder
      return [currentFolder[0], ...nestedFolders.flat()];
    };

    // Get folder hierarchy
    const folderHierarchy = await getFolderHierarchy(folderId);

    // Get files from all retrieved folders
    const folderIds = folderHierarchy.map((folder) => folder.resourceId);

    const filesInFolder = await db
      .select()
      .from(resources)
      .where(
        and(
          eq(resources.type, "file"),
          inArray(resources.parentResourceId, folderIds)
        )
      );

    res.status(200).json({
      success: true,
      data: filesInFolder,
    });
  } catch (error) {
    next(
      new AppError("Something went wrong during fetching assets of folder", 500)
    );
  }
};

export const createFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // we always have one folder which is default and all folders comes under this it means always folderId comes for creating folder;
console.log("create folder me aaay")
    const {
      parentFolderId: parentResourceId,
      folderName: name,
      visibility = "private",
    } = req.body;

    if (!parentResourceId || !name) {
      return res
        .status(400)
        .json({ message: "Parent Folder ID and Name are required." });
    }

    const accountId = req.user.accountId // Assuming user info is available on req.user

    // Set the path for the new folder
    const [parentFolder] = await db
      .select()
      .from(resources)
      .where(eq(resources.resourceId, parentResourceId))
      .limit(1);

    if (!parentFolder) {
      return res.status(404).json({ message: "Parent folder not found." });
    }

    // Check if folder with same name already exists under the parent folder
    const [existingFolder] = await db
      .select()
      .from(resources)
      .where(
        and(
          eq(resources.parentResourceId, parentResourceId),
          eq(resources.name, name),
          eq(resources.type, 'folder')
        )
      )
      .limit(1);

    if (existingFolder) {
      return res.status(400).json({ 
        message: "A folder with this name already exists."
        ,success:false
      });
    }

    // Build the folder path
    const path = `${parentFolder.path}/${name}`;

    // Insert the new folder
    const [newFolder] = await db
      .insert(resources)
      .values({
        accountId: accountId,
        parentResourceId: parentResourceId,
        type: "folder",
        name,
        displayName: name,
        path,
        visibility,
        inheritPermissions: true,
        overridePermissions: false,
        metadata: null,
        resourceTypeDetails: null,
        versionId: null,
        expiresAt: null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })
      .returning();

    // Send response
    res.status(201).json({
      message: "Folder created successfully.",
      folder: newFolder,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("Something went wrong in folder creation", 400));
  }
};

export const getRootFolderOfBucketOfAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  try {
    let accountId;
    if (req.body?.accountId) {
      accountId = req.body.accountId;
    } else {
      accountId = req.user.accountId;
    }
    const { bucketId } = req.params;
    console.log(accountId, bucketId)
    if (!accountId || !bucketId) {
      res.status(400).json({ message: "Account or bucket not exist" });
      return;
    }
    const data = await db
      .select()
      .from(resources)
      .where(
        and(
          eq(resources.accountId, accountId),
          eq(resources.name, "default"),
          eq(resources.type, "folder"),
          eq(resources.parentResourceId, bucketId)
        )
      )
      .limit(1);

    if (!data.length) {
      return res.status(404).json({ message: "Root folder not found for this bucket" });
    }

    return res.status(200).json({
      success: true,
      data: data[0]
    });

  } catch (error) {
    console.log(error);
    next(new AppError("Error during fetching root-folder of given bucket", 400))
  }
}

export const deleteFolderOfBucketWhithAllChildItems = async (req:Request, res:Response, next:NextFunction):Promise<any>=>{
  try {
          
    const {folderId,bucketId} = req.params;
    if(!folderId || !bucketId){
      return res.status(400).json({message:'folderId and bucketId required'});
    }
    const {accountId} = req.user;
    // Check if folder exists and belongs to the given bucket
    const [folder] = await db
      .select()
      .from(resources)
      .where(and(
      eq(resources.resourceId, folderId),
      eq(resources.type, "folder"),
      eq(resources.accountId, accountId) // ownership check
      ))
      .limit(1);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found or access denied" });
    }



     // We also have an option for soft delete.
   
     // if we use where clouse then cascade feature not work 
   const ress =   await db
     .delete(resources)
     .where(and(eq(resources.resourceId, folderId)
    ));
   
  

    return res.status(200).json({
      success: true, 
      message: "Folder and all contents permanently deleted",
      ress
    });
  } catch (error) {
    
  }
}


export const deleteSingleAsset = async (req:Request,res:Response,next:NextFunction):Promise<any>=>{
try {
  const {bucketId,folderId,assetId} = req.params;
  if(!bucketId || !folderId || !assetId){
    return res.json({message:"required parameters are absent",success:false});
  }
  const { accountId } = req.user;
console.log(bucketId,folderId,assetId)
  // Check if bucket exists
  const [bucket] = await db
    .select()
    .from(resources)
    .where(and(
      eq(resources.resourceId, bucketId),
      eq(resources.type, "bucket"),
      eq(resources.accountId, accountId)
    ))
    .limit(1);
console.log(bucket)
  if (!bucket) {
    return res.status(404).json({ message: "Bucket not found" ,success:false});
  }

  const [asset] = await db.select().from(resources).
    where(and(
      eq(resources.resourceId, assetId),
      eq(resources.type, "file"),
      eq(resources.parentResourceId, folderId),
      eq(resources.accountId, accountId)
    )).limit(1);

  
  if (!asset) {
    return res.status(404).json({ message: "Asset not found or invalid relationship" });
  }
  
  const s3Key = asset.path.replace(/^\/?original\//, "");
  
  // delete from s3 first then db
  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: `${accountId}-original`,
      Key: s3Key,
    }));
  
    const deletedData = await db
    .delete(resources)
    .where(and(
      eq(resources.resourceId, assetId),
      eq(resources.type, "file"),
      eq(resources.parentResourceId, folderId),
      eq(resources.accountId, accountId)
    ))
  
console.log("deleted data",deletedData)
  if (!deletedData) {
    return res.status(404).json({ message: "Asset not found or invalid relationship" });
  }
    return res.status(200).json({ message: "Asset deleted successfully" });
  
  } catch (err) {
    console.error("deletion error during assets delete", err);
    return res.status(500).json({ message: "Failed to delete asset from storage. Try again later." });
  }
  

} catch (error) {
  console.log(error)
  throw (new AppError("Server error during asset deletion",500))
}
}
