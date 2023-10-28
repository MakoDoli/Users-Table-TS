import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface UserContextProps {
  userName: string;
  userEmail: string;
  userCity: string;
  edited: boolean;
  setEdited: Dispatch<SetStateAction<boolean>>;
  setUserName: Dispatch<SetStateAction<string>>;
  setUserEmail: Dispatch<SetStateAction<string>>;
  setUserCity: Dispatch<SetStateAction<string>>;
}

export const UserContext = createContext<UserContextProps>({
  userName: "",
  userEmail: "",
  userCity: "",
  edited: false,
  setEdited: () => {},
  setUserName: () => {},
  setUserEmail: () => {},
  setUserCity: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userCity, setUserCity] = useState<string>("");
  const [edited, setEdited] = useState<boolean>(false);

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        userCity,
        setUserCity,
        edited,
        setEdited,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
