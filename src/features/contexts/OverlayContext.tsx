import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface OverlayContextProps {
  overlay: boolean;
  removeModal: boolean;
  editModal: boolean;
  removeUser: boolean;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  setOverlay: Dispatch<SetStateAction<boolean>>;
  setRemoveModal: Dispatch<SetStateAction<boolean>>;
  setEditModal: Dispatch<SetStateAction<boolean>>;
  setRemoveUser: Dispatch<SetStateAction<boolean>>;
}

export const OverlayContext = createContext<OverlayContextProps>({
  overlay: false,
  removeModal: false,
  editModal: false,
  removeUser: false,
  index: 0,
  setIndex: () => {},
  setOverlay: () => {},
  setRemoveModal: () => {},
  setEditModal: () => {},
  setRemoveUser: () => {},
});

interface OverlayProviderProps {
  children: ReactNode;
}

export const OverlayProvider: React.FC<OverlayProviderProps> = ({
  children,
}) => {
  const [overlay, setOverlay] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [removeUser, setRemoveUser] = useState(false);
  const [index, setIndex] = useState<number>(0);

  return (
    <OverlayContext.Provider
      value={{
        overlay,
        setOverlay,
        removeModal,
        editModal,
        setEditModal,
        setRemoveModal,
        removeUser,
        setRemoveUser,
        index,
        setIndex,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};
