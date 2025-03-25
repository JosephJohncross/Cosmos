import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { ApplicationRoutes } from "../routes/routes-constant";

type AuthContextProps = {
    
}

type AuthProviderProps = {
    children?: React.ReactNode
}

export const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({children}: AuthProviderProps) => {

    return (
        <AuthContext.Provider value={
            {}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { } = context

    const isLoggedIn = false

    const logout = () => {
        window.location.replace(ApplicationRoutes.HOME)
    }

    return {
       logout,
       isLoggedIn
    }
}

export default AuthProvider