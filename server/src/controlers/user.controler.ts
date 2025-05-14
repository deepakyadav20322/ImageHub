import { Request, Response, NextFunction } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/db_connect";
import { accounts, invites, resources, roles, users } from "../db/schema";
import AppError from "../utils/AppError";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";
import { sendMail } from "../utils/mailer";
import { inviteUserEmailTemplate } from "../utils/inviteUserEmailTemplate";
import bcrypt from 'bcrypt';


export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allUsers = await db.select().from(users);
    res.status(200).json({
      success: true,
      count: allUsers.length,
      data: allUsers,
    });
  } catch (error) {
    next(new AppError("something went wrong in user getting", 500));
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);
    if (!user.length) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({ success: true, data: user[0] });
  } catch (error) {
    next(error);
  }
};

export const inviteUserCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { };

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const updatedUser = await db
      .update(users)
      .set(req.body)
      .where(eq(users.userId, userId))
      .returning();

    if (!updatedUser.length) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: updatedUser[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const deletedUser = await db
      .delete(users)
      .where(eq(users.userId, userId))
      .returning();
    if (!deletedUser.length) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser[0],
    });
  } catch (error) {
    next(error);
  }
};

export const welcome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { intrest, companyName, domain } = req.body;

  // Validation
  if (!intrest || !companyName || !domain) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    const result = await db
      .insert(accounts)
      .values({
        preferences: {
          intrest,
          companyName,
          domain,
        },
      })
      .returning();

    res.status(201).json({ message: "Data saved successfully", data: result });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data." });
  }
};
export const updatePreference = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { interest, organization = '' } = req.body;

  try {
    const accountId = req.user?.accountId;
    if (!accountId) {
      throw new AppError("AccountId is required", 400);
    } console.log(interest, organization)

    const result = await db
      .update(accounts)
      .set({
        preferences: {
          interest,
          companyName: organization,
          domain: "",
        },
        gettingStarted: false
      })
      .where(eq(accounts.accountId, accountId))
      .returning();

    if (!result.length) {
      throw new AppError("Account not found", 404);
    }

    res.status(201).json({ message: "Data saved successfully", data: result });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data." });
  }
};




export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


// here we delered the account whaere we delete the s3 bucket , for this first we must delete the all resoures from that bucket(it's rule);
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accountId = req.user?.accountId;
    if (!accountId) {
      next(new AppError("AccountId is required", 400));
      return;
    }

    // Step 1: Retrieve associated buckets from the database
    const buckets = await db
      .select({ name: resources.name })
      .from(resources)
      .where(
        and(eq(resources.accountId, accountId), eq(resources.type, "bucket"))
      );

    // Step 2: Delete S3 Buckets
    // for (const bucket of buckets) {
    //   const bucketName = bucket.name;

    //   // Step 2.1: List and delete objects inside the bucket
    //   const listObjects = await s3Client.send(
    //     new ListObjectsV2Command({ Bucket: bucketName })
    //   );

    //   console.log("objectList:-> ", listObjects)

    //   if (listObjects.Contents) {
    //     await Promise.all(
    //       listObjects.Contents.map(async (object) => {
    //         await s3Client.send(
    //           new DeleteObjectCommand({
    //             Bucket: bucketName,
    //             Key: object.Key!,
    //           })
    //         );
    //       })
    //     );
    //   }

    //   // Step 2.2: Delete the empty bucket
    //   await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
    // }

    // Step 3: Delete the account from the database
    const accountDelete = await db
      .delete(accounts)
      .where(eq(accounts.accountId, accountId))
      .returning();

    if (!accountDelete.length) {
      throw new AppError("Account not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Account and associated S3 buckets deleted successfully",
      data: accountDelete[0],
    });
  } catch (err) {
    console.error("Account deletion error:-> ", err);
    next(new AppError("Something went wrong during account deletion", 500));
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId || req.params?.userId
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!existingUser.length) {
      throw new AppError("User not found", 404);
    }

    const updateData: Partial<{ firstName: string; lastName: string }> = {};
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.userId, userId))
      .returning();

    if (!updatedUser.length) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: updatedUser[0]
    });
  } catch (error) {
    new AppError('Something went wrong during user updation', 500)
  }
};


export const inviteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, roleId, expiresInDays = 7 } = req.body;
    console.log(req.body)
    const inviterId = req.user.userId;

    if (!email || !roleId || !inviterId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if the user is already invited
    const existing = await db
      .select()
      .from(invites)
      .where(eq(invites.email, email));

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already invited." });
    }

    const token = Math.random().toString(36).substring(2, 15); // 13 character random alphanumeric token

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await db.insert(invites).values({
      email,
      token,
      inviterId,
      roleId,
      expiresAt,
      status: "pending",
    });


    let firstName = req.user.firstName;
    let lastName = req.user.lastName
    await sendMail({
      to: email,
      subject: 'Invite user email',
      html: inviteUserEmailTemplate({ firstName, lastName, tokenId: token }),
    });


    return res.status(201).json({ message: "Invitation sent successfully.", success: true });
  } catch (error) {
    console.error("Invite error:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};


export const confirmUserInvite = async (req: Request, res: Response): Promise<any> => {
  try {
    const { inviteToken, email, password, firstName, lastName } = req.body;
    console.log(req.body);

    if (!inviteToken || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Token, email and password are required."
      });
    }

    // Find and verify the invitation
    const invitation = await db
      .select()
      .from(invites)
      .where(
        and(
          eq(invites.token, inviteToken),
          eq(invites.email, email),
          eq(invites.status, "pending")
        )
      )
      .limit(1);

    if (!invitation.length) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired invitation."
      });
    }

    const invite = invitation[0];

    // Check if invitation has expired
    if (new Date() > invite.expiresAt) {
      await db
        .update(invites)
        .set({ status: "expired" })
        .where(eq(invites.token, inviteToken));

      return res.status(400).json({
        success: false,
        message: "Invitation has expired."
      });
    }

    // Check if user already exists with this email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists."
      });
    }

    // Get inviter's accountId
    const inviter = await db
      .select({ accountId: users.accountId, product_environments: users.product_environments })
      .from(users)
      .where(eq(users.userId, invite.inviterId))
      .limit(1);

    if (!inviter.length) {
      return res.status(404).json({
        success: false,
        message: "Inviter not found."
      });
    }

    const inviterAccountId = inviter[0].accountId;


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const [newUser] = await db
      .insert(users)
      .values({
        firstName: firstName,
        lastName: lastName,
        email,
        password: hashedPassword,
        emailVerified: true,
        accountId: inviterAccountId,
        roleId: invite.roleId,
        invitedBy: invite.inviterId,
        userType: "inviteOnly",
        userStatus: "active",
        product_environments: inviter[0].product_environments
      })
      .returning();

    // Update invitation status
    await db
      .update(invites)
      .set({ status: "accepted" })
      .where(eq(invites.token, inviteToken));

    return res.status(200).json({
      success: true,
      message: "User created successfully from invitation.",
      data: {
        userId: newUser.userId,
        email: newUser.email,
        roleId: newUser.roleId
      }
    });

  } catch (error) {
    console.error("Confirmation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};


export const getInviteUserInfo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required"
      });
    }

    const invitation = await db
      .select()
      .from(invites)
      .where(eq(invites.token, token))
      .limit(1);

    if (!invitation.length) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found"
      });
    }
    const invite = invitation[0];

    // Get inviter details
    const inviter = await db
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.userId, invite.inviterId))
      .limit(1);

    if (!inviter.length) {
      return res.status(404).json({
        success: false,
        message: "Inviter not found"
      });
    }

    // Get role details
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.roleId, invite.roleId))
      .limit(1);

    const responseData = {
      ...invite,
      inviter: inviter[0],
      role: role[0]
    };
    return res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error("Error getting invite info:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
