import express from "express";
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getAllUsers,
  getUserById,
  inviteUserCreation,
  updateUser,
  deleteUser,
  welcome,
  deleteAccount,
  updatePreference,
  updateUserProfile,
} from "../controlers/user.controler";
import { authorize } from "../middlewares/authPermission.middleware";

const route = express.Router();

route.get("/", authMiddleware, authorize(["user:create"]), getAllUsers);
route.delete(
  "/account/delete",
  authMiddleware,
  authorize(["account:delete"]),
  deleteAccount
);
route.get("/welcome", authMiddleware, welcome);
route.patch("/welcome", authMiddleware, updatePreference);
// route.get("/:id", getUserById);
// // 👉 Todo: implement role and permission based routr or api endpoint handling (think any better dynamic apprach )
// route.post("/",authMiddleware, inviteUserCreation);
route.patch("/profile-update/:userId",authMiddleware, updateUserProfile);
// route.delete("/:id",authMiddleware, deleteUser);

export default route;
