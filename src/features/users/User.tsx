import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../ui/Buttons";
import Spinner from "../ui/Spinner";
import { UserContext } from "../contexts/UserContext";

interface Address {
  street: string;
  suite: string;
  zipcode: string;
  city: string;
}

interface User {
  name: string;
  email: string;
  address: Address;
}

const User: React.FC = () => {
  const details = useContext(UserContext);
  const [user, setUser] = useState<User | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const { userID } = useParams<{ userID: string }>();
  const urlID = Number(userID);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const URL = `https://jsonplaceholder.typicode.com/users/${urlID}`;

  useEffect(() => {
    setIsLoading(true);
    async function getUser(url: string) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setUser(data);
        setUserAddress(
          `${data.address.street}, ${data.address.suite}, ${data.address.zipcode}`
        );
        setCity(data.address.city);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getUser(URL);
  }, [URL]);

  const navigate = useNavigate();

  if (isLoading || !user) return <Spinner />;

  return (
    <div className="m-5 rounded-md bg-yellow-200 p-3 w-[480px] ">
      <h2 className="font-bold mb-2"> User Info</h2>
      <div className="flex space-x-8 ">
        <div className="font-semibold">
          <p>Full name:</p>
          <p>Email:</p>
          <p>Address:</p>
          <p>City of residence:</p>
        </div>
        <div>
          <p>{details.edited ? details.userName : user.name}</p>
          <p>{details.edited ? details.userEmail : user.email}</p>
          <p>{userAddress}</p>
          <p>{details.edited ? details.userCity : city}</p>
          <div className="flex justify-end mt-4">
            <Button
              handleClick={() => navigate("/")}
              manageModal={() => {}}
              handleRemove={() => {}}
            >
              Back to table
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
