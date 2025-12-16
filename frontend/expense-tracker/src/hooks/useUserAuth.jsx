import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";
import { API_PATHS } from '../utils/apiPaths.js';
import axiosInstance from '../utils/axiosinstance.js';

export const useUserAuth = () => {
    const {user, updateUser, clearUser} = useContext(userContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) return;

        let isMounted = true;
        const fetchUserInfo = async () => {
            try{
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

                if(isMounted && response.data){
                    updateUser(response.data);
                }
            }catch(error){
                console.error("Failed to fetch user info: ", error);
                if(isMounted){
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();
        return () => {
            isMounted = false;
        };
    }, [updateUser, clearUser, navigate]);
};