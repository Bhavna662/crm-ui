import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  PieChartOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { useAuth } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/app/dashboard">Dashboard</Link> },
  { key: 'customers',  icon: <UserOutlined />,     label: <Link to="/app/customers">Customers</Link> },
  { key: 'logs',       icon: <PieChartOutlined />, label: <Link to="/app/logs">Calls & Logs</Link> },
  { key: 'enquiries',  icon: <VideoCameraOutlined />, label: <Link to="/app/enquiries">Enquiries</Link> },
];

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userMenu = (
    <Menu>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <div className="text-white text-center py-4 text-lg font-bold">CRM</div>
        <Menu theme="dark" mode="inline" selectedKeys={[window.location.pathname.split('/').pop()]} items={menuItems} />
      </Sider>

      <Layout>
        <Header className="flex justify-between items-center bg-white px-4 shadow-sm">
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          {user && (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar size="large" icon={<UserOutlined />} src={user.avatar || null} />
                <span className="ml-2">{user.fullname || user.email}</span>
              </div>
            </Dropdown>
          )}
        </Header>

        <Content className="m-4 p-4 bg-white rounded">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
