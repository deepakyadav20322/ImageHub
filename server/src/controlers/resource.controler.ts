import { Request, Response, NextFunction } from "express";
import { InvokeCommand, Lambda } from "@aws-sdk/client-lambda";
import multer from "multer";
import { resources } from "../db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/db_connect";
import AppError from "../utils/AppError";
import path from "path";
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

const SUPPORTED_TYPES: Record<string, string[]> = {
  image: ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff", "ico"],
  video: ["mp4", "avi", "mov", "mkv", "webm"],
  audio: ["mp3", "wav", "aac", "flac", "ogg"],
};

export const uploadResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("Incoming Request Data:", req.body);

  try {
    const { bucket_name, resource_type } = req.params;

    if (resource_type !== "image") {
      res.status(400).json({ message: "In present only image support!" });
      return;
    }

    const { imagePath, folderId } = req.body;
    // in req imagePath comes like /default/abc.png but it convert to default/abc.png because this type path support in s3
    // 👇Todo:  💀💀💀💀 if we use get call from api dashboard then file path comes like /original/default/subhamPandeySir.png (you also need to convert to(remove /original/) default/subhamPandeySir.png)
    const correctedImagePathForS3 = imagePath.split("/").slice(1).join("/");
    const { t_addOn } = req.body;
    if (bucket_name.split("-").length == 2) {
      next(new AppError("your bucket name is wrong", 500));
      return;
    }
    const originalBucket = bucket_name;

    console.log("Bucket Name:", bucket_name);
    console.log("Resource Type:", resource_type);

    // we check that resourceType and given file type mached ?
    console.log("file req outer", req.file);
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
    const fullPath = `${correctedImagePathForS3}/${req.file.originalname}`;
    console.log("fullPath", fullPath);
    console.log("o-bucket", originalBucket);
    //Todo: 👉👉 file path ke according , you make changes in lambda funciton code
    const params = {
      FunctionName: "testFunction1",
      Payload: JSON.stringify({
        body: JSON.stringify({
          image: req.file.buffer.toString("base64"),
          imagePath: fullPath,
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
    const fileName = file.originalname;
    const accountId =
      req.user?.account_id || "36d46958-af66-4840-a421-481c8a7e459f";

    const insertedResource = await db
      .insert(resources)
      .values({
        accountId,
        parentResourceId: folderId || null,
        type: "file",
        name: fileName,
        path: `/original/${fullPath}`, // We save path with including bucket(to mentain the parent child relationship hirirechi)
        visibility: "private",
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

// puran upload resorce api hai:-
// export const uploadResources = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   console.log("Incoming Request Data:", req.body);

// // -----------------------------------
//   try {
//     // const { originalBucket, transformedBucket, imagePath } = req.body;
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
//           imagePath:filePath,
//           originalBucket,
//           transformedBucket,
//           contentType: req.file.mimetype,
//         }),
//       }), // ✅ Corrected: Wrapped in `body`
//     };

//     console.log("Sending Payload to Lambda:", params);

//     const result = await lambda.send(new InvokeCommand(params));

//     const payloadString = result.Payload
//       ? new TextDecoder().decode(result.Payload)
//       : "{}";

//     console.log("Lambda Response Payload:", payloadString);

//     const payload = JSON.parse(payloadString);

//     if (!res.headersSent) {
//       // ✅ **FIXED: Prevents "Cannot set headers after they are sent" issue**
//       return res.status(payload.statusCode || 500).json(payload);
//     }
//   } catch (error) {
//     console.error("❌ Error invoking Lambda:", error);
//     if (!res.headersSent) {
//       // ✅ **FIXED: Ensures response is sent only once**
//       return res.status(500).json({ error: "Failed to process image" });
//     }
//   }
// };

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
export const getCurrentFoldersWithAllParents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;

    if (!folderId) {
      res
        .status(400)
        .json({ success: false, message: "Folder ID is required" });
      return;
    }

    // Recursive function to fetch the current folder and all parents
    const getFolderWithParents = async (
      currentFolderId: string
    ): Promise<any[]> => {
      const [folder] = await db
        .select()
        .from(resources)
        .where(
          and(
            eq(resources.resourceId, currentFolderId),
            eq(resources.type, "folder")
          )
        )
        .limit(1);

      // Return empty if folder not found
      if (!folder) return [];

      // Recursively get parent folders
      if (!folder.parentResourceId) return [folder];

      const parents = await getFolderWithParents(folder.parentResourceId);
      return [...parents, folder];
    };

    // Get all parent folders including the current folder
    const folderHierarchy = await getFolderWithParents(folderId);

    // Get immediate subfolders of the current folder
    const subfolders = await db
      .select()
      .from(resources)
      .where(
        and(
          eq(resources.parentResourceId, folderId),
          eq(resources.type, "folder")
        )
      );

    // Combine parent hierarchy and subfolders into a flat array
    const flatResult = [...folderHierarchy, ...subfolders];

    res.status(200).json({
      success: true,
      data: flatResult,
    });
    return;
  } catch (error: Error | any) {
    console.error("Error fetching folder hierarchy:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error?.message,
    });
    return;
  }
};



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

    const {
      folderId: parentResourceId,
      newFolderName: name,
      visibility = "private",
    } = req.body;
    // // console.log(parentResourceId,name,visibility);
    // res.status(200).json({mes:"succ",parentResourceId,name,visibility})
    // return
    // Validate input
    if (!parentResourceId || !name) {
      return res
        .status(400)
        .json({ message: "Parent Folder ID and Name are required." });
    }

    const accountId = req.user?.accountId ?? '06d5fb0f-6d5d-4427-8caf-fc767d09497f'// Assuming user info is available on req.user

    // Set the path for the new folder
    const [parentFolder] = await db
      .select()
      .from(resources)
      .where(eq(resources.resourceId, parentResourceId))
      .limit(1);

    if (!parentFolder) {
      return res.status(404).json({ message: "Parent folder not found." });
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

export default createFolder;
