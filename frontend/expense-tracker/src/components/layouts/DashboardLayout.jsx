import React, {useContext}  from "react";
import { userContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SlideMenu from "./SideMenu";

const DashboardLayout = ({children, activeMenu}) => {
    const {user} = useContext(userContext);

    return (
        <div className="">
            <Navbar activeMenu={activeMenu}/>

            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        <SlideMenu activeMenu={activeMenu}/>
                    </div>

                    <div className="grow mx-5">{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout;