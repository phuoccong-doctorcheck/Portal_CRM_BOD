import axiosInstance from "../common/instance";

export const loginWithAccount = async (data: any) => {
    const { userName, passwords } = data;
    const response = await axiosInstance.post("/account/authenticate", {
      username: userName,
      password: passwords,
    });
    return response.data;
};