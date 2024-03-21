import React from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from "@mui/material";

export const Home = () => {
  const { user, logOut } = useUserAuth();
  console.log(user);

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Home Welcome</h1>
      <br />
      <h1>{user && user.displayName}</h1>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleLogOut}
      >
        Logout
      </Button>
    </div>
  );
};

export default Home;
