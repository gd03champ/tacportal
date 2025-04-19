import React, { useState, useEffect } from 'react';
import { 
  Badge, 
  Dropdown, 
  List, 
  Button, 
  Empty, 
  Spin, 
  Space, 
  Typography 
} from 'antd';
import { 
  BellOutlined, 
  CheckOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined, 
  CheckCircleOutlined, 
  WarningOutlined, 
  CloseCircleOutlined
} from '@ant-design/icons';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../handlers/notificationHandlers';

const { Text } = Typography;

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  // Fetch notifications on initial load and when dropdown is opened
  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  // Fetch notifications every 30 seconds when logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationRead(notification._id);
        
        // Update local state
        setNotifications(prevNotifications =>
          prevNotifications.map(n => 
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // You can add logic here to navigate to the related content
      // if (notification.relatedId) { ... }
      
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const notificationContent = (
    <div style={{ width: 300, maxHeight: '80vh', overflow: 'auto' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>Notifications</Text>
        {unreadCount > 0 && (
          <Button 
            type="text" 
            size="small" 
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>
      <Spin spinning={loading}>
        {notifications.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="No notifications" 
            style={{ padding: '20px 0' }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={item => (
              <List.Item 
                className={!item.isRead ? 'notification-unread' : ''}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: !item.isRead ? '#f0f7ff' : 'transparent',
                  borderBottom: '1px solid #f0f0f0'
                }}
                onClick={() => handleNotificationClick(item)}
              >
                <List.Item.Meta
                  avatar={getNotificationIcon(item.type)}
                  title={item.title}
                  description={
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </Text>
                      <div>{item.message}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Spin>
    </div>
  );

  return (
    <Dropdown
      overlay={notificationContent}
      trigger={['click']}
      onVisibleChange={setVisible}
      visible={visible}
      placement="bottomRight"
    >
      <Badge count={unreadCount} style={{ cursor: 'pointer' }}>
        <BellOutlined style={{ fontSize: '18px', padding: '4px', cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationCenter;
