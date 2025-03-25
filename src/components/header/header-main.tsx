import { hasFooter } from "../../provider"
import HeaderCenter from "./header-center"
import HeaderEnd from "./header-end"
import HeaderStart from "./header-start"
import { useLocation } from "react-router-dom"

const HeaderMain = () => {
    const location = useLocation();
    const currentPath = location.pathname

    return (
        <>
            <div className="fixed overflow-hidden w-screen left-0 right-0 top-0 bg-[#F4F4F5] z-[1]  py-8">
                <div className="flex items-center justify-between app-container">
                    <HeaderStart/>
                    
                    { hasFooter(currentPath) &&
                        <HeaderCenter/>
                    }

                    <HeaderEnd/>
                </div>
            </div>
        </>
    )
}

export default HeaderMain