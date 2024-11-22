/* eslint-disable */
import axios from "axios";
import CryptoJS from "crypto-js";

export const getConfig = async () => {
  try {
    const configResponse = await axios.get("/config.json");
    const config = configResponse.data;
    localStorage.setItem("authURL", config.API_URL_Auth);
    localStorage.setItem("masterURL", config.API_URL_Master);
    localStorage.setItem("scanNewURL", config.API_URL_ScanNew);
    localStorage.setItem("secretKey", config.SECRET_KEY);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getSecretKey = async () => {
  const body = {
    variable: "TOKEN_SECRET",
  };
  const getMethod = await axios.post(
    `${localStorage.getItem("masterURL")}/api/comgen/get`,
    body,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );
  localStorage.setItem("secretKey", JSON.stringify(getMethod.data.data));
};

export const validateToken = async (token) => {
  try {
    const tokenResponse = await axios.post(
      `${localStorage.getItem("authURL")}/api/auth/validation`,
      "",
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    const username = tokenResponse.data.data.userNameAuth;
    var password = tokenResponse.data.data.passwordAuth;
    localStorage.setItem("contractNo", tokenResponse.data.data.contractNo);
    localStorage.setItem("branchID", tokenResponse.data.data.branchID);
    localStorage.setItem("requestBy", tokenResponse.data.data.requestBy);
    if (tokenResponse.data.data.jenisCola == "1") {
      localStorage.setItem("jenisCola", "BPKB");
    } else if (tokenResponse.data.data.jenisCola == "2") {
      localStorage.setItem("jenisCola", "Faktur");
    } else if (tokenResponse.data.data.jenisCola == "3") {
      localStorage.setItem("jenisCola", "Invoice");
    }
    localStorage.setItem("policeNo", tokenResponse.data.data.colaPoliceNo);
    // localStorage.setItem("policeNo",tokenResponse.data.data.colaPoliceNo);
    const key = CryptoJS.enc.Utf8.parse(localStorage.getItem("secretKey"));
    const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // IV (Initialization Vector)

    // Asumsikan encryptedText sudah dalam format base64
    const decrypted = CryptoJS.AES.decrypt(password, key, {
      iv,
    }).toString(CryptoJS.enc.Utf8);
    localStorage.setItem("password", decrypted);
    console.log(decrypted);
    localStorage.setItem(
      "auth",
      "Basic " + window.btoa(`${username}:${localStorage.getItem("password")}`)
    );
  } catch (e) {
    throw e;
  }
};

export const generateToken = async (authToken) => {
  try {
    const loginResponse = await axios.post(
      `${localStorage.getItem("authURL")}/api/auth/login`,
      "",
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    );
    localStorage.setItem("authToken", loginResponse.data.data.token);
    localStorage.setItem("refreshToken", loginResponse.data.data.refresh);
  } catch (e) {
    throw e;
  }
};
