import React, { createContext, useContext, useState } from "react";

type AuthData = {
    jwt: string | null;
    userName: string | null;
    name: string;
    role: string | null;
    userId: string | null;
    organisationId: string | null;
    organisationName: string | null;
};

type AuthContextType = {
    user: AuthData;
    setUser: (user: AuthData) => void;
    logout: () => void;
    login: (user: AuthData) => void;
    updateUser: (user: AuthData) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthData>({
        jwt: localStorage.getItem("jwtToken"),
        userName: localStorage.getItem("userName"),
        name: localStorage.getItem("name") || "Guest",
        role: localStorage.getItem("role"),
        userId: localStorage.getItem("userId"),
        organisationId: localStorage.getItem("organisationId"),
        organisationName: localStorage.getItem("organisationName"),
    });

    const login = (user: AuthData) => {
        setUser(user);
        localStorage.setItem("userId", user.userId || "");
        localStorage.setItem("userName", user.userName || "");
        localStorage.setItem("name", user.name || "Guest");
        localStorage.setItem("role", user.role || "");
        localStorage.setItem("jwtToken", user.jwt || "");
        localStorage.setItem("organisationName", user.organisationName || "");
        localStorage.setItem("organisationId", user.organisationId || "");
    };

    const updateUser = (user: AuthData) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...user,
        }));
        localStorage.setItem("userName", user.userName || "");
        localStorage.setItem("name", user.name || "Guest");
        localStorage.setItem("role", user.role || "");
        localStorage.setItem("organisationName", user.organisationName || "");
        localStorage.setItem("organisationId", user.organisationId || "");
        localStorage.setItem("userId", user.userId || "");
        localStorage.setItem("jwtToken", user.jwt || "");
    }

    const logout = () => {
        localStorage.clear();
        console.log("Logging out...");
        setUser({
            jwt: null,
            userName: null,
            name: "Guest",
            role: null,
            userId: null,
            organisationId: null,
            organisationName: null,
        });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, login, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
