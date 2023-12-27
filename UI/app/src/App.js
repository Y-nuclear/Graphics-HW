import React from 'react';
import './App.css';
import UploaderBox from './component/UploaderBox';
import CanvasScene from './component/CanvasScene';
import { FooterComponent  } from './component/BasicComponent';
import NavBar from './component/NavBar';
import ToolBar from './component/ToolBar';
import ToolBox from './component/ToolBox';
function App() {
  return (
    <div className="App" width='100%' height='100%'>
      <NavBar />
      <div className="App-body" style={{display: 'flex', flexDirection: 'row', height: '100%',width:'100%', padding:'0 auto'}}>
      <CanvasScene />
      <ToolBar />
      </div>
      <FooterComponent />

    </div>
  );
}

export default App;
