/* eslint-disable */
import { createRouter, createWebHistory } from "vue-router";
import MasterParam from "../components/MasterParamPage/MasterParamPage.vue";
import ScanPage from "../components/ScanPage/ScanPage.vue";
import UploadPage from "../components/UploadPage/UploadPage.vue";
import helloworld from "../components/HelloWorld.vue";
import blank from "../components/BlankPage.vue";
import axios from "axios";
import {
  getConfig,
  getSecretKey,
  validateToken,
  generateToken,
} from "../services/apiServices.js";

const routes = [
  {
    path: "/MasterPage",
    name: "MasterParameter",
    component: MasterParam,
    meta: { requiresAuth: true, title: "Master Parameter" },
  },
  {
    path: "/ScanPage",
    name: "ScanPage",
    component: ScanPage,
    meta: { requiresAuth: true, title: "Scan Page" },
  },
  {
    path: "/",
    name: "blank",
    component: blank,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

localStorage.setItem("ErrorMessage", "");

localStorage.clear();
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || "Default Title";
  // const favicon = document.querySelector("link[rel~='icon']");
  // if (favicon) {
  //   // Ganti URL favicon di sini
  //   favicon.href = to.meta.favicon || "/favicon.ico"; // gunakan default favicon jika tidak ada meta favicon
  // }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    localStorage.setItem("errorMessage", "");

    try {
      try {
        await getConfig();
        await validateToken("123123");
        await generateToken(localStorage.getItem("auth"));

        const getParameter = await axios.get(
          `${localStorage.getItem("masterURL")}/api/parameter/get/ADIRAFIN`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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

        if (to.fullPath.toUpperCase() == "/SCANPAGE") {
          const body = {
            variable: "UPLOAD_TYPE_%",
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
          localStorage.setItem(
            "uploadSettings",
            JSON.stringify(getMethod.data.data)
          );
        }
        next(); // Jika API berhasil, lanjutkan ke halaman tujuan
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          // Jika gagal karena 401, panggil API refresh token
          try {
            const refreshResponse = await axios.post(
              `${localStorage.getItem("authURL")}/api/auth/refresh`,
              "",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "refreshToken"
                  )}`,
                },
              }
            );
            localStorage.setItem("authToken", refreshResponse.data.data.token);
            localStorage.setItem(
              "refreshToken",
              refreshResponse.data.data.refresh
            );

            // Panggil kembali Parameter API setelah refresh berhasil
            await axios.get(
              `${localStorage.getItem("masterURL")}/api/parameter/ADIRAFIN`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );

            next(); // Jika berhasil refresh, lanjutkan ke halaman tujuan
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            next("/"); // Redirect ke halaman root jika refresh gagal
          }
        } else {
          console.error("Error in parameter API call:", error);
          localStorage.setItem(
            "errorMessage",
            "Error in parameter API call :" + error
          );
          next("/"); // Redirect ke halaman root jika error selain 401
        }
      }
    } catch (loginError) {
      console.error("Login Error:", loginError);
      localStorage.setItem("errorMessage", "Auth Error : " + loginError);
      next("/"); // Redirect ke halaman root jika login gagal
    }
  } else {
    next(); // Jika route tidak membutuhkan auth, lanjutkan ke halaman tujuan
  }
});

export default router;
