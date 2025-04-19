import Notification from '../models/Notification.js';

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get notifications for the current user, sorted by most recent first
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50) // Limit to 50 most recent notifications
            .exec();
        
        // Get unread count
        const unreadCount = await Notification.countDocuments({ 
            userId, 
            isRead: false 
        }).exec();
        
        res.status(200).json({
            notifications,
            unreadCount
        });
    } catch (err) {
        console.error('Error getting notifications:', err);
        res.status(500).json({ message: 'Failed to retrieve notifications' });
    }
};

export default getNotifications;
