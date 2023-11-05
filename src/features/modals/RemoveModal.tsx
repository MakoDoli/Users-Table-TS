import Button from "../ui/Buttons";
interface ModalProps {
  handleRemove: () => void;
  handleClick: () => void;
  manageModal: () => void;
}
export default function Modal({
  handleClick,
  manageModal,
  handleRemove,
}: ModalProps) {
  return (
    <div className="w-[300px] h-[200px]  bg-stone-300  justify-center z-20 fixed top-1/4 left-1/4 flex space-y-5 flex-col items-center p-5 text-center font-medium rounded ">
      <p> Are you sure you want to delete this user? 😯</p>
      <div className="space-x-2">
        <Button
          handleClick={handleClick}
          manageModal={manageModal}
          handleRemove={handleRemove}
        >
          I&apos;m sure
        </Button>
        <Button
          handleClick={handleClick}
          manageModal={manageModal}
          handleRemove={() => {}}
        >
          cancel
        </Button>
      </div>
    </div>
  );
}
