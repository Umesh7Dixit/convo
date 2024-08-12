 // Shree Radha
import { createContext, useContext, useEffect, useState } from "react";
import toast, {Toaster} from 'react-hot-toast';
import axios from 'axios';
import { server } from "../main.jsx";

const UserContext = createContext();


export const UserContextProvider = ({children})=>  {


  const [btnLoading , setBtnLoading  ] = useState(false);

  const loginUser = async(email, navigate)=>
  {
  
    setBtnLoading(true);
    try {
      const {data} = await axios.post(`${server}/api/user/auth`,{email});
      toast.success(data.message);  
      localStorage.setItem("verifyToken",data.verifyToken);
      navigate("/verify");
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }  

  };

  const [user , setUser] = useState([]);
  const [isAuth , setIsAuth ] = useState(false);

  const verifyUser = async (otp , navigate, fetchChats)=> {
    setBtnLoading(true);
    try{
      const verifyToken = localStorage.getItem('verifyToken');

      const {data} = await axios.post(`${server}/api/user/verify`,{otp,verifyToken});
      toast.success(data.message);
      localStorage.clear();
      localStorage.setItem("token",data.token);
      navigate('/');
      setBtnLoading(false);
      setIsAuth(true);
      setUser(data.user); //userId
      fetchChats();

    }catch(error){
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  const [loading , setLoading] = useState(true);
  const fetchUser = async()=> {
    try {
      const {data} = await axios.get(`${server}/api/user/me`,{
        headers: {
          token: localStorage.getItem('token'),
        },
      });

      setIsAuth(true);
      setUser(data);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  const logoutHandler = (navigate)=> {
    localStorage.clear();
    toast.success('Logged Out');
    setIsAuth(false);
    setUser([]);
    navigate('/auth');
  }

  useEffect( ()=>{  //whenever the page is reload then it call fetchUser
    fetchUser();
  } , [] )


  return (
    <UserContext.Provider value={{ loginUser, btnLoading ,isAuth,user, verifyUser, fetchUser,loading, logoutHandler }} >
      {children}
      <Toaster/>
    </UserContext.Provider>
  )
}


export const UserData = ()=> useContext(UserContext);