import React, { useState } from 'react';
import { List, Input, InputNumber, Form, Button, Card, ColorPicker } from 'antd';

// 示例对象列表


const Toolbar = (props) => {
  var changePosition = props.changePosition
  var changeRotation = props.changeRotation
  var changeScale = props.changeScale
  var changeColor = props.changeColor
  var changeTexture = props.changeTexture
  var changeMaterial = props.changeMaterial
  var deleteObject = props.deleteObject

  var objectsList = props.objects

  const [selectedObject, setSelectedObject] = useState(objectsList[0]);
  // 点击按钮时更新选中的对象
  const handleButtonClick = (object) => {
    setSelectedObject(object);
    console.log(object);
  };

  // 输入值变化时更新对象的属性

  const onChangePosition = (propName, axis, value) => {
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
  };
  const onChangeRotation = (propName, axis, value) => {
    let cal = ()=>{
      switch (axis) {
        case 'x':
          return [value, selectedObject.rotation[1], selectedObject.rotation[2]];
        case 'y':
          return [selectedObject.rotation[0], value, selectedObject.rotation[2]];
        case 'z':
          return [selectedObject.rotation[0], selectedObject.rotation[1], value];
        default:
          return selectedObject.rotation;
      }
    }
    let rotation = cal()
    changeRotation(selectedObject, rotation[0], rotation[1], rotation[2])
  };
  const onChangeScale = (propName, axis, value) => {
    if(value<=0){
      value = 0.1
    }
    let cal = ()=>{
      switch (axis) {
        case 'x':
          return [value, selectedObject.scale[1], selectedObject.scale[2]];
        case 'y':
          return [selectedObject.scale[0], value, selectedObject.scale[2]];
        case 'z':
          return [selectedObject.scale[0], selectedObject.scale[1], value];
        default:
          return selectedObject.scale;
      }
    }
    let scale = cal()
    changeScale(selectedObject, scale[0], scale[1], scale[2])
  };
  const onChangeColor = (color) => {
    console.log(color)
    changeColor(selectedObject, color)
  };

  const clickDelete = () => {
    deleteObject(selectedObject)
  }


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
              onChange={(e) => onChangePosition('name', 'name', e.target.value)}
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
                  onChange={(value) => onChangeRotation('rotation', 'x', value)}
                  max={360}
                  min={0}
                  placeholder="X"
                />
              </Form.Item>
              <Form.Item label="Y" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.rotation[1]}
                  onChange={(value) => onChangeRotation('rotation', 'y', value)}
                  placeholder="Y"
                  max={360}
                  min={0}
                />
              </Form.Item>
              <Form.Item label="Z" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.rotation[2]}
                  onChange={(value) => onChangeRotation('rotation', 'z', value)}
                  placeholder="Z"
                  max={360}
                  min={0}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="缩放">
            <Input.Group compact>
              <Form.Item label="X" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.scale[0]}
                  onChange={(value) => onChangeScale('scale', 'x', value)}
                  placeholder="X"
                  max={10}
                  min={0.1}
                  step={0.05}
                />
              </Form.Item>
              <Form.Item label="Y" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.scale[1]}
                  onChange={(value) => onChangeScale('scale', 'y', value)}
                  placeholder="Y"
                  max={10}
                  min={0.1}
                  step={0.05}
                />
              </Form.Item>
              <Form.Item label="Z" style={{ marginBottom: 0 }}>
                <InputNumber
                  value={selectedObject.scale[2]}
                  onChange={(value) => onChangeScale('scale', 'z', value)}
                  placeholder="Z"
                  max={10}
                  min={0.1}
                  step={0.05}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="颜色">
            <ColorPicker 
              showText

              onChange={onChangeColor}
            />
          </Form.Item>
          <Form.Item label="贴图">
            <Input
              value={selectedObject.texture}
              onChange={(e) => onChangePosition('texture', 'texture', e.target.value)}
              placeholder="请输入贴图"
            />
          </Form.Item>
          <Form.Item label="材质">
            <Input
              value={selectedObject.texture}
              onChange={(e) => onChangePosition('materials', 'materials', e.target.value)}
              placeholder="请输入材质"
            />
          </Form.Item>
          <Form.Item>
            <Button danger onClick={clickDelete}>
              删除
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Card>
  );
};

export default Toolbar;
