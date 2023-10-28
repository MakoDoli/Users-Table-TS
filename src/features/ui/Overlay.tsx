import { useContext } from "react";
import { OverlayContext } from "../contexts/OverlayContext";

interface OverlayProps {
  handleClick: () => void;
}

export default function Overlay({ handleClick }: OverlayProps) {
  const overlay = useContext(OverlayContext);

  return (
    <div
      onClick={handleClick}
      className={`${
        overlay.overlay
          ? "block w-screen h-screen bg-black opacity-50 absolute z-10"
          : "hidden"
      }`}
    >
      Overlay
    </div>
  );
}
