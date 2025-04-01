
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
// import WalletConnection from "./wallet-connect"
import { ApplicationRoutes } from "../../routes/routes-constant"
const HeaderEnd = () => {
    return (
        <>
        <div className="flex items-center space-x-6">
            {/* <div className="flex items-center space-x-4">
                <div className="">
                    <svg className="scale-90 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 17.5L22 22" stroke="#545756" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="#545756" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                </div>

                <div className="">
                    <svg className="scale-90 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z" stroke="#545756" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19" stroke="#545756" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div> */}
    {/*             <WalletConnection /> */}
                <Link to={ApplicationRoutes.JOIN}>
                    <Button className="bg-primary rounded-md py-4 px-6 font-circular text-white font-medium">Join</Button>
                </Link>
        </div>
        </>
    )
}

export default HeaderEnd
