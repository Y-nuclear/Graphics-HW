import React, { useState } from 'react';
import { List, Input, InputNumber, Form, Button, Card } from 'antd';

// 示例对象列表
const objectsList = [
  { id: 1, name: '对象1', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  { id: 2, name: '对象2', position: { x: 1, y: 1, z: 1 }, rotation: { x: 1, y: 1, z: 1 } },
  // ...根据需要添加更多对象
];

const Toolbar = () => {
  const [selectedObject, setSelectedObject] = useState(objectsList[0]);

  // 点击按钮时更新选中的对象
  const handleButtonClick = (object) => {
    setSelectedObject(object);
  };

  // 输入值变化时更新对象的属性
  const handleInputChange = (propName, axis, value) => {
    setSelectedObject({
      ...selectedObject,
      [propName]: { ...selectedObject[propName], [axis]: value },
    });
  };

  return (
    <Card bordered style={{ margin: 10 }}>
      <List
        header={<div>对象列表</div>}
        bordered
        dataSource={objectsList}
        renderItem={item => (
          <List.Item>
            <Button
              block
              type={selectedObject.id === item.id ? 'primary' : 'default'}
              onClick={() => handleButtonClick(item)}
            >
              {item.name}
            </Button>
          </List.Item>
        )}
      />
      <Card bordered style={{ marginTop: 10 }}>
        <Form layout="horizontal">
          <Form.Item label="名称">
            <Input
              value={selectedObject.name}
              onChange={(e) => handleInputChange('name', 'name', e.target.value)}
              placeholder="请输入名称"
            />
          </Form.Item>
          <Form.Item label="位置">
            <Input.Group compact>
              <Form.Item label="X" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.position.x}
                  onChange={(value) => handleInputChange('position', 'x', value)}
                  placeholder="X"
                />
              </Form.Item>
              <Form.Item label="Y" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.position.y}
                  onChange={(value) => handleInputChange('position', 'y', value)}
                  placeholder="Y"
                />
              </Form.Item>
              <Form.Item label="Z" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.position.z}
                  onChange={(value) => handleInputChange('position', 'z', value)}
                  placeholder="Z"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="旋转">
            <Input.Group compact>
              <Form.Item label="X" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.rotation.x}
                  onChange={(value) => handleInputChange('rotation', 'x', value)}
                  placeholder="X"
                />
              </Form.Item>
              <Form.Item label="Y" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.rotation.y}
                  onChange={(value) => handleInputChange('rotation', 'y', value)}
                  placeholder="Y"
                />
              </Form.Item>
              <Form.Item label="Z" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.rotation.z}
                  onChange={(value) => handleInputChange('rotation', 'z', value)}
                  placeholder="Z"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Card>
    </Card>
  );
};

export default Toolbar;
