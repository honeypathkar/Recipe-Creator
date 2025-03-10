import axios from "axios";
import { UserProfileUrl } from "../../API";

export const getUserData = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(UserProfileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      //   withCredentials: true,
    });
    console.log("Api Response: ", response.data);
  } catch (error) {
    console.error("Error Fetching user Details.", error);
  }
};
