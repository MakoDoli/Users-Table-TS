import { Button } from "@/components/ui/button";

interface ButtonProps {
  children: React.ReactNode;
  handleRemove: () => void;
  handleClick: () => void;
  manageModal: () => void;
}

const Buttons: React.FC<ButtonProps> = ({
  children,
  handleRemove,
  handleClick,
  manageModal,
}) => {
  return (
    <Button
      // className="mr-5 p-1 rounded-lg hover:bg-yellow-300 hover:ring hover:ring-yellow-100 hover:border-offset-1 "
      onClick={() => {
        handleClick();
        manageModal();
        handleRemove();
      }}
    >
      {children}
    </Button>
  );
};

export default Buttons;
