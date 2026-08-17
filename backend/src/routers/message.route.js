import express from "express";
import { getConversationsForSideBar, getMessages, getUsersForSideBar, sendMesssage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router();

router.use(protectRoute);

router.get("/users", getUsersForSideBar);
router.get("/conversations", getConversationsForSideBar);
router.get("/:id", getMessages);
router.post("/send/:id", upload.single("media"), sendMesssage); // todo: show this in frontend

export default router;