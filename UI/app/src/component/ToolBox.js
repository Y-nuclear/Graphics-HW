import React from "react";
import { Layout, Menu, Card, Button } from "antd";



class ToolBox extends React.Component {
  render() {
    return (
      <Layout.Sider width={300} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1">
            <a>Home</a>
          </Menu.Item>
          <Menu.Item key="2">
            <a>Projects</a>
          </Menu.Item>
          <Menu.Item key="3">
            <a>About</a>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
    );
  }
}

export default ToolBox;
