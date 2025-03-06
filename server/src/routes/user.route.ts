import  express from "express";
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { getAllUsers,getUserById,inviteUserCreation,updateUser,deleteUser } from "../controlers/user.controler";

const route = express.Router();


route.get("/",authMiddleware, getAllUsers);
route.get("/:id", getUserById);
// 👉 Todo: implement role and permission based routr or api endpoint handling (think any better dynamic apprach )
route.post("/",authMiddleware, inviteUserCreation);
route.patch("/:id",authMiddleware, updateUser);
route.delete("/:id",authMiddleware, deleteUser);


export default route ;
