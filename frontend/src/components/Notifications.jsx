import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"

const Notifications = () => {

    const {
        notifications,
        markNotificationRead
    } = useContext(AppContext)

    const [open, setOpen] = useState(false)

    const unreadCount =
        notifications.filter(
            notification => !notification.isRead
        ).length


    return (
        <div className="relative">

            {/* Bell */}

            <button
                onClick={() => setOpen(!open)}
                className="relative text-xl"
            >
                🔔

                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}

            </button>


            {/* Dropdown */}

            {open && (

                <div className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-lg z-50">

                    <div className="p-4 border-b">

                        <p className="font-semibold">
                            Notifications
                        </p>

                    </div>


                    <div className="max-h-96 overflow-y-auto">

                        {notifications.length === 0 ? (

                            <p className="text-sm text-gray-500 p-5 text-center">
                                No notifications
                            </p>

                        ) : (

                            notifications.map(notification => (

                                <div
                                    key={notification._id}
                                    onClick={() =>
                                        markNotificationRead(
                                            notification._id
                                        )
                                    }
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                        !notification.isRead
                                            ? "bg-blue-50"
                                            : ""
                                    }`}
                                >

                                    <div className="flex gap-3">

                                        {!notification.isRead && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                        )}

                                        <div>

                                            <p className="font-medium text-sm">
                                                {notification.title}
                                            </p>

                                            <p className="text-xs text-gray-600 mt-1">
                                                {notification.message}
                                            </p>

                                            <p className="text-[10px] text-gray-400 mt-2">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            )}

        </div>
    )
}

export default Notifications