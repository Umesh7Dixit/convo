import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { LoadingSpinner } from "../components/Loading";


const Login = () => {

    const [email,setEmail] = useState("");

    const {loginUser , btnLoading} = UserData();
    const navigate = useNavigate();

    const submitHandler = (e)=> {
        e.preventDefault();
        loginUser(email , navigate);
    };

  return (
    <div className="flex justify-center items-center h-screen" >
        <form className="p-6 bg-white rounded shadow-md w-full md:w-[500px]" onSubmit={submitHandler} >
          <h1 className="text-2xl mb-4">Login</h1>
          <div className="mb-4" >
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input  type={'email'} id="email"  className="border rounded w-full p-2 px-3 text-gray-700 outline-none focus:ring-2 focus:border-blue-500"  required
                onChange={(e)=> setEmail(e.target.value)} value={email} />
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={btnLoading} > {btnLoading?<LoadingSpinner/>:"Submit"} </button>
        </form>
    </div>
  )
}

export default Login