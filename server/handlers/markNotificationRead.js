import Notification from '../models/Notification.js';

const markNotificationRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId, markAllRead } = req.body;
        
        if (markAllRead) {
            // Mark all notifications as read
            await Notification.updateMany(
                { userId, isRead: false },
                { isRead: true }
            );
            
            res.status(200).json({ message: 'All notifications marked as read' });
        } else if (notificationId) {
            // Mark specific notification as read
            const notification = await Notification.findById(notificationId);
            
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            
            // Ensure the notification belongs to the current user
            if (notification.userId !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            
            notification.isRead = true;
            await notification.save();
            
            res.status(200).json({ message: 'Notification marked as read' });
        } else {
            res.status(400).json({ message: 'Invalid request. Provide notificationId or markAllRead parameter' });
        }
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ message: 'Failed to update notification' });
    }
};

export default markNotificationRead;
