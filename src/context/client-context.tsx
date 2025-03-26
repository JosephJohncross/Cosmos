import { createContext, useContext } from "react";

type ClientContextProps = {
    
}

type ClientProviderProps = {
    children?: React.ReactNode
}

export const ClientContext = createContext<ClientContextProps | null>(null);

const ClientProvider = ({children}: ClientProviderProps) => {

    return (
        <ClientContext.Provider value={
            {}}>
            {children}
        </ClientContext.Provider>
    )
}

export const useClient = () => {
    const context = useContext(ClientContext)
    if (!context){
        throw new Error("useClient must be used within an ClientProvider");
    }

    const { } = context

    return {
     
    }
}

export default ClientProvider