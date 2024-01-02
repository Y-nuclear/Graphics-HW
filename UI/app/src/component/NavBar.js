import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Space, InputNumber, Menu, Select } from 'antd';
import { useEffect } from 'react';
// 导入对话框
import { Modal, Button } from 'antd';

const items = [
    {
      label: 'File',
      key: 'file',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Open OBJ File',
              key: 'open',
            },
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
            {
              label: 'NURBS',
              key: 'NURBS',
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
      label: 'Light',
      key: 'Light',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Light Setting',
              key: 'l_set',
            },
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
  var CreateTriangle = props.createTriangle;
  var CreateSquare = props.createSquare;
  var CreateCircle = props.createCircle;

  var files = require.context('../../public', true, /\.obj$/);
  var OBJFiles = files.keys().map(key => key.slice(2));
  var optionsOBJ = OBJFiles.map((item) => {
    return {label: item, value: item};
  });
  const [CircleVisible, setCircleVisible] = useState(false);
  const [CircleRadius, setCircleRadius] = useState(1);

  const [RingVisible, setRingVisible] = useState(false);
  const [RingRadius1, setRingRadius1] = useState(1);
  const [RingRadius2, setRingRadius2] = useState(2);

  const [ConeVisible, setConeVisible] = useState(false);
  const [ConeRadius, setConeRadius] = useState(1);
  const [ConeHeight, setConeHeight] = useState(2);

  const [CylinderVisible, setCylinderVisible] = useState(false);
  const [CylinderRadius, setCylinderRadius] = useState(1);
  const [CylinderHeight, setCylinderHeight] = useState(2);

  const [PyramidVisible, setPyramidVisible] = useState(false);
  const [PyramidDegree, setPyramidDegree] = useState(1);
  const [PyramidHeight, setPyramidHeight] = useState(2);
  const [PyramidRadius, setPyramidRadius] = useState(1);

  const [prismVisible, setPrismVisible] = useState(false);
  const [prismDegree, setPrismDegree] = useState(1);
  const [prismHeight, setPrismHeight] = useState(1);
  const [prismRadius, setPrismRadius] = useState(1);

  const [prismoidVisible, setPrismoidVisible] = useState(false);
  const [prismoidDegree, setPrismoidDegree] = useState(1);
  const [prismoidHeight, setPrismoidHeight] = useState(1);
  const [prismoidRadius, setPrismoidRadius] = useState(1);

  const [NURBSVisible, setNURBSVisible] = useState(false);
  const [NURBSUControlNum, setNURBSUControlNum] = useState(5);
  const [NURBSVControlNum, setNURBSVControlNum] = useState(5);
  const [NURBSDeg, setNURBSDeg] = useState(3);

  const [OBJOpenVisible, setOBJOpenVisible] = useState(false);
  const [OBJFileName, setOBJFileName] = useState('');
  const [OBJFileList, setOBJFileList] = useState(optionsOBJ);

  const [LightVisible, setLightVisible] = useState(false);
  const [LightDirection, setLightDirection] = useState([0,0,0]);
  const [LightColor, setLightColor] = useState([1,1,1]);



  
  const onClick = (e) => {
    switch(e.key){
      case 'Triangle':
        CreateTriangle();
        break;
      case 'Square':
        CreateSquare();
        break;
      case 'Circle':
        setCircleVisible(true);
        break;
      case 'Sphere':
        props.createSphere();
        break;
      case 'Rectangle':
        props.createRectangle();
        break;
      case 'Ring':
        setRingVisible(true);
        break;
      case 'Cone':
        setConeVisible(true);
        break;
      case 'Cylinder':
        setCylinderVisible(true);
        break;
      case 'Pyramid':
        setPyramidVisible(true);
        break;
      case 'Prism':
        setPrismVisible(true);
        break;
      case 'Prismoid':
        setPrismoidVisible(true);
        break;
      case 'NURBS':
        setNURBSVisible(true);
        break;


      case 'open':
        setOBJOpenVisible(true);
        break;
      case 'l_set':
        setLightVisible(true);
        break;
      default:
        break;
    }
  };
  return (
    <>
     <Menu onClick={onClick} mode="horizontal" items={items} />

     <Modal title="Circle" open={CircleVisible} onClose={() => setCircleVisible(false)} 
        onOk={() => {
          props.createCircle(CircleRadius);
          setCircleVisible(false);
        }}
       onCancel={() => setCircleVisible(false)}>
      {/*输入参数为半径 */}
        <InputNumber 
        addonBefore="半径"
        min={0} max={10} defaultValue={1} onChange={(value) => setCircleRadius(value)} />
      </Modal>

      <Modal title="Ring" open={RingVisible} onClose={() => setRingVisible(false)}
        onOk={() => {
          props.createRing(RingRadius1, RingRadius2);
          setRingVisible(false);
        }}
        onCancel={() => setRingVisible(false)}>
        <Space direction="vertical">
        <InputNumber
          addonBefore="内半径"
          min={0} max={10} defaultValue={1} onChange={(value) => setRingRadius1(value)} />
        <InputNumber
          addonBefore="外半径"
          min={0} max={10} defaultValue={2} onChange={(value) => setRingRadius2(value)} />
        </Space>
      </Modal>
      <Modal title="Cone" open={ConeVisible} onClose={() => setConeVisible(false)}
        onOk={() => {
          props.createCone(ConeRadius, ConeHeight);
          setConeVisible(false);
        }}
        onCancel={() => setConeVisible(false)}>
        <Space direction="vertical">
        <InputNumber
          addonBefore="半径"
          min={0} max={10} defaultValue={1} onChange={(value) => setConeRadius(value)} />
        <InputNumber
          addonBefore="高度"
          min={0} max={10} defaultValue={2} onChange={(value) => setConeHeight(value)} />
        </Space>
      </Modal>
      
      <Modal title="Cylinder" open={CylinderVisible} onClose={() => setCylinderVisible(false)}
        onOk={() => {
          props.createConecylinder(CylinderRadius, CylinderHeight);
          setCylinderVisible(false);
        }}
        onCancel={() => setCylinderVisible(false)}>
        <Space direction="vertical">
          <InputNumber
            addonBefore="半径"
            min={0} max={10} defaultValue={1} onChange={(value) => setCylinderRadius(value)} />
          <InputNumber
            addonBefore="高度"
            min={0} max={10} defaultValue={2} onChange={(value) => setCylinderHeight(value)} />
        </Space>
      </Modal>

      <Modal title="Pyramid" open={PyramidVisible} onClose={() => setPyramidVisible(false)}
        onOk={() => {
          props.createPyramid(PyramidDegree, PyramidHeight, PyramidRadius);
          setPyramidVisible(false);
        }}
        onCancel={() => setPyramidVisible(false)}>
        <Space direction="vertical">
          <InputNumber
            addonBefore="度数"
            min={0} max={10} defaultValue={1} onChange={(value) => setPyramidDegree(value)} />
          <InputNumber
            addonBefore="高度"
            min={0} max={10} defaultValue={2} onChange={(value) => setPyramidHeight(value)} />
          <InputNumber
            addonBefore="半径"
            min={0} max={10} defaultValue={1} onChange={(value) => setPyramidRadius(value)} />
        </Space>
      </Modal>

      <Modal title="Prism" open={prismVisible} onClose={() => setPrismVisible(false)}
        onOk={() => {
          props.createPrism(prismDegree, prismHeight, prismRadius);
          setPrismVisible(false);
        }}
        onCancel={() => setPrismVisible(false)}>
        <Space direction="vertical">
          <InputNumber
            addonBefore="度数"
            min={0} max={10} defaultValue={1} onChange={(value) => setPrismDegree(value)} />
          <InputNumber
            addonBefore="高度"
            min={0} max={10} defaultValue={1} onChange={(value) => setPrismHeight(value)} />
          <InputNumber
            addonBefore="半径"
            min={0} max={10} defaultValue={1} onChange={(value) => setPrismRadius(value)} />
        </Space>
      </Modal>

      <Modal title="Prismoid" open={prismoidVisible} onClose={() => setPrismoidVisible(false)}
        onOk={() => {
          props.createPrismoid(prismoidDegree, prismoidHeight, prismoidRadius);
          setPrismoidVisible(false);
        }}
        onCancel={() => setPrismoidVisible(false)}>
        <Space direction="vertical">
          <InputNumber
            addonBefore="度数"
            min={0} max={10} defaultValue={1} onChange={(value) => setPrismoidDegree(value)} />
          <InputNumber
            addonBefore="高度"
            min={0} max={10} defaultValue={1} onChange={(value) => setPrismoidHeight(value)} />
          <InputNumber
            addonBefore="半径"
            min={0} max={10} defaultValue={1} onChange={(value) => setPrismoidRadius(value)} />
        </Space>
      </Modal>

     <Modal title="NURBS" open={NURBSVisible} onClose={() => setNURBSVisible(false)} 
        onOk={() => {
          props.CreateNURBS(NURBSUControlNum, NURBSVControlNum, NURBSDeg);
          setNURBSVisible(false);
        }}
       onCancel={() => setNURBSVisible(false)}>
      {/*输入参数为u方向控制点个数，v方向控制点个数，阶数 */}
        <InputNumber 
        addonBefore="u方向控制点个数"
        min={1} max={10} defaultValue={5} onChange={(value) => setNURBSUControlNum(value)} />
        <InputNumber
        addonBefore="v方向控制点个数"
        min={1} max={10} defaultValue={5} onChange={(value) => setNURBSVControlNum(value)} />
        <InputNumber
        addonBefore="阶数"
        min={1} max={10} defaultValue={3} onChange={(value) => setNURBSDeg(value)} />

      </Modal>
      <Modal title="Open OBJ File" open={OBJOpenVisible} onClose={() => setOBJOpenVisible(false)} 
      onOk={() => {
        props.OpenOBJFile(OBJFileName);
        setOBJOpenVisible(false);
      }}
        onCancel={() => setOBJOpenVisible(false)}>
        <Select defaultValue="" style={{ width: '100%' }} options={OBJFileList} value={OBJFileName} onChange={(value) => setOBJFileName(value)}
        ></Select>
      </Modal>
      <Modal title="Light Setting" open={LightVisible} onClose={() => setLightVisible(false)}
        onOk={() => {
          props.changeLight(LightDirection, LightColor);
          console.log(LightDirection, LightColor);
          setLightVisible(false);
        }}
        onCancel={() => setLightVisible(false)}>
        <Space direction="vertical">
        <InputNumber
          addonBefore="Direction X"
          min={-1} max={1} defaultValue={0} onChange={(value) => setLightDirection([value, LightDirection[1], LightDirection[2]])} />
        <InputNumber
          addonBefore="Direction Y"
          min={-1} max={1} defaultValue={1} onChange={(value) => setLightDirection([LightDirection[0], value, LightDirection[2]])} />
        <InputNumber
          addonBefore="Direction Z"
          min={-1} max={1} defaultValue={0} onChange={(value) => setLightDirection([LightDirection[0], LightDirection[1], value])} />
        </Space>
        <Space direction="vertical" style={{marginTop: 10}}>
        <InputNumber
          addonBefore="Color R"
          min={0} max={1} defaultValue={1} onChange={(value) => setLightColor([value, LightColor[1], LightColor[2]])} />
        <InputNumber
          addonBefore="Color G"
          min={0} max={1} defaultValue={1} onChange={(value) => setLightColor([LightColor[0], value, LightColor[2]])} />
        <InputNumber
          addonBefore="Color B"
          min={0} max={1} defaultValue={1} onChange={(value) => setLightColor([LightColor[0], LightColor[1], value])} />
        </Space>
      </Modal>
     </>
  );
};

// 获取public文件夹中所有文件名称

export default NavBar;