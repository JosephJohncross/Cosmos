
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import WalletConnection from "./wallet-connect"
const HeaderEnd = () => {
    return (
        <>
{/*             <WalletConnection /> */}
{/*             <Link to={}>
            </Link> */}
                <Button className="bg-primary rounded-md py-4 px-6 font-circular text-white font-medium">Connect Wallet</Button>
        </>
    )
}

export default HeaderEnd
