/* eslint-disable */
import axios from "axios";
export default {
  name: "Master Parameter",
  data() {
    return {
      jsonData: {},
      levelKepercayaan: localStorage.getItem("confidenceLevel"),
      ukuranBpkbUtama: localStorage.getItem("maxSizeFileBpkb"),
      ukuranBpkb: localStorage.getItem("maxSizeFileFactureBpkb"),
      ukuranFaktur: localStorage.getItem("maxSizeFileInvoiceFacture"),
      dialog: false,
      errordialog: false,
      request: {},
      auth: "",
      message: "",
      token: localStorage.getItem("authToken"),
      config: {},
      authurl: "",
      masterurl: "",
      responseMessage: "",
      confirmDialog: false,
      newTab: null,
      submitResult: "",
    };
  },
  mounted() {
    // const data = this.$route.query.data;
    // if (data) {
    //   this.jsonData = JSON.parse(data);
    //   this.levelKepercayaan = this.jsonData.token;
    //   // this.ukuranBpkbUtama = this.jsonData.ukuranBpkbUtama;
    //   // this.ukuranBpkb = this.jsonData.ukuranBpkb;
    //   // this.ukuranFaktur = this.jsonData.ukuranFaktur;
    //   console.log(this.levelKepercayaan);
    // }
  },
  methods: {
    allowOnlyNumbers(event) {
      const charCode = event.keyCode ? event.keyCode : event.which;
      // Hanya izinkan angka 0-9
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    handleCancel() {
      this.levelKepercayaan = localStorage.getItem("confidenceLevel");
      this.ukuranBpkbUtama = localStorage.getItem("maxSizeFileBpkb");
      this.ukuranBpkb = localStorage.getItem("maxSizeFileFactureBpkb");
      this.ukuranFaktur = localStorage.getItem("maxSizeFileInvoiceFacture");
      this.errorMessage = {};
    },
    confirmation() {
      if (
        !this.levelKepercayaan ||
        !this.ukuranBpkbUtama ||
        !this.ukuranBpkb ||
        !this.ukuranFaktur
      ) {
        this.errordialog = true;
        this.responseMessage = "Harap lengkapi data !";
      } else {
        this.confirmDialog = true;
        this.message = "Apakah Anda yakin ingin melakukan perubahan data ?";
      }
    },
    handleSave() {
      this.request = {
        corporateId: "ADIRAFIN",
        maxSizeFileBpkb: this.ukuranBpkbUtama,
        maxSizeFileInvoiceFacture: this.ukuranFaktur,
        maxSizeFileFactureBpkb: this.ukuranFaktur,
        confidenceLevel: this.levelKepercayaan,
        requestId: "Vue",
      };
      axios
        .post(
          `${localStorage.getItem("masterURL")}/api/parameter/save`,
          this.request,
          {
            headers: {
              Authorization: `${localStorage.getItem("authToken")}`,
              "Content-Type": `application/json`,
            },
          }
        )
        .then((response) => {
          if (response.data.status == 200) {
            this.submitResult = response.data.status;
            this.responseMessage = "Proses " + response.data.message;
            this.confirmDialog = false;
            this.dialog = true;
          }
        })
        .catch((error) => {
          if (!error.message.includes("401")) {
            this.confirmDialog = false;
            this.errordialog = true;
            this.errorMessage = JSON.parse(error.request.response);
            this.responseMessage = this.errorMessage.message;
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
                    if (response.data.status == 200) {
                      this.submitResult = response.data.status;
                      this.responseMessage = "Proses " + response.data.message;
                      this.confirmDialog = false;
                      this.dialog = true;
                    }
                  });
              })
              .catch((error) => {
                console.log("Error:", error);
              });
          }
        });
    },
    doneSubmit() {
      localStorage.clear();
      localStorage.setItem(
        "errorMessage",
        "Proses selesai silahkan tutup halaman ini"
      );
      window.location.href = "/";
    },
  },
};
