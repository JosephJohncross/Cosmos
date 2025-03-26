import { ReactNode } from "react"
import FreelancerDasboard from "./freelancer-dashboard"
import FreelancerProvider from "../../context/freelancer-context"

const FreeLancerProviderWrapper = () => {
    return (
        <>
            <FreelancerProvider>
                <FreelancerDasboard/>
            </FreelancerProvider>
        </>
    )
}

export default FreeLancerProviderWrapper