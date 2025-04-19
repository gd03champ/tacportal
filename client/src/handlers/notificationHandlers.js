import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/`,
});

const getNotifications = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('No access token found');
    }

    const res = await api.post('/getNotifications', {}, { 
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

const markNotificationRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('No access token found');
    }

    const res = await api.post('/markNotificationRead', 
      { notificationId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return res.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

const markAllNotificationsRead = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('No access token found');
    }

    const res = await api.post('/markNotificationRead', 
      { markAllRead: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return res.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export { getNotifications, markNotificationRead, markAllNotificationsRead };
