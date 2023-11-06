import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { OverlayContext } from "../contexts/OverlayContext";

interface ButtonProps {
  children: React.ReactNode;
  handleRemove: () => void;

  manageModal: () => void;
}

const Buttons: React.FC<ButtonProps> = ({
  children,
  handleRemove,

  manageModal,
}) => {
  const overlay = useContext(OverlayContext);

  const manageOverlay = () => {
    overlay.setOverlay(!overlay.overlay);
  };
  return (
    <Button
      // className="mr-5 p-1 rounded-lg hover:bg-yellow-300 hover:ring hover:ring-yellow-100 hover:border-offset-1 "
      onClick={() => {
        manageModal();
        handleRemove();
        manageOverlay();
      }}
    >
      {children}
    </Button>
  );
};

export default Buttons;
