import { useContext, useEffect, useState } from "react";
import Buttons from "../ui/Buttons";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import Overlay from "../ui/Overlay";
import { OverlayContext } from "../contexts/OverlayContext";
import Modal from "../modals/RemoveModal";
import { UserContext } from "../contexts/UserContext";
import { Button } from "@/components/ui/button";
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
  // const [userName, setUserName] = useState<string>("");
  // const [userEmail, setUserEmail] = useState<string>("");
  //const [userCity, setUserCity] = useState<string>("");

  // ------- Pagination -----------------

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
    setCurrentPage(currentPage - 1);
  };

  // ------- Manage overlay and Modals ---------

  const removeOverlay = () => {
    overlay.setOverlay(false);
    overlay.setRemoveModal(false);
    overlay.setEditModal(false);
  };

  const manageRemoveModal = () => {
    overlay.setRemoveModal(!overlay.removeModal);
  };

  const manageEditModal = () => {
    overlay.setEditModal(!overlay.editModal);
  };

  // ----- Initial user stats for Edit Modal--

  const initialUser = async (id: number) => {
    const URL_USER = `${API_URL}/${id}`;
    console.log(URL_USER);
    try {
      const res = await fetch(URL_USER);
      const data = await res.json();
      details.setUserName(data.name);
      details.setUserEmail(data.email);
      details.setUserCity(data.address.city);
    } catch (error) {
      console.error("Failed to fetch user");
    }
  };

  // -----Edit user --------------

  const handleSubmit = async (index: number) => {
    console.log("index=:" + index);
    const arrindex = currentPage === 1 ? index : index - 5;
    const updatedUsers: User[] = await Promise.all(
      usersData.map(async (user) => {
        if (user.name === currentItems[arrindex].name) {
          const updatedAddress = user.address
            ? { ...user.address, city: details.userCity }
            : { city: details.userCity };

          const updatedUser: User = {
            ...user,
            name: details.userName,
            email: details.userEmail,
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

  useEffect(() => {
    setIsLoading(true);
    const getUsers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setUsersData(data);
        // setUserName(data[overlay.index].name);
        // setUserEmail(data[overlay.index].email);
        // setUserCity(data[overlay.index].address.city);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, []);

  if (isLoading) return <Spinner />;
  console.log(currentItems);
  console.log(overlay.index);
  console.log(details.edited);

  return (
    <>
      <Overlay handleClick={removeOverlay} />
      <h1 className="scroll-m-20 tracking-tight ml-52 font-bold text-5xl my-6 ">
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
        <tbody className=" [&>*:nth-child(odd)]:bg-slate-400 table-auto border-separate leading-7  [&>*:nth-child(even)]:bg-slate-200 ">
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
                <div className="space-x-1">
                  <Buttons
                    handleRemove={() => {
                      if (currentPage === 1) overlay.setIndex(index);
                      if (currentPage === 2) overlay.setIndex(index + 5);
                    }}
                    manageModal={manageRemoveModal}
                  >
                    Remove
                  </Buttons>

                  <Buttons
                    manageModal={manageEditModal}
                    handleRemove={() => {
                      if (currentPage === 1) overlay.setIndex(index);
                      if (currentPage === 2) overlay.setIndex(index + 5);
                      initialUser(user.id);
                    }}
                  >
                    Edit
                  </Buttons>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-x-[510px]">
        <Button onClick={handleNextPage}>Next page</Button>

        {currentPage > 1 ? (
          <Button onClick={handlePrevPage}>Previous page</Button>
        ) : (
          ""
        )}
      </div>
      {overlay.removeModal && overlay.overlay ? (
        <Modal
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
              className="bg-slate-200 rounded-sm pl-2 mt-2 py-1"
              type="text"
              value={details.userName}
              onChange={(e) => details.setUserName(e.target.value)}
            />
          </label>
          <label>
            Edit email:
            <input
              className="bg-slate-200 rounded-sm pl-2 mt-2 py-1"
              type="email"
              value={details.userEmail}
              onChange={(e) => details.setUserEmail(e.target.value)}
            />
          </label>
          <label>
            Edit city of residence:
            <input
              className="bg-slate-200 rounded-sm pl-2 mt-2 py-1"
              type="text"
              value={details.userCity}
              onChange={(e) => details.setUserCity(e.target.value)}
            />
          </label>
          <Button
            onClick={() => handleSubmit(overlay.index)}
            className="mr-5 p-1 rounded-lg hover:bg-slate-600 hover:ring hover:ring-slate-400 hover:border-offset-1 "
          >
            Save
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default HomePage;
