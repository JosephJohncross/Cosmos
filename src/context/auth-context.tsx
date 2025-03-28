import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { ApplicationRoutes } from "../routes/routes-constant";

type AuthContextProps = {
    isNewFreelanceUser: boolean,
    setIsNewFreelanceUser: Dispatch<SetStateAction<boolean>>,
    hasJob: boolean,
    setHasJob: Dispatch<SetStateAction<boolean>>
}

type AuthProviderProps = {
    children?: React.ReactNode
}

export const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({children}: AuthProviderProps) => {
    const [isNewFreelanceUser, setIsNewFreelanceUser] = useState(true)
    const [hasJob, setHasJob] = useState(false)

    return (
        <AuthContext.Provider value={
            {isNewFreelanceUser, setIsNewFreelanceUser, hasJob, setHasJob}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const {isNewFreelanceUser, setIsNewFreelanceUser, hasJob, setHasJob } = context

    const isLoggedIn = false

    const logout = () => {
        window.location.replace(ApplicationRoutes.HOME)
    }

    return {
       logout,
       isLoggedIn,
       isNewFreelanceUser,
       setIsNewFreelanceUser,
       hasJob,
       setHasJob
    }
}

export default AuthProvider