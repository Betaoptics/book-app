
import { Routes, Route } from 'react-router-dom';
import Mainpage from './Frontend/Mainpage';

function App() {
  return (
    <div>
        {/*For route documentation, consult: https://reactrouter.com/en/main/route/route*/}
        <Routes>
        <Route path="/" element={<Mainpage />}></Route>
      </Routes >
    </div>
  );
}

export default App;
