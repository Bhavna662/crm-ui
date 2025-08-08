import React from "react";
import { Avatar, Dropdown, Menu } from "antd";
import { useAuth } from "../../context/AuthContext";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const AppHeader = () => {
  const { user, logout } = useAuth();

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <h2>CRM Dashboard</h2>
      {user && (
        <Dropdown overlay={menu} placement="bottomRight">
          <div className="flex items-center cursor-pointer">
            <Avatar
              size="large"
              icon={<UserOutlined />}
              src={user.avatar || null}
              alt={user.fullname || user.email}
            />
            <span className="ml-2">{user.fullname || user.email}</span>
          </div>
        </Dropdown>
      )}
    </div>
  );
};

export default AppHeader;
