import React, { useContext, useState } from 'react'
import AutLayout from '../../components/layouts/AuthLayout.jsx'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Inputs.jsx';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { userContext } from '../../context/userContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const {updateUser} = useContext(userContext);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if(!password ){
      setError("Please enter your password");
      return;
    }

    if(password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");



    //Login api call simulation

    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const {token, user} = response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <AutLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'> Please enter your details to log in</p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="Enter your email"
            type="text"
          />

            <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />


          <button
            type="submit"
            className='w-full bg-primary text-white py-3 rounded-lg mt-4 hover:bg-purple-400 transition-colors'
          >
            Log In
          </button> 

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className='font-medium text-primary underline 'to="/signup">
              SignUp
            </Link>
            </p>

        </form>
      </div>
    </AutLayout>
  )
}

export default Login
