import { ReactNode, useEffect } from "react"
import { useFreelancer } from "../../context/freelancer-context"
import { ApplicationRoutes } from "../../routes/routes-constant"
import { useNavigate } from "react-router-dom"

const FreelancerDasboard  = () => {
    const {isNewUser} = useFreelancer()
    const navigate = useNavigate();

    useEffect(() => {
        isNewUser ? navigate(ApplicationRoutes.FREELANCER_SETUP) : ""
    }, [])

    return (
        <>
        </>
    )
}

export default FreelancerDasboard