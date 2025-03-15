import  express from "express";
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { getAllUsers,getUserById,inviteUserCreation,updateUser,deleteUser, welcome } from "../controlers/user.controler";
import { authorize } from "../middlewares/authPermission.middleware";


const route = express.Router();


route.get("/",authMiddleware, authorize(["user:create"]), getAllUsers);
route.get("/welcome",authMiddleware, welcome);
// route.get("/:id", getUserById);
// // 👉 Todo: implement role and permission based routr or api endpoint handling (think any better dynamic apprach )
// route.post("/",authMiddleware, inviteUserCreation);
// route.patch("/:id",authMiddleware, updateUser);
// route.delete("/:id",authMiddleware, deleteUser);


export default route ;
