import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type FreelancerContextProps = {

}

type FreelancerProviderProps = {
    children?: React.ReactNode
}

export const FreelancerContext = createContext<FreelancerContextProps | null>(null);

const FreelancerProvider = ({children}: FreelancerProviderProps) => {

    return (
        <FreelancerContext.Provider value={{}}>
            {children}
        </FreelancerContext.Provider>
    )
}

export const useFreelancer = () => {
    const context = useContext(FreelancerContext)
    if (!context){
        throw new Error("useFreelancer must be used within an FreelancerProvider");
    }

    const {} = context

    return {
    
    }
}

export default FreelancerProvider