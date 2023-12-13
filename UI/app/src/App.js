
import './App.css';
import UploaderBox from './component/UploaderBox';
import CanvasScene from './component/CanvasScene';
function App() {
  return (
    <div className="App" width='100%' height='100%'>
      <CanvasScene />
        <UploaderBox />
    </div>
  );
}

export default App;
