import reactLogo from './assets/react.svg';
import rsbuildLogo from './assets/rsbuild.svg';
import electronLogo from './assets/electron.svg';
import './App.css';

function App() {
  return (
    <>
      <div>
        <a href="https://rsbuild.rs/" target="_blank" rel="noreferrer">
          <img src={rsbuildLogo} className="logo" alt="rsbuild logo" />
        </a>
      </div>
      <div>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://www.electronjs.org/" target="_blank" rel="noreferrer">
          <img src={electronLogo} className="logo electron" alt="Electron logo" />
        </a>
      </div>
      <h1>Rsbuild + React + Electron</h1>
    </>
  );
}

export default App;
