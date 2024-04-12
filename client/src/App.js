import './App.css';
import React, { useState, useEffect } from 'react';

// Handlers
import { logout } from './handlers/authHandlers';
import { getUserInfo } from './handlers/authHandlers';

// Pages
import { Home } from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

import Dashboard from './pages/dashboard';
import ApplyTac from './pages/applyTac';
import Reviews from './pages/reviews';

// UI Elements
import { 
  UserOutlined, HomeOutlined, AppstoreOutlined, FileAddOutlined, 
  LogoutOutlined, LoginOutlined, UserAddOutlined, EditOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Breadcrumb, Avatar, Button, Modal, message} from 'antd';
const { Header, Content, Footer, Sider } = Layout;



const App = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const mainItems = [
    {
      key: '1',
      icon: React.createElement(HomeOutlined),
      label: 'Home',
      onClick: () => setScreen("home"),
    },
    {
      key: '2',
      icon: React.createElement(AppstoreOutlined),
      label: 'Dashboard',
      onClick: () => setScreen("dashboard"),
    },
    {
      key: '3',
      icon: React.createElement(FileAddOutlined),
      label: 'Apply Tac',
      onClick: () => setScreen("applytac"),
    },
    {
      key: '4',
      icon: React.createElement(LogoutOutlined),
      label: 'Logout',
      onClick: () => {
        Modal.confirm({
          title: 'Logout',
          content: 'Are you sure you want to logout?',
          onOk: () => {
            logout();
            setLoggedIn(false);
            setMenuItems(authItems);
            setName('');
            setScreen("home");
            message.success("Logged out succesfully!");
          },
        });
      },
    },
  ];

  const adminItems = [
    {
      key: '1',
      icon: React.createElement(HomeOutlined),
      label: 'Home',
      onClick: () => setScreen("home"),
    },
    {
      key: '2',
      icon: React.createElement(AppstoreOutlined),
      label: 'Dashboard',
      onClick: () => setScreen("dashboard"),
    },
    {
      key: '3',
      icon: React.createElement(EditOutlined),
      label: 'Review',
      onClick: () => setScreen("reviews"),
    },
    {
      key: '4',
      icon: React.createElement(LogoutOutlined),
      label: 'Logout',
      onClick: () => {
        Modal.confirm({
          title: 'Logout',
          content: 'Are you sure you want to logout?',
          onOk: () => {
            logout();
            setLoggedIn(false);
            setMenuItems(authItems);
            setName('');
            setScreen("home");
            message.success("Logged out succesfully!");
          },
        });
      },
    },
  ];

  const authItems = [
    {
      key: '1',
      icon: React.createElement(HomeOutlined),
      label: 'Home',
      onClick: () => setScreen("home"),
    },
    {
      key: '2',
      icon: React.createElement(LoginOutlined),
      label: 'Login',
      onClick: () => setScreen("login"),
    },
    {
      key: '3',
      icon: React.createElement(UserAddOutlined),
      label: 'Register',
      onClick: () => setScreen("register"),
    },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState(authItems);
  const [screen, setScreen] = useState("home");

  //auth useStates
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(''); //will be set if found in local storage
  const [email, setEmail] = useState('');             //will be set after authetication
  const [name, setName] = useState('');               //will be set after authetication
  const [userRole, setUserRole] = useState('');       //will be set after authetication
  const [userRoll, setUserRoll] = useState('');       //will be set after authetication

  //auth check useEffect
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log("token found: " + token);
      setLoggedIn(true);
      setAccessToken(token);

      // get and store userInfo using access token
      getUserInfo(token)
        .then(userInfo => {
          console.log(userInfo.data);
          setEmail(userInfo.email);
          setUserRole(userInfo.role);
          setUserRoll(userInfo.rollno);
          setName(userInfo.name);
          setMenuItems( userInfo.role === 'student' ? mainItems : adminItems);
        })
        .catch(error => {
          console.log(error);
        });

      setScreen("home");
    }
    console.log("isLogged: " + loggedIn);
  }, [loggedIn]);

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          id="logo"
          className="logo"
          style={{
            height: '32px',
            margin: '16px',
            background: '#333',
            borderRadius: '6px',
            marginBottom: '32px',
          }}
        ></div>

        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? '80px' :'200px',
        }}
      >

        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div id='headText'>
            <h1 style={{ margin: '0 0 0 24px' }}>TAC Portal</h1>
          </div>
          <div>
            {loggedIn ? (
              <>
                <Button type="dashed" id="userAvatar" style={{ margin: '16px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ margin: '10px' }}>{name}</span>
                  <Avatar size="small" icon={<UserOutlined />} />
                </Button>
              </>
            ) : (
              <div>
                <Button
                  type="primary"
                  style={{ margin: '16px' }}
                  onClick={() => setScreen("login")}
                >
                  Login
                </Button>
                <Button
                  type="primary"
                  style={{ margin: '16px' }}
                  onClick={() => setScreen("register")}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </Header>

        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>tac portal</Breadcrumb.Item>
            {loggedIn && <Breadcrumb.Item>{userRole}</Breadcrumb.Item>}
            <Breadcrumb.Item>{screen}</Breadcrumb.Item>
          </Breadcrumb>

          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {screen === "home" && <Home name={name} />}

            {screen === "login" && <Login setLoggedIn={setLoggedIn} />}

            {screen === "register" && <Register setLoggedIn={setLoggedIn} />}

            {screen === "dashboard" && <Dashboard userRole={userRole} />}

            {screen === "applytac" && <ApplyTac userRole={userRole} setScreen={setScreen} />}

            {screen === "reviews" && <Reviews />}

          </div>

        </Content>

        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          TAC Portal ©{new Date().getFullYear()} Developed by <a href="https://gd03.me">GD03Champ</a> 🚀
        </Footer>

      </Layout>
    </Layout>
  );
}

export default App;