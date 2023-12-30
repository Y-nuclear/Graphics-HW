import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
    {
      label: 'File',
      key: 'file',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'New',
              key: 'new',
            },
            {
              label: 'Open',
              key: 'open',
            },
            // ... 更多 File 子菜单项
          ],
        },
      ],
    },
    {
      label: 'Edit',
      key: 'edit',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Undo',
              key: 'undo',
            },
            {
              label: 'Redo',
              key: 'redo',
            },
            // ... 更多 Edit 子菜单项
          ],
        },
      ],
    },
    {
      label: 'Add',
      key: 'add',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Triangle',
              key: 'Triangle',
            },
            {
              label: 'Cube',
              key: 'Square',
            },
            {
              label: 'Circle',
              key: 'Circle',
            },
            {
              label: 'Sphere',
              key: 'Sphere',
            },
            {
              label: 'Rectangle',
              key: 'Rectangle',
            },
            {
              label: 'Ring',
              key: 'Ring',
            },
            {
              label: 'Cone',
              key: 'Cone',
            },
            {
              label: 'Cylinder',
              key: 'Cylinder',
            },
            {
              label: 'Pyramid',
              key: 'Pyramid',
            },
            {
              label: 'Prism',
              key: 'Prism',
            },
            {
              label: 'Prismoid',
              key: 'Prismoid',
            },
          ],
        },
      ],
    },
    {
      label: 'Play',
      key: 'play',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Start',
              key: 'start',
            },
            {
              label: 'Pause',
              key: 'pause',
            },
            // ... 更多 Play 子菜单项
          ],
        },
      ],
    },
    {
      label: 'Examples',
      key: 'examples',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Example 1',
              key: 'example1',
            },
            {
              label: 'Example 2',
              key: 'example2',
            },
            // ... 更多 Examples 子菜单项
          ],
        },
      ],
    },
    {
      label: 'View',
      key: 'view',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Zoom In',
              key: 'zoomIn',
            },
            {
              label: 'Zoom Out',
              key: 'zoomOut',
            },
            // ... 更多 View 子菜单项
          ],
        },
      ],
    },
    {
      label: 'Help',
      key: 'help',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Documentation',
              key: 'documentation',
            },
            {
              label: 'About',
              key: 'about',
            },
            // ... 更多 Help 子菜单项
          ],
        },
      ],
    },
  ];
  
const NavBar = (props) => {
  console.log(props);
  var CreateTriangle = props.createTriangle;
  var CreateSquare = props.createSquare;
  var CreateCircle = props.createCircle;
  
  const onClick = (e) => {
    console.log('click ', e);
    switch(e.key){
      case 'Triangle':
        console.log(CreateTriangle);
        CreateTriangle();
        break;
      case 'Square':
        CreateSquare();
        break;
      case 'Circle':
        CreateCircle();
        break;
      default:
        break;
    }
  };
  return <Menu onClick={onClick} mode="horizontal" items={items} />;
};
export default NavBar;