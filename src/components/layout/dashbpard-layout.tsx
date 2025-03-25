import { ReactNode, useRef, useState } from "react"
import { ApplicationRoutes } from "../../routes/routes-constant"

const DashboardLayout = ({children}: {children: ReactNode}) => {

    const mobileRoutes = [
        // {
        //     title : 'Dashboard',
        //     route: ApplicationRoutes.DASHBOARD,
        //     icon: <DashboardIcon className="scale-110" fill={path.includes(ApplicationRoutes.DASHBOARD) ? "#FFFFFF" :  "#9495A5"}/>
        // },
       
    ]

    return (
        <>
            <main className="">
            </main>
        </>
    )
}

export default DashboardLayout