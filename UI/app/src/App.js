
import './App.css';
import UploaderBox from './component/UploaderBox';
import CanvasScene from './component/CanvasScene';
import { Navbar, FooterComponent  } from './component/BasicComponent';
import ToolBox from './component/ToolBox';
function App() {
  return (
    <div className="App" width='100%' height='100%'>
      <Navbar />
      <div className="App-body" style={{display: 'flex', flexDirection: 'row', height: '100%',width:'100%', padding:'0 auto'}}>
      <CanvasScene />
      <ToolBox />
      </div>
      <FooterComponent />

    </div>
  );
}

export default App;
