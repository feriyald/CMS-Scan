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
    localStorage.setItem("versioningURL", config.API_URL_Versioning);
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

export const validateToken = async (token, menu) => {
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
    console.log(tokenResponse);
    if (menu.toUpperCase().includes("SCAN")) {
      localStorage.setItem("contractNo", tokenResponse.data.data.contractNo);
      localStorage.setItem("branchID", tokenResponse.data.data.branchID);
      localStorage.setItem("requestBy", tokenResponse.data.data.requestBy);
      localStorage.setItem("requestId", tokenResponse.data.data.requestId);

      if (tokenResponse.data.data.jenisColla == "1") {
        localStorage.setItem("jenisCola", "BPKB");
      } else if (tokenResponse.data.data.jenisColla == "2") {
        localStorage.setItem("jenisCola", "Faktur");
      } else if (tokenResponse.data.data.jenisColla == "3") {
        localStorage.setItem("jenisCola", "Invoice");
      }

      localStorage.setItem(
        "jenisTransaksi",
        tokenResponse.data.data.jenisTransaksi
      );

      localStorage.setItem(
        "policeNo",
        tokenResponse.data.data.dataColla.colaPoliceNo
      );

      localStorage.setItem(
        "alamat",
        tokenResponse.data.data.dataColla.colaAlamat
      );

      localStorage.setItem(
        "merk",
        tokenResponse.data.data.dataColla.colaBrandObject
      );

      localStorage.setItem(
        "CC",
        tokenResponse.data.data.dataColla.colaCapacity
      );

      localStorage.setItem(
        "warna",
        tokenResponse.data.data.dataColla.colaColour
      );

      localStorage.setItem(
        "tanggal",
        tokenResponse.data.data.dataColla.colaDate
      );

      localStorage.setItem(
        "noMesin",
        tokenResponse.data.data.dataColla.colaEngine
      );

      localStorage.setItem(
        "noFaktur",
        tokenResponse.data.data.dataColla.colaFakturNo
      );

      localStorage.setItem(
        "noRangka",
        tokenResponse.data.data.dataColla.colaFrame
      );

      localStorage.setItem(
        "issuer",
        tokenResponse.data.data.dataColla.colaIssuer
      );

      localStorage.setItem(
        "model",
        tokenResponse.data.data.dataColla.colaModelObject
      );

      localStorage.setItem("nama", tokenResponse.data.data.dataColla.colaName);

      localStorage.setItem(
        "noKolateral",
        tokenResponse.data.data.dataColla.colaNo
      );

      localStorage.setItem(
        "tanggalBerlakuKolateral",
        tokenResponse.data.data.dataColla.colaPeriod
      );

      localStorage.setItem(
        "type",
        tokenResponse.data.data.dataColla.colaTypeObject
      );

      localStorage.setItem("tahun", tokenResponse.data.data.dataColla.colaYear);
    } else if (menu.toUpperCase().includes("MASTER")) {
      localStorage.setItem("requestId", tokenResponse.data.data.requestId);
    }

    const username = tokenResponse.data.data.userNameAuth;
    var password = tokenResponse.data.data.passwordAuth;

    const key = CryptoJS.enc.Utf8.parse(localStorage.getItem("secretKey"));
    const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // IV (Initialization Vector)

    // Asumsikan encryptedText sudah dalam format base64
    const decrypted = CryptoJS.AES.decrypt(password, key, {
      iv,
    }).toString(CryptoJS.enc.Utf8);
    localStorage.setItem("password", decrypted);
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

    await LogUser(localStorage.getItem("requestBy"), true, 1, 0);
    return loginResponse;
  } catch (e) {
    await LogUser(localStorage.getItem("requestBy"), false, 0, 1);
    throw e;
  }
};

export async function getParameter(authToken) {
  try {
    const getParameter = await axios.get(
      `${localStorage.getItem("masterURL")}/api/parameter/get/ADIRAFIN`,
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    );

    localStorage.setItem(
      "maxSizeFileBpkb",
      getParameter.data.data.maxSizeFileBpkb
    );
    localStorage.setItem(
      "maxSizeFileFactureBpkb",
      getParameter.data.data.maxSizeFileFactureBpkb
    );
    localStorage.setItem(
      "confidenceLevel",
      getParameter.data.data.confidenceLevel
    );
    localStorage.setItem(
      "maxSizeFileInvoiceFacture",
      getParameter.data.data.maxSizeFileInvoiceFacture
    );
  } catch (e) {
    if (e.response && e.response.status === 401) {
      // Jika gagal karena 401, panggil API refresh token
      try {
        const refreshResponse = await axios.post(
          `${localStorage.getItem("authURL")}/api/auth/refresh`,
          "",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          }
        );
        localStorage.setItem("authToken", refreshResponse.data.data.token);
        localStorage.setItem("refreshToken", refreshResponse.data.data.refresh);

        // Panggil kembali Parameter API setelah refresh berhasil
        const getParameter = await axios.get(
          `${localStorage.getItem("masterURL")}/api/parameter/get/ADIRAFIN`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        localStorage.setItem(
          "maxSizeFileBpkb",
          getParameter.data.data.maxSizeFileBpkb
        );
        localStorage.setItem(
          "maxSizeFileFactureBpkb",
          getParameter.data.data.maxSizeFileFactureBpkb
        );
        localStorage.setItem(
          "confidenceLevel",
          getParameter.data.data.confidenceLevel
        );
        localStorage.setItem(
          "maxSizeFileInvoiceFacture",
          getParameter.data.data.maxSizeFileInvoiceFacture
        );
        return getParameter;
      } catch (e) {
        throw e;
      }
    } else {
      throw e;
    }
  }
}

export async function submitMaster(body) {
  try {
    const submit = await axios.post(
      `${localStorage.getItem("masterURL")}/api/parameter/save`,
      body,
      {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
          "Content-Type": `application/json`,
        },
      }
    );
    return submit;
  } catch (e) {
    if (!e.message.includes("401")) {
      return e;
    } else {
      axios
        .post(`${localStorage.getItem("authURL")}/api/auth/refresh`, "", {
          headers: {
            Authorization: `${localStorage.getItem("refreshToken")}`,
          },
        })
        .then((response) => {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("refreshToken", response.data.refresh);
          axios
            .post(
              `${localStorage.getItem("masterURL")}/api/parameter`,
              this.request,
              {
                headers: {
                  Authorization: `${localStorage.getItem("authToken")}`,
                  "Content-Type": `application/json`,
                },
              }
            )
            .then((response) => {
              return response;
            });
        })
        .catch((error) => {
          throw error;
        });
    }
  }
}

export async function Submit(formData, baseUrl, serviceTransaksi) {
  try {
    var URL = `${baseUrl}/api/${serviceTransaksi}/save`;
    const response = await axios.post(`${URL}`, formData, {
      headers: {
        Authorization: `${localStorage.getItem("authToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    await LogUser(localStorage.getItem("requestBy"), false, 0, 0);
    return response;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      // Jika gagal karena 401, panggil API refresh token
      try {
        const refreshResponse = await axios.post(
          `${localStorage.getItem("authURL")}/api/auth/refresh`,
          "",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          }
        );
        localStorage.setItem("authToken", refreshResponse.data.data.token);
        localStorage.setItem("refreshToken", refreshResponse.data.data.refresh);

        // Panggil kembali Parameter API setelah refresh berhasil
        var URL = `${localStorage.getItem("scanNewURL")}/api/scannew/save`;
        const response = await axios.post(`${URL}`, formData, {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        return response;
      } catch (e) {
        throw e;
      }
    } else {
      throw e;
    }
  }
}

export async function LogUser(User, Login, LoginCount, logonAttempt) {
  try {
    const body = {
      userNameLogin: User,
      isStillLogin: Login,
      loginCount: LoginCount,
      logonAttemptFailed: logonAttempt,
    };
    const logUser = await axios.post(
      `${localStorage.getItem("masterURL")}/api/loguser/save`,
      body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    console.log(logUser);
  } catch (e) {
    throw e;
  }
}
