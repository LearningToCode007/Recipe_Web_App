import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../app/utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isAuthenticated = () => {
    return token !== null && token !== undefined;
  };

  const hasRole = (role) => {
    return isAuthenticated() && user?.role === role;
  };

  const isAdmin = () => {
    return hasRole("ROLE_ADMIN");
  };

  const isSubscriber = () => {
    return hasRole("ROLE_SUBSCRIBER");
  };

  const isRecipeWriter = () => {
    return hasRole("ROLE_RECIPE_WRITER");
  };

  const getUser = async (id, role) => {
    const urlMap = {
      ROLE_ADMIN: `/admins/${id}`,
      ROLE_SUBSCRIBER: `/subscribers/${id}`,
      ROLE_RECIPE_WRITER: `/recipe-writers/${id}`,
    };

    try {
      const response = await api.get(urlMap[role]);
      const user = response.data;
      const userDetails = {
        ...user,
        id: user?._id,
      };
      console.log(JSON.stringify(user));
      return userDetails;
    } catch (error) {
      console.log(error);
    }
  };

  const setUserDetails = (userDetails) => {
    setUser(userDetails);
  };

  useEffect(() => {
    const onLoad = async () => {
      if (isAuthenticated()) {
        setIsLoading(true);
        const decodedToken = jwtDecode(token || localStorage.getItem("token"));
        const user = await getUser(decodedToken?.id, decodedToken?.role);
        setUser({ ...user, role: decodedToken?.role });
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    onLoad();
    // eslint-disable-next-line
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
        isSubscriber,
        isRecipeWriter,
        setUser: setUserDetails,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
