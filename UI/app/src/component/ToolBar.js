import React, { useState } from 'react';
import { List, Input, InputNumber, Form, Button, Card, ColorPicker,Upload, Slider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// 示例对象列表


const Toolbar = (props) => {
  var changeName = props.changeName
  var changePosition = props.changePosition
  var changeRotation = props.changeRotation
  var changeScale = props.changeScale
  var changeColor = props.changeColor
  var changeTexture = props.changeTexture
  var changeMaterial = props.changeMaterial
  var deleteObject = props.deleteObject
var zoomToObject = props.zoomToObject
  var objectsList = props.objects

  const [selectedObject, setSelectedObject] = useState(objectsList[0]);
  // 点击按钮时更新选中的对象
  const handleButtonClick = (object) => {
    setSelectedObject(object);
  };
  const handleButtonZoom = (object) => {
    // props.addEvent(object)
    setSelectedObject(object);
    zoomToObject(object)
    // console.log("handleButtonZoom",object)
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
    changeColor(selectedObject, color)
  };
  const onChangeName = (name) => {
    changeName(selectedObject, name)
  };
  const clickDelete = () => {
    deleteObject(selectedObject)
  }
  const onChangeTexture = (texture) => {
    texture.preventDefault()
    changeTexture(selectedObject, texture)
  }
  const onChangeMaterial = (object, propName, axis, value) => {
    var num = 0
    if (axis === 'x') {
      num = 0
    } else if (axis === 'y') {
      num = 1
    } else if (axis === 'z') {
      num = 2
    }
    var material = object.materials
    if(propName === 'shininess'){
      material[propName] = value
    }else if(propName === 'strength'){
      material[propName] = value
    }else{
      material[propName][num] = value
    }
    changeMaterial(object, material)
  }


  return (
    <Card bordered style={{ margin: 10 }} size = "small">
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
                <div>&nbsp;&nbsp;&nbsp;</div>
                <Button
                  block
                  size="small"
                  type={selectedObject.id === item.id ? 'primary' : 'default'}
                  onClick={() => handleButtonZoom(item)}
                >
                  {"zoom"}
                </Button>
              </List.Item>
            )}
          />
        </div>
        </Card >
      <Card title="对象详情" bordered style={{ marginTop: 10 }} size="small">
        <Form layout="horizontal" colon={false} size="small" >
          <Form.Item label="名称">
            <Input
              value={selectedObject.name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="请输入名称"
            />
          </Form.Item>
          
          <Form.Item label="位置">
            <Input.Group compact>
                <InputNumber
                addonBefore="X"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.position[0]}
                  onChange={(value) => onChangePosition('position', 'x', value)}
                  placeholder="X"
                />
                <InputNumber
                addonBefore="Y"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.position[1]}
                  onChange={(value) => onChangePosition('position', 'y', value)}
                  placeholder="Y"
                />

                <InputNumber
                addonBefore="Z"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.position[2]}
                  onChange={(value) => onChangePosition('position', 'z', value)}
                  placeholder="Z"
                />

            </Input.Group>
          </Form.Item>
          <Form.Item label="旋转">
            <Input.Group compact>

                <InputNumber
                addonBefore="X"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.rotation[0]}
                  onChange={(value) => onChangeRotation('rotation', 'x', value)}
                  max={360}
                  min={0}
                  placeholder="X"
                />


                <InputNumber
                addonBefore="Y"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.rotation[1]}
                  onChange={(value) => onChangeRotation('rotation', 'y', value)}
                  placeholder="Y"
                  max={360}
                  min={0}
                />


                <InputNumber
                addonBefore="Z"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.rotation[2]}
                  onChange={(value) => onChangeRotation('rotation', 'z', value)}
                  placeholder="Z"
                  max={360}
                  min={0}
                />

            </Input.Group>
          </Form.Item>
          <Form.Item label="缩放">
            <Input.Group compact>

                <InputNumber
                addonBefore="X"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.scale[0]}
                  onChange={(value) => onChangeScale('scale', 'x', value)}
                  placeholder="X"
                  max={10}
                  min={0.1}
                  step={0.05}
                />


                <InputNumber
                addonBefore="Y"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.scale[1]}
                  onChange={(value) => onChangeScale('scale', 'y', value)}
                  placeholder="Y"
                  max={10}
                  min={0.1}
                  step={0.05}
                />


                <InputNumber
                addonBefore="Z"
                style={{ width: 100, margin:'0 10px' }}
                  value={selectedObject.scale[2]}
                  onChange={(value) => onChangeScale('scale', 'z', value)}
                  placeholder="Z"
                  max={10}
                  min={0.1}
                  step={0.05}
                />

            </Input.Group>
          </Form.Item>
          <Form.Item label="颜色">
            <ColorPicker 
              showText

              onChange={onChangeColor}
            />
          </Form.Item>
          <Form.Item label="贴图">
          <input type="text" style={{display: 'none'}} />
          <input
            type='file'
            onChange={onChangeTexture}
            placeholder="请输入贴图"
          />
          </Form.Item>
          {/* <Form.Item label="材质"> */}
         <div id='M_Ambient'>
              <Form.Item label="环境光">
          <Input.Group compact>
                <Form.Item label="R" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.ambient[0]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'ambient', 'x', value)}
                    placeholder="X"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
                <Form.Item label="G" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.ambient[1]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'ambient', 'y', value)}
                    placeholder="Y"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
                <Form.Item label="B" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.ambient[2]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'ambient', 'z', value)}
                    placeholder="Z"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
              </Input.Group>
              </Form.Item>
         </div>
          <div id='M_Diffuse'>
                <Form.Item label="漫反射">
          <Input.Group compact>
                <Form.Item label="R" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.diffuse[0]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'diffuse', 'x', value)}
                    placeholder="X"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
                <Form.Item label="G" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.diffuse[1]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'diffuse', 'y', value)}
                    placeholder="Y"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
                <Form.Item label="B" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.diffuse[2]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'diffuse', 'z', value)}
                    placeholder="Z"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
              </Input.Group>
              </Form.Item>
          </div>
          <div id='M_Specular'>
                <Form.Item label="镜面反射">
          <Input.Group compact>
                <Form.Item label="R" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.specular[0]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'specular', 'x', value)}
                    placeholder="X"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
                <Form.Item label="G" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.specular[1]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'specular', 'y', value)}
                    placeholder="Y"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
                <Form.Item label="B" style={{ marginBottom: 0 }}>
                  <InputNumber
                    value={selectedObject.materials.specular[2]}
                    onChange={(value) => onChangeMaterial(selectedObject, 'specular', 'z', value)}
                    placeholder="Z"
                    max={1}
                    min={0}
                    step={0.05}
                  />
                </Form.Item>
              </Input.Group>
              </Form.Item>
          </div>
          <div id='M_Shininess'>
                <Form.Item label="高光系数">
                  <Slider 
                    value={selectedObject.materials.shininess}
                    onChange={(value) => onChangeMaterial(selectedObject, 'shininess', 'x', value)}
                    max={100}
                    min={0}
                    step={1}
                  />
                </Form.Item>
          </div>
          <div id='M_Strength'>
                <Form.Item label="高光强度">
                  <Slider
                    value={selectedObject.materials.strength}
                    onChange={(value) => onChangeMaterial(selectedObject, 'strength', 'x', value)}
                    max={10}
                    min={0}
                    step={0.1}
                  />
                </Form.Item>
          </div>

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
