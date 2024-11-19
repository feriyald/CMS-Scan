/* eslint-disable */

import * as pdfjsLib from "pdfjs-dist/webpack";
import pdfWorker from "pdfjs-dist/build/pdf.worker.js";
import axios from "axios";
import { reactive, onMounted } from "vue";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
export default {
  data() {
    return {
      tipeKolateral: "BPKB",
      isHidden: false,
      dialog: false,
      confirmDialog: false,
      errordialog: false,
      selectedFiles: [],
      previewUrls: [],
      uploadMethod: [],
      selectedmethod: "br",
      pdfSrc: "",
      page: 1,
      pdfLoaded: false,
      selectedFiles: [],
      idpBPKB: reactive({
        alamat: { confidenceLevel: 0, value: "" },
        isiSilinder: { confidenceLevel: 0, value: "" },
        jenisKendaraan: { confidenceLevel: 0, value: "" },
        merekKendaraan: { confidenceLevel: 0, value: "" },
        modelKendaraan: { confidenceLevel: 0, value: "" },
        namaPemilik: { confidenceLevel: 0, value: "" },
        noBpkb: { confidenceLevel: 0, value: "" },
        nomorFaktur: { confidenceLevel: 0, value: "" },
        nomorMesin: { confidenceLevel: 0, value: "" },
        nomorRangka: { confidenceLevel: 0, value: "" },
        tahunPembuatan: { confidenceLevel: 0, value: "" },
        tanggalBPKB: { confidenceLevel: 0, value: "" },
        typeKendaraan: { confidenceLevel: 0, value: "" },
        warna: { confidenceLevel: 0, value: "" },
      }),
      act: "",
    };
  },
  mounted() {
    this.formBehaviour();

    const storedData = JSON.parse(localStorage.getItem("uploadSettings"));
    if (storedData) {
      this.uploadMethod = storedData;
    }
    console.log(this.uploadMethod[0].value);
    this.selectedmethod = this.uploadMethod[0].value;
    if (this.selectedmethod.toUpperCase() == "BR") {
      this.$refs.scan.disabled = true;
      this.$refs.browse.disabled = false;
    } else {
      this.$refs.browse.disabled = true;
      this.$refs.scan.disabled = false;
    }
  },
  methods: {
    formBehaviour() {
      if (this.tipeKolateral.toUpperCase() == "BPKB") {
        this.$refs.AreaNamapdFaktur.hidden = true;
        this.$refs.AreaAlamatFaktur.hidden = true;
        this.$refs.AreaTglFaktur.hidden = true;
        this.$refs.AreaPenerbitFaktur.hidden = true;
        this.$refs.AreaAlamatFaktur.hidden = true;
        this.$refs.AreaNoInvoice.hidden = true;
        this.$refs.AreaTglInvoice.hidden = true;
        this.$refs.AreaNamapdInvoice.hidden = true;
        this.$refs.AreaAlamatInvoice.hidden = true;
        this.$refs.AreaPenerbitInvoice.hidden = true;
        this.$refs.AreaMasaBerlakuJaminanInvoice.hidden = true;
      } else if (this.tipeKolateral.toUpperCase() == "FAKTUR") {
        this.$refs.AreaNoPolisi.hidden = true;
        this.$refs.AreaNoBPKB.hidden = true;
        this.$refs.AreaTglBPKB.hidden = true;
        this.$refs.AreaKapasitas.hidden = true;
        this.$refs.AreaModel.hidden = true;
        this.$refs.AreaWarna.hidden = true;
        this.$refs.AreaNamapdBPKB.hidden = true;
        this.$refs.AreaAlamat.hidden = true;
        this.$refs.AreaNoInvoice.hidden = true;
        this.$refs.AreaTglInvoice.hidden = true;
        this.$refs.AreaNamapdInvoice.hidden = true;
        this.$refs.AreaAlamatInvoice.hidden = true;
        this.$refs.AreaPenerbitInvoice.hidden = true;
        this.$refs.AreaMasaBerlakuJaminanInvoice.hidden = true;
      } else if (this.tipeKolateral.toUpperCase() == "INVOICE") {
        this.$refs.AreaNoPolisi.hidden = true;
        this.$refs.AreaNoBPKB.hidden = true;
        this.$refs.AreaTglBPKB.hidden = true;
        this.$refs.AreaKapasitas.hidden = true;
        this.$refs.AreaModel.hidden = true;
        this.$refs.AreaWarna.hidden = true;
        this.$refs.AreaNamapdBPKB.hidden = true;
        this.$refs.AreaAlamat.hidden = true;
        this.$refs.AreaNamapdFaktur.hidden = true;
        this.$refs.AreaAlamatFaktur.hidden = true;
        this.$refs.AreaTglFaktur.hidden = true;
        this.$refs.AreaPenerbitFaktur.hidden = true;
        this.$refs.AreaNoFaktur.hidden = true;
        this.$refs.AreaMerek.hidden = true;
        this.$refs.AreaTipe.hidden = true;
        this.$refs.AreaTahunPembuatan.hidden = true;
        this.$refs.AreaMasaBerlakuJaminan.hidden = true;
        this.$refs.rightForm.style.width = "15%";
      }
    },
    upload() {
      this.$refs.browse.click();
    },
    methodChange() {
      if (this.selectedmethod.toLowerCase() == "br") {
        this.$refs.scan.disabled = true;
        this.$refs.scan.style.backgroundColor = "grey";
        this.$refs.browse.disabled = false;
        this.$refs.BrowseArea.style.backgroundColor = "transparent";
      } else {
        this.$refs.browse.disabled = true;
        this.$refs.BrowseArea.style.backgroundColor = "grey";
        this.$refs.scan.disabled = false;
        this.$refs.scan.style.backgroundColor = "#ffd700";
      }
    },
    handleCancel() {
      // Reset semua nilai
      this.levelKepercayaan = 0;
      this.ukuranBpkbUtama = 0;
      this.ukuranBpkb = 0;
      this.ukuranFaktur = 0;
    },
    onFileSelected(event) {
      try {
        if (event.target.files != null) {
          const file = event.target.files[0];
          this.selectedFiles = event.target.files;
          const fileReader = new FileReader();
          fileReader.onload = async (e) => {
            const base64String = e.target.result;
            const typedArray = new Uint8Array(
              atob(base64String.split(",")[1])
                .split("")
                .map((char) => char.charCodeAt(0))
            );

            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            const totalPages = pdf.numPages;

            // Hapus isi canvas sebelum menggambar halaman baru
            this.$refs.pdfCanvas.innerHTML = "";

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const scale = 0.6;
              const viewport = page.getViewport({ scale });

              // Buat elemen canvas untuk setiap halaman
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              this.$refs.pdfCanvas.appendChild(canvas); // Tambahkan canvas ke container

              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
              await page.render(renderContext).promise;
            }
            console.log(base64String);
          };
          fileReader.readAsDataURL(file);
        }
      } catch (error) {
        console.log(error);
      }
    },
    confirmDelete() {
      this.confirmDialog = true;
      this.message = "Apakah Anda yakin ingin menghapus file?";
      this.act = "Delete";
    },
    deleteImage() {
      // Hapus semua canvas dan reset state
      this.pdfPages = [];
      this.pdfUrl = null;
      this.$refs.pdfCanvas.innerHTML = ""; // Kosongkan elemen canvas
      this.selectedFiles = "";
    },
    async idp() {
      const formData = new FormData();
      formData.append("requestid", this.requestid);
      formData.append("type", this.tipeKolateral);

      // Append multiple files
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append("file", this.selectedFiles[i]);
      }

      try {
        const response = await axios.post(
          `${localStorage.getItem("scanNewURL")}/api/scannew/idp/upload`,
          formData,
          {
            headers: {
              Authorization: `${localStorage.getItem("authToken")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (this.tipeKolateral.toLowerCase() == "bpkb") {
          Object.keys(this.idpBPKB).forEach((key) => {
            if (this.idpBPKB[key]) {
              this.idpBPKB[key].confidenceLevel = parseFloat(
                response.data.data.idp[key].confidenceLevel
              );
              this.idpBPKB[key].value = response.data.data.idp[key].value;
            }
          });
          console.log(this.idpBPKB);
        }
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
            const response = await axios.post(
              `${localStorage.getItem("scanNewURL")}/api/scannew/idp/upload`,
              formData,
              {
                headers: {
                  Authorization: `${localStorage.getItem("authToken")}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            if (this.tipeKolateral.toLowerCase() == "bpkb") {
              Object.keys(this.idpBPKB).forEach((key) => {
                if (this.idpBPKB[key]) {
                  this.idpBPKB[key].confidenceLevel = parseFloat(
                    response.data.data.idp[key].confidenceLevel
                  );
                  this.idpBPKB[key].value = response.data.data.idp[key].value;
                }
              });
              console.log(this.idpBPKB);
            }
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            next("/"); // Redirect ke halaman root jika refresh gagal
          }
        } else {
          this.errordialog = true;
          this.responseMessage = error.message;
          console.log(error);
        }
      }
    },
    scan() {
      alert("A");
    },
    confirmSave() {
      this.confirmDialog = true;
      this.message = "Apakah Anda yakin ingin menyimpan data ?";
      this.act = "Save";
    },
    handleSave() {
      if (this.selectedmethod.toLowerCase() == "br") {
      } else {
      }
    },
    action() {
      if (this.act.toUpperCase() == "SAVE") {
        this.confirmSave();
      } else if (this.act.toUpperCase() == "DELETE") {
        this.deleteImage();
      }
      this.confirmDialog = false;
    },
  },
};
