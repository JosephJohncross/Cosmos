import { Link } from "react-router-dom"
import Logo from "../icons/main-logo"
import { ApplicationRoutes } from "../../routes/routes-constant"

const HeaderStart = () => {
    return (
        <>
            <Link to={ApplicationRoutes.HOME} className="">
                <Logo className=""/>
            </Link>
        </>
    )
}

export default HeaderStart