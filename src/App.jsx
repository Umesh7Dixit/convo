import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Login from './pages/Login';
import { UserData } from './context/UserContext';
import { LoadingBig } from './components/Loading';



const App = () => {

  const { isAuth, loading } = UserData();
 
  return (
    <>
      {
        loading ? <LoadingBig/> :
         (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isAuth?<Home/>:<Login/>} />
          <Route path='/auth' element={isAuth?<Home/>:<Login/>} />
          <Route path='/verify' element={isAuth?<Home/>:<Verify/>}/>
        </Routes>
      </BrowserRouter>
         )
      }
    </>
  )
}

export default App