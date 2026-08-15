import express from "express"
import {
    getUserNotifications,
    markUserNotificationRead
} from "../controllers/notificationController.js"
import authUser from "../middlewares/authUser.js"

const notificationRouter = express.Router()

notificationRouter.get(
    "/user",
    authUser,
    getUserNotifications
)

notificationRouter.post(
    "/user/read",
    authUser,
    markUserNotificationRead
)

export default notificationRouter