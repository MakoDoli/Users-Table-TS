import { useEffect, useState, useContext } from "react";

import { UserContext } from "../contexts/UserContext";
import { Button } from "@/components/ui/button";

import { OverlayContext } from "../contexts/OverlayContext";

// interface Address {
//   street: string;
//   suite: string;
//   zipcode: string;
//   city: string;
// }
const API_URL = "https://jsonplaceholder.typicode.com/users";
interface User {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
}
interface EditProps {
  manageModal: () => void;
  currentItems: User[];
  setUsersData: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function EditModal({
  manageModal,
  setUsersData,
  currentItems,
}: EditProps) {
  const details = useContext(UserContext);
  const overlay = useContext(OverlayContext);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const urlID = overlay.index;
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  const URL = `https://jsonplaceholder.typicode.com/users/${urlID}`;
  

  // ---- handle Submit function -----

  const handleSubmit = async (index: number) => {
    const updatedUsers: User[] = await Promise.all(
      currentItems.map(async (user) => {
        if (user.name === currentItems[index].name) {
          const updatedAddress = user.address
            ? { ...user.address, city: city }
            : { city: city };

          const updatedUser: User = {
            ...user,
            name: details.userName,
            email: userEmail,
            address: updatedAddress,
          };

          try {
            const res = await fetch(`${API_URL}/${user.id}`, {
              method: "PUT",
              body: JSON.stringify(updatedUser),
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
              },
            });

            if (!res.ok) throw Error();

            alert("User updated successfully");
          } catch (err) {
            alert("Failed updating user ");
          }

          details.setUserName(updatedUser.name);
          details.setUserEmail(updatedUser.email);
          details.setUserCity(updatedUser.address.city);
          return updatedUser;
        }
        return user;
      })
    );

    setUsersData(updatedUsers);
    overlay.setEditModal(!overlay.editModal);
    overlay.setOverlay(!overlay.overlay);
    details.setEdited(true);
  };

  //---------------------------------------

  useEffect(() => {
    //setIsLoading(true);
    async function getUser(url: string) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setUserName(data.name);
        setUserEmail(data.email);
        // setUserAddress(
        //   `${data.address.street}, ${data.address.suite}, ${data.address.zipcode}`
        // );
        setCity(data.address.city);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      //   } finally {
      //     setIsLoading(false);
      //   }
    }
    getUser(URL);
  }, []);

  return (
    <div className="w-[300px] h-[400px]  bg-stone-300  justify-center z-20 fixed top-1/4 left-1/4 flex space-y-5 flex-col items-center p-5 text-center font-medium">
      <label className="inline">
        Edit full name:
        <input
          className="bg-slate-200 rounded-sm pl-2 mt-2 py-1"
          type="text"
          value={details.edited ? details.userName : userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
      <label>
        Edit email:
        <input
          className="bg-slate-200 rounded-sm pl-2 mt-2 py-1"
          type="email"
          value={details.edited ? details.userEmail : userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </label>
      <label>
        Edit city of residence:
        <input
          className="bg-slate-200 rounded-sm pl-2 mt-2 py-1"
          type="text"
          value={details.edited ? details.userCity : city}
          onChange={(e) => setCity(e.target.value)}
        />
      </label>
      <Button
        onClick={() => {
          manageModal();
          handleSubmit(overlay.index);
        }}
        className="mr-5 p-1 rounded-lg hover:bg-slate-600 hover:ring hover:ring-slate-400 hover:border-offset-1 "
      >
        Save
      </Button>
    </div>
  );
}
