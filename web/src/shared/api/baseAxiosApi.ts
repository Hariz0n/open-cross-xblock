import axios from "axios";
import Cookies from "js-cookie";

const csrfToken = Cookies.get("csrftoken");

export const baseAxiosApi = axios.create({
  headers: {
    "X-Csrftoken": csrfToken,
  },
});
