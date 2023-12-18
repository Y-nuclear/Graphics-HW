import React from 'react';
import { Layout, Menu, Card, Button } from 'antd';

const { Header, Content, Footer } = Layout;

function Navbar() {
  return (
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2">Projects</Menu.Item>
        <Menu.Item key="3">About</Menu.Item>
      </Menu>
    </Header>
  );
}

function ProjectPanel() {
  return (
    <Card title="Projects" style={{ width: 300 }}>
      <p>Project 1</p>
      <p>Project 2</p>
      <p>Project 3</p>
    </Card>
  );
}

function StatusPanel() {
  return (
    <Card title="Status" style={{ width: 300 }}>
      <p>Running</p>
      <p>Memory Usage: 80%</p>
    </Card>
  );
}

function FooterComponent() {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Unity-like Website ©2023 Created by Your Name
    </Footer>
  );
}

export { Navbar, ProjectPanel, StatusPanel, FooterComponent };