import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [isRateLimited, setIsRateLimited] = useState(false);

    const fetchUser = async () => {
        setLoadingUser(true);

        try {
            const res = await axiosInstance.get("/users/me");
            setUser(res.data.user);
            // console.log(res.data.user)
            setIsRateLimited(false);
        } catch (error) {
            if (error.response?.status === 429) {
                setIsRateLimited(true);
            } else {
                setUser(null);
            }
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        // console.log("fetchuser triggerd")
        fetchUser(); // runs once when app starts
    }, []);

    return (
        <AuthContext.Provider value={{ user, loadingUser, isRateLimited, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
