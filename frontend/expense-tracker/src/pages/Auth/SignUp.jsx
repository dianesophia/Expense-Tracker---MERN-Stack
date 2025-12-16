import React, { useContext, useState } from 'react'
import AutLayout from '../../components/layouts/AuthLayout.jsx'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Inputs.jsx';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper.js';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector.jsx';
import { userContext } from "../../context/userContext.jsx";   
import { API_PATHS } from '../../utils/apiPaths.js';
import axiosInstance from '../../utils/axiosinstance.js';
import uploadImage from '../../utils/uploadImage.js';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);

  const {updateUser} = useContext(userContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
      if(!fullname){
        setError("Please enter your full name");
        return;
      }

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

      //Sign up api call simulation

      try{

        //Upload image if present
        if(profilePic){
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        }

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          fullname,
          email,
          password,
          profileImageUrl
        });

        const { token, user } = response.data;

        if(token){
          localStorage.setItem("token", token);
          updateUser(user);
          navigate("/dashboard");
        }
      }catch(error){
        if(error.response && error.response.data.message){
          setError(error.response.data.message);
        }else{
          setError("Something went wrong. Please try again. ");
        }
      }
  };


  return (
    <AutLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            <Input
              value={fullname}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="Enter your email address"
              type="text"
            />

            <div className='col-span-2'>

               <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />

            </div>
          </div>

           {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

           <button
            type="submit" className='btn-primary'
           >
              SIGN UP 
           </button>


             <p className='text-[13px] text-slate-800 mt-3'>
                       Don't have an account?{" "}
                       <Link className='font-medium text-primary underline 'to="/login">
                         Login
                       </Link>
                       </p>

        </form>

      </div>
    </AutLayout>
  )
}

export default SignUp
