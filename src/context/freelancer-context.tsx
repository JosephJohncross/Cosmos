import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type FreelancerContextProps = {
    isNewUser: boolean,
    setIsNewUser: Dispatch<SetStateAction<boolean>>
}

type FreelancerProviderProps = {
    children?: React.ReactNode
}

export const FreelancerContext = createContext<FreelancerContextProps | null>(null);

const FreelancerProvider = ({children}: FreelancerProviderProps) => {
    const [isNewUser, setIsNewUser] = useState(true)

    return (
        <FreelancerContext.Provider value={{isNewUser, setIsNewUser}}>
            {children}
        </FreelancerContext.Provider>
    )
}

export const useFreelancer = () => {
    const context = useContext(FreelancerContext)
    if (!context){
        throw new Error("useFreelancer must be used within an FreelancerProvider");
    }

    const {isNewUser, setIsNewUser } = context

    return {
        isNewUser,
        setIsNewUser
    }
}

export default FreelancerProvider