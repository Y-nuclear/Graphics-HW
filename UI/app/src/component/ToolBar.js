import React, { useState } from 'react';
import { List, Input, InputNumber, Form, Button, Card, ColorPicker } from 'antd';

// 示例对象列表


const Toolbar = (objectsList) => {
  var changePosition = objectsList.changePosition


  objectsList = objectsList.objects

  const [selectedObject, setSelectedObject] = useState(objectsList[0]);
  // 点击按钮时更新选中的对象
  const handleButtonClick = (object) => {
    setSelectedObject(object);
    console.log(object);
  };

  // 输入值变化时更新对象的属性
  const handleInputChange = (propName, axis, value) => {
    setSelectedObject({
      ...selectedObject,
      [propName]: { ...selectedObject[propName], [axis]: value },
    });
  };
  const onChangePosition = (propName, axis, value) => {
    console.log('value: ', value);
    let cal = ()=>{
      switch (axis) {
        case 'x':
          return [value, selectedObject.position[1], selectedObject.position[2]];
        case 'y':
          return [selectedObject.position[0], value, selectedObject.position[2]];
        case 'z':
          return [selectedObject.position[0], selectedObject.position[1], value];
        default:
          return selectedObject.position;
      }
    }
    let position = cal()
    changePosition(selectedObject, position[0], position[1], position[2])
    console.log('position: ', selectedObject.position);
    console.log('selectedObject: ', selectedObject);
  };
  const handleDelete = (object) => {
    //从Objectlists中删除当前的object

    setSelectedObject(object);

  }

  return (
    <Card bordered style={{ margin: 10 }}>
      <Card title="对象列表" bordered style={{ margin: 0 }} size="small">
        <div style={{ height: '100px', overflow: 'auto' }}>
          <List
          size="small"
            dataSource={objectsList}
            renderItem={item => (
              <List.Item>
                <Button
                  block
                  size="small"
                  type={selectedObject.id === item.id ? 'primary' : 'default'}
                  onClick={() => handleButtonClick(item)}
                >
                  {item.name}
                </Button>
              </List.Item>
            )}
          />
        </div>
        </Card >
      <Card title="对象详情" bordered style={{ marginTop: 20 }} size="small">
        <Form layout="horizontal" colon={false} size="small" >
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
                  value={selectedObject.position[0]}
                  onChange={(value) => onChangePosition('position', 'x', value)}
                  placeholder="X"
                />
              </Form.Item>
              <Form.Item label="Y" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.position[1]}
                  onChange={(value) => onChangePosition('position', 'y', value)}
                  placeholder="Y"
                />
              </Form.Item>
              <Form.Item label="Z" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.position[2]}
                  onChange={(value) => onChangePosition('position', 'z', value)}
                  placeholder="Z"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="旋转">
            <Input.Group compact>
              <Form.Item label="X" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.rotation[0]}
                  onChange={(value) => handleInputChange('rotation', 'x', value)}
                  placeholder="X"
                />
              </Form.Item>
              <Form.Item label="Y" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.rotation[1]}
                  onChange={(value) => handleInputChange('rotation', 'y', value)}
                  placeholder="Y"
                />
              </Form.Item>
              <Form.Item label="Z" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.rotation[2]}
                  onChange={(value) => handleInputChange('rotation', 'z', value)}
                  placeholder="Z"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="缩放">
            <Input.Group compact>
              <Form.Item label="X" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.scale[0]}
                  onChange={(value) => onChangePosition('scale', 'x', value)}
                  placeholder="X"
                />
              </Form.Item>
              <Form.Item label="Y" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.scale[1]}
                  onChange={(value) => onChangePosition('scale', 'y', value)}
                  placeholder="Y"
                />
              </Form.Item>
              <Form.Item label="Z" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.scale[2]}
                  onChange={(value) => onChangePosition('scale', 'z', value)}
                  placeholder="Z"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="颜色">
            <ColorPicker 
              showText
              // color={selectedObject.color}
              // onChange={(color) => handleInputChange('color', 'color', color)}
            />
          </Form.Item>
          <Form.Item label="贴图">
            <Input
              value={selectedObject.texture}
              onChange={(e) => handleInputChange('texture', 'texture', e.target.value)}
              placeholder="请输入贴图"
            />
          </Form.Item>
          <Form.Item label="材质">
            <Input
              value={selectedObject.texture}
              onChange={(e) => handleInputChange('materials', 'materials', e.target.value)}
              placeholder="请输入材质"
            />
          </Form.Item>
          <Form.Item>
            <Button danger onClick={() => handleButtonClick(selectedObject)}>
              删除
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Card>
  );
};

export default Toolbar;
