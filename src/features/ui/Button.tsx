interface ButtonProps {
  children: React.ReactNode;
  handleRemove: () => void;
  handleClick: () => void;
  manageModal: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  handleRemove,
  handleClick,
  manageModal,
}) => {
  return (
    <button
      className="mr-5 p-1 rounded-lg hover:bg-yellow-300 hover:ring hover:ring-yellow-100 hover:border-offset-1 "
      onClick={() => {
        handleClick();
        manageModal();
        handleRemove();
      }}
    >
      {children}
    </button>
  );
};

export default Button;
