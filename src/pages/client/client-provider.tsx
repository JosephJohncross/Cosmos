import { ReactNode } from "react"
import ClientDashboard from "./client-dashbboard"
import ClientProvider from "../../context/client-context"

const ClientProviderWrapper = () => {
    return (
        <>
            <ClientProvider>
                <ClientDashboard />
            </ClientProvider>
        </>
    )
}

export default ClientProviderWrapper