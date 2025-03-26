
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
// import WalletConnection from "./wallet-connect"
import { ApplicationRoutes } from "../../routes/routes-constant"
const HeaderEnd = () => {
    return (
        <>
{/*             <WalletConnection /> */}
            <Link to={ApplicationRoutes.JOIN}>
                <Button className="bg-primary rounded-md py-4 px-6 font-circular text-white font-medium">Connect Wallet</Button>
            </Link>
        </>
    )
}

export default HeaderEnd
