import {Router} from "express"
import { loginUser, registerUser, verifyUser, logoutUser } from "../controller/user.controller.js";


const router = Router();




router.post("/register", registerUser);

router.post('/login', loginUser)

router.get('/me', verifyUser)

router.post('/logout', logoutUser)







export default router;


