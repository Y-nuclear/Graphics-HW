import React, { useState } from 'react';
import { List, Input, InputNumber, Form, Button, Card,Select, Slider } from 'antd';
import { saveAs } from 'file-saver';
// 示例对象列表


const Toolbar = (props) => {
  var changeName = props.changeName
  var changePosition = props.changePosition
  var changeRotation = props.changeRotation
  var changeScale = props.changeScale
  var changeTexture = props.changeTexture
  var changeMaterial = props.changeMaterial
  var deleteObject = props.deleteObject
var zoomToObject = props.zoomToObject
  var objectsList = props.objects

  const [selectedObject, setSelectedObject] = useState(objectsList[0]);
  var files = require.context('../../public', true, /\.png$/);
  var Images = files.keys().map(key => key.slice(2));
  // console.log(Images)
  var options_texture = Images.map((item) => {
    return {label: item, value: item};
  });
  const [textureOptions, setTextureOptions] = useState(options_texture);
  const [texture, setTexture] = useState("");

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
  const onChangeName = (name) => {
    changeName(selectedObject, name)
  };
  const clickDelete = () => {
    deleteObject(selectedObject)
    if(objectsList.length>0){
      setSelectedObject(objectsList[0]);
    }

  }
  const onChangeTexture = (texture) => {
    setTexture(texture)
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
    <Card bordered style={{ margin: 10,height: "100%"}} size = "small">
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
                  style={{backgroundColor: "#87CEFA",width: "20%"}}
                >
                  {"zoom"}
                </Button>
              </List.Item>
            )}
          />
        </div>
        </Card >
      <Card title="对象详情" bordered style={{ marginTop: 10 }} size="small">
        <div style={{overflowY:'auto',height:'475px' }}>
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
          <Form.Item label="贴图">
          <Select defaultValue="" 
          style={{ width: '100%' }} 
          options={textureOptions}
          value={texture}
          onChange={(value) => onChangeTexture(value)}
          ></Select>
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
          {/* 如果object.type == 'NURBSObject'则显示控制点编辑界面*/}
            <ControlPointsEditor object={selectedObject} 
            onChangeControlPoint={props.onChangeControlPoint}
            onChangeWeight={props.onChangeWeight}
            onChangeKnot={props.onChangeKnot}
            />
          
          <SaveOBJFile selectedObject={selectedObject}/>
          <Form.Item>
            <Button danger onClick={clickDelete} block style={{padding: 0}}>
              删除
            </Button>
          </Form.Item>
        </Form>
        </div>
      </Card>
     
    </Card>
  );
};

// 控制点，权重与节点向量编辑器
// 功能为，可以选择控制点和节点向量，修改对应的值
const ControlPointsEditor = (props) => {
  if (props.object.type !== 'NURBSObject') {
    return null;
  }
  return (
    <Card title="控制点编辑器" bordered style={{ marginTop: 10}} size="small">
      <div style={{overflowY:'auto',height:'100px' }}>
      <Form layout="horizontal" colon={false} size="small">
        <Form.Item label="控制点索引">
          <Input.Group compact>
            <InputNumber
            addonBefore="U"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.control_u}
              onChange={(value) => {props.object.control_u = value}}
              placeholder="U"
              min={0}
              max={props.object.uControlNum-1}
            />
            <InputNumber
            addonBefore="V"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.control_v}
              onChange={(value) => {props.object.control_v = value}}
              placeholder="V"
              min={0}
              max={props.object.vControlNum-1}
            />
          </Input.Group>
        </Form.Item>

        <Form.Item label="控制点">
          <Input.Group compact>
            <InputNumber
            addonBefore="X"
              style={{ width: 60, margin: '0 10px' }}
              value={props.object.ControlLines[props.object.control_u][props.object.control_v][0]}
              onChange={(value) => props.onChangeControlPoint(props.object,'x', value, props.object.control_u, props.object.control_v)}
              placeholder="X"
            />
            <InputNumber
            addonBefore="Y"
              style={{ width: 60, margin: '0 10px' }}
              value={props.object.ControlLines[props.object.control_u][props.object.control_v][1]}
              onChange={(value) => props.onChangeControlPoint(props.object,'y', value, props.object.control_u, props.object.control_v)}
              placeholder="Y"
            />
            <InputNumber
            addonBefore="Z"
              style={{ width: 60, margin: '0 10px' }}
              value={props.object.ControlLines[props.object.control_u][props.object.control_v][2]}
              onChange={(value) => props.onChangeControlPoint(props.object,'z', value, props.object.control_u, props.object.control_v)}
              placeholder="Z"
            />
          </Input.Group>
        </Form.Item>
        <Form.Item label="u方向权重">
          <Input.Group compact>
            <InputNumber
              addonBefore="u"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.weight_u}
              onChange={(value) => {props.object.weight_u = value}}
              placeholder="u"
              min={0}
              max={props.object.uweights.length-1}
            />
            <InputNumber
              addonBefore="W"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.uweights[props.object.weight_u]}
              onChange={(value) => props.onChangeWeight(props.object,'u',value, props.object.weight_u)}
              placeholder="W"
            />
          </Input.Group>
        </Form.Item>
        <Form.Item label="v方向权重">
          <Input.Group compact>
            <InputNumber
              addonBefore="v"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.weight_v}
              onChange={(value) => {props.object.weight_v = value}}
              placeholder="v"
              max={props.object.vweights.length-1}
              min={0}
            />
            <InputNumber
              addonBefore="W"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.vweights[props.object.weight_v]}
              onChange={(value) => props.onChangeWeight(props.object,'v',value, props.object.weight_v)}
              placeholder="W"
            />
          </Input.Group>
        </Form.Item>
        <Form.Item label="u方向节点向量">
          <Input.Group compact>
            <InputNumber
              addonBefore="u"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.knot_u}
              onChange={(value) => {props.object.knot_u = value}}
              placeholder="u"
              min={0}
              max={props.object.uknots.length-1}
            />
            <InputNumber
              addonBefore="U"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.uknots[props.object.knot_u]}
              onChange={(value) => props.onChangeKnot(props.object,'u',value, props.object.knot_u)}
              placeholder="U"
            />
          </Input.Group>
        </Form.Item>
        <Form.Item label="v方向节点向量">
          <Input.Group compact>
            <InputNumber
              addonBefore="v"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.knot_v}
              onChange={(value) => {props.object.knot_v = value}}
              placeholder="v"
              min={0}
              max={props.object.vknots.length-1}
            />
            <InputNumber
              addonBefore="V"
              style={{ width: 100, margin: '0 10px' }}
              value={props.object.vknots[props.object.knot_v]}
              onChange={(value) => props.onChangeKnot(props.object,'v',value, props.object.knot_v)}
              placeholder="V"
            />
          </Input.Group>
        </Form.Item>
      </Form>
      </div>
    </Card>
  );
}

const SaveOBJFile = (props) => {
  var object = props.selectedObject
  const [OBJFileName, setOBJFileName] = useState('SaveObj.obj');
  return (
    <Form.Item label="保存为OBJ文件">
      <Input.Group compact>
        <Input
          style={{ width: 200, margin: '0 10px' }}
          value= {OBJFileName}
          onChange={(value) => setOBJFileName(value.target.value)}
          placeholder="请输入文件名"
        />
        <Button
          style={{ width: 50, margin: '0 10px' }}
          onClick={() => {
           if(OBJFileName === ''){
             alert("请输入文件名")
             return
           }
           if(OBJFileName.split(".")[1] !== 'obj'){
             alert("请输入正确的文件名")
             return
           }
           var objtext = object.saveOBJ()
            var blob = new Blob([objtext], {type: "text/plain;charset=utf-8"});
            var filename = OBJFileName;
            saveAs(blob, filename);
          }}
        >
          保存
        </Button>
      </Input.Group>
    </Form.Item>
  );
}
export default Toolbar;
