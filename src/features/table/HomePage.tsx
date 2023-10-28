import { useContext, useEffect, useState } from "react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import Overlay from "../ui/Overlay";
import { OverlayContext } from "../contexts/OverlayContext";
import Modal from "../modals/RemoveModal";
import { UserContext } from "../contexts/UserContext";

interface User {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
}

const API_URL = "https://jsonplaceholder.typicode.com/users";

const HomePage: React.FC = () => {
  const overlay = useContext(OverlayContext);
  const details = useContext(UserContext);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userCity, setUserCity] = useState<string>("");

  const removeOverlay = () => {
    overlay.setOverlay(false);
    overlay.setRemoveModal(false);
    overlay.setEditModal(false);
  };

  const manageOverlay = () => {
    overlay.setOverlay(!overlay.overlay);
  };

  const manageRemoveModal = () => {
    overlay.setRemoveModal(!overlay.removeModal);
  };

  const manageEditModal = () => {
    overlay.setEditModal(!overlay.editModal);
  };

  const handleSubmit = async (index: number) => {
    const updatedUsers: User[] = await Promise.all(
      usersData.map(async (user) => {
        if (user.id === index + 1) {
          const updatedAddress = user.address
            ? { ...user.address, city: userCity }
            : { city: userCity };

          const updatedUser: User = {
            ...user,
            name: userName,
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

  const navigate = useNavigate();

  const itemsPerPage: number = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const endIndex: number = startIndex + itemsPerPage;
  const currentItems: User[] = usersData.slice(startIndex, endIndex);

  const handleNextPage = (): void => {
    const totalNumberOfPages: number = Math.ceil(
      currentItems.length / itemsPerPage
    );
    if (currentPage <= totalNumberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = (): void => {
    const totalNumberOfPages: number = Math.ceil(
      currentItems.length / itemsPerPage
    );
    if (currentPage >= totalNumberOfPages && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const getUsers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setUsersData(data);
        setUserName(data[overlay.index].name);
        setUserEmail(data[overlay.index].email);
        setUserCity(data[overlay.index].address.city);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, [overlay.index]);

  if (isLoading) return <Spinner />;

  return (
    <>
      <Overlay handleClick={removeOverlay} />
      <h1 className="ml-52 font-bold text-3xl my-3 text-stone-800">
        👩🏻‍🤝‍🧑🏻🪑 Users Table
      </h1>
      <table className="border-separate mb-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Settings</th>
          </tr>
        </thead>
        <tbody className=" [&>*:nth-child(odd)]:bg-stone-300 table-auto border-separate  [&>*:nth-child(even)]:bg-yellow-200 ">
          {currentItems.map((user, index) => (
            <tr key={index} className="[&>*]:px-3 [&>*]:py-5">
              <td>{user.id}</td>
              <td
                className="hover:cursor-pointer hover:text-stone-400"
                onClick={() => navigate(`/users/${user.id}`)}
              >
                {user.name}
              </td>
              <td>{user.email}</td>
              <td>
                <p>{user.address.city}</p>
              </td>
              <td>
                <Button
                  handleRemove={() => overlay.setIndex(index)}
                  handleClick={manageOverlay}
                  manageModal={manageRemoveModal}
                >
                  Remove
                </Button>

                <Button
                  handleClick={manageOverlay}
                  manageModal={manageEditModal}
                  handleRemove={() => overlay.setIndex(index)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-x-[510px]">
        <Button
          handleClick={handleNextPage}
          manageModal={() => {}}
          handleRemove={() => {}}
        >
          Next page
        </Button>
        <Button
          handleClick={handlePrevPage}
          manageModal={() => {}}
          handleRemove={() => {}}
        >
          Previous page
        </Button>
      </div>
      {overlay.removeModal && overlay.overlay ? (
        <Modal
          handleClick={manageOverlay}
          manageModal={manageRemoveModal}
          handleRemove={() => {
            const newList = [...usersData];
            newList.splice(overlay.index, 1);
            setUsersData(newList);
          }}
        />
      ) : (
        ""
      )}
      {overlay.editModal && overlay.overlay ? (
        <div className="w-[300px] h-[400px]  bg-stone-300  justify-center z-20 fixed top-1/4 left-1/4 flex space-y-5 flex-col items-center p-5 text-center font-medium">
          <label className="inline">
            Edit full name:
            <input
              className="bg-yellow-200 rounded-sm pl-2 mt-2 py-1"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label>
            Edit email:
            <input
              className="bg-yellow-200 rounded-sm pl-2 mt-2 py-1"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </label>
          <label>
            Edit city of residence:
            <input
              className="bg-yellow-200 rounded-sm pl-2 mt-2 py-1"
              type="text"
              value={userCity}
              onChange={(e) => setUserCity(e.target.value)}
            />
          </label>
          <button
            onClick={() => handleSubmit(overlay.index)}
            className="mr-5 p-1 rounded-lg hover:bg-yellow-300 hover:ring hover:ring-yellow-100 hover:border-offset-1 "
          >
            Save
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default HomePage;
