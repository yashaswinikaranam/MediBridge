import notificationModel from "../models/notificationModel.js"


// Get user notifications
const getUserNotifications = async (req, res) => {
    try {

        const userId = req.userId

        const notifications = await notificationModel
            .find({
                recipientId: userId,
                recipientType: "User"
            })
            .sort({ createdAt: -1 })

        res.json({
            success: true,
            notifications
        })

    } catch (error) {

        console.log(error)

        res.json({
            success: false,
            message: error.message
        })
    }
}


// Mark user notification as read
const markUserNotificationRead = async (req, res) => {
    try {

        const userId = req.userId
        const { notificationId } = req.body

        const notification =
            await notificationModel.findOneAndUpdate(
                {
                    _id: notificationId,
                    recipientId: userId,
                    recipientType: "User"
                },
                {
                    isRead: true
                },
                {
                    new: true
                }
            )

        if (!notification) {
            return res.json({
                success: false,
                message: "Notification not found"
            })
        }

        res.json({
            success: true,
            message: "Notification marked as read"
        })

    } catch (error) {

        console.log(error)

        res.json({
            success: false,
            message: error.message
        })
    }
}


export {
    getUserNotifications,
    markUserNotificationRead
}