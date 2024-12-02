/* eslint-disable */

import * as pdfjsLib from "pdfjs-dist/webpack";
import pdfWorker from "pdfjs-dist/build/pdf.worker.js";
import axios from "axios";
import { reactive, onMounted, setTransitionHooks } from "vue";
import { Submit } from "@/services/apiServices.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
export default {
  data() {
    return {
      act: "",
      baseUrl: "",
      confirmDialog: false,
      branchId: localStorage.getItem("branchId"),
      buttonText: "",
      contractNo: localStorage.getItem("contractNo"),
      dialog: false,
      errordialog: false,
      fieldMapping: {
        alamatPemilik: "alamat",
        isiSilinder: "isiSilinder",
        merekKendaraan: "merekKendaraan",
        modelKendaraan: "modelKendaraan",
        namaPemilik: "namaPemilik",
        noFaktur: "nomorFaktur",
        noMesin: "nomorMesin",
        noRangka: "nomorRangka",
        tahunPembuatan: "tahunPembuatan",
        warnaKendaraan: "warna",
        typeKendaraan: "typeKendaraan",
      },
      fileName: "",
      fileNameBPKB: "",
      fileNameFacture: "",
      idpBPKB: reactive({
        alamat: { confidenceLevel: 0, value: localStorage.getItem("alamat") },
        isiSilinder: { confidenceLevel: 0, value: localStorage.getItem("CC") },
        jenisKendaraan: { confidenceLevel: 0, value: "" },
        merekKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("merk"),
        },
        modelKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("model"),
        },
        namaPemilik: {
          confidenceLevel: 0,
          value: localStorage.getItem("nama"),
        },
        noBpkb: {
          confidenceLevel: 0,
          value: localStorage.getItem("noKolateral"),
        },
        nomorFaktur: {
          confidenceLevel: 0,
          value: localStorage.getItem("noFaktur"),
        },
        nomorMesin: {
          confidenceLevel: 0,
          value: localStorage.getItem("noMesin"),
        },
        nomorRangka: {
          confidenceLevel: 0,
          value: localStorage.getItem("noRangka"),
        },
        tahunPembuatan: {
          confidenceLevel: 0,
          value: localStorage.getItem("tahun"),
        },
        tanggalBPKB: {
          confidenceLevel: 0,
          value: localStorage.getItem("tanggal"),
        },
        typeKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("type"),
        },
        warna: { confidenceLevel: 0, value: localStorage.getItem("warna") },
      }),
      idpFaktur: reactive({
        alamatPemilik: {
          confidenceLevel: 0,
          value: localStorage.getItem("alamat"),
        },
        isiSilinder: { confidenceLevel: 0, value: localStorage.getItem("CC") },
        merekKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("merk"),
        },
        modelKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("model"),
        },
        namaPemilik: {
          confidenceLevel: 0,
          value: localStorage.getItem("nama"),
        },
        noFaktur: {
          confidenceLevel: 0,
          value: localStorage.getItem("noFaktur"),
        },
        noMesin: { confidenceLevel: 0, value: localStorage.getItem("noMesin") },
        noRangka: {
          confidenceLevel: 0,
          value: localStorage.getItem("noRangka"),
        },
        tahunPembuatan: {
          confidenceLevel: 0,
          value: localStorage.getItem("tahun"),
        },
        warnaKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("warna"),
        },
        typeKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("type"),
        },
        noKtpAtauTdpPemilik: {
          confidenceLevel: 0,
          value: localStorage.getItem("issuer"),
        },
      }),
      idpInvoice: reactive({
        alamatIdentitasPemilik: {
          confidenceLevel: 0,
          value: "-",
        },
        identitasPemilik: {
          confidenceLevel: 0,
          value: "-",
        },
        merekKendaraan: {
          confidenceLevel: 0,
          value: "-",
        },
        modelKendaraan: {
          confidenceLevel: 0,
          value: "-",
        },
        namaIdentitasPemilik: {
          confidenceLevel: 0,
          value: "-",
        },
        namaSuplier: {
          confidenceLevel: 0,
          value: "-",
        },
        noFaktur: {
          confidenceLevel: 0,
          value: "-",
        },
        noMesin: {
          confidenceLevel: 0,
          value: "-",
        },
        noMesin: {
          confidenceLevel: 0,
          value: "-",
        },
        noRangka: {
          confidenceLevel: 0,
          value: "-",
        },
        tahunPembuatan: {
          confidenceLevel: 0,
          value: "-",
        },
        tglInvoice: {
          confidenceLevel: 0,
          value: "-",
        },
        typeKendaraan: {
          confidenceLevel: 0,
          value: "-",
        },
        warnaKendaraan: {
          confidenceLevel: 0,
          value: "-",
        },
      }),
      jenisTransaksi: localStorage.getItem("jenisTransaksi"),
      isHidden: false,
      isLoading: false,
      page: 1,
      pdfLoaded: false,
      pdfSrc: "",
      policeNo:
        localStorage.getItem("policeNo") !== null
          ? localStorage.getItem("policeNo")
          : "",
      previewUrls: [],
      requestId: localStorage.getItem("requestId"),
      requestBy: localStorage.getItem("requestBy"),
      scannedDisplayed: [],
      scannedImages: [],
      scannedImagesFaktur: [],
      selectedImages: [],
      selectedFiles: [],
      selectedFilesFaktur: [],
      selectedmethod: "br",
      selectedRadio: "BPKB",
      serviceTransaksi: "",
      tipeKolateral: localStorage.getItem("jenisCola"),
      tglBerlaku: localStorage.getItem("tanggalBerlakuKolateral"),
      uploadMethod: [],
    };
  },
  mounted() {
    this.formBehaviour();

    this.websocket = new WebSocket("ws://localhost:8081/ws/");

    // Fungsi yang dipanggil ketika koneksi WebSocket terbuka
    this.websocket.onopen = () => {
      console.log("WebSocket connection established");
    };
    // Fungsi yang dipanggil ketika menerima pesan dari server
    this.websocket.onmessage = (event) => {
      this.receivedMessage = event.data; // Simpan pesan yang diterima

      if (this.receivedMessage.includes("Base64: ")) {
        this.receivedMessage = this.receivedMessage
          .replace("Base64: ", "")
          .trim();
        if (this.tipeKolateral == "BPKB") {
          if (this.selectedRadio == "BPKB") {
            this.scannedImages.push(this.receivedMessage);
            this.scannedDisplayed = this.scannedImages;
          } else if (this.selectedRadio.toLowerCase() == "faktur") {
            this.scannedImagesFaktur.push(this.receivedMessage);
            this.scannedDisplayed = this.scannedImagesFaktur;
          }
        } else {
          this.scannedImages.push(this.receivedMessage);
          this.scannedDisplayed = this.scannedImages;
        }
      }
    };

    // Fungsi yang dipanggil ketika WebSocket ditutup
    this.websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Fungsi yang dipanggil jika terjadi error
    this.websocket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };
  },
  methods: {
    formatDate(date) {
      const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`; // Formatkan menjadi YYYY-MM-DD
    },
    formBehaviour() {
      this.$refs.AreaRadioButton.hidden = true;
      if (this.tipeKolateral.toUpperCase() == "BPKB") {
        this.$refs.AreaRadioButton.hidden = false;
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

      if (this.jenisTransaksi == "1") {
        this.buttonText = "IDP";
        this.serviceTransaksi = "scannew";
        this.baseUrl = localStorage.getItem("scanNewURL");
      } else if (this.jenisTransaksi == "2") {
        this.buttonText = "Atur Berkas";
        this.$refs.idpButton.style.fontSize = "11px";
        this.serviceTransaksi = "scanversions";
        this.baseUrl = localStorage.getItem("versioningURL");
      }

      if (this.jenisTransaksi == "2") {
        this.isDisabled = !this.isDisabled;
      }
      if (
        this.idpBPKB.tanggalBPKB.value &&
        this.idpBPKB.tanggalBPKB.value.trim() !== ""
      ) {
        this.idpBPKB.tanggalBPKB.value = this.formatDate(
          this.idpBPKB.tanggalBPKB.value
        );
      }

      if (
        this.idpFaktur.tahunPembuatan.value &&
        this.idpFaktur.tahunPembuatan.value.trim() !== ""
      ) {
        this.idpFaktur.tahunPembuatan.value = this.formatDate(
          this.idpFaktur.tahunPembuatan.value
        );
      }

      if (this.tglBerlaku && this.tglBerlaku.trim() !== "") {
        this.tglBerlaku = this.formatDate(this.tglBerlaku);
      }
      const storedData = JSON.parse(localStorage.getItem("uploadSettings"));
      if (storedData) {
        this.uploadMethod = storedData;
      }
      this.selectedmethod = this.uploadMethod[0].value;
      if (this.selectedmethod.toUpperCase() == "BR") {
        this.$refs.scan.disabled = true;
        this.$refs.browse.disabled = false;
      } else {
        this.$refs.browse.disabled = true;
        this.$refs.scan.disabled = false;
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
        this.$refs.pdfCanvas.hidden = false;
      } else {
        this.$refs.browse.disabled = true;
        this.$refs.BrowseArea.style.backgroundColor = "grey";
        this.$refs.scan.disabled = false;
        this.$refs.scan.style.backgroundColor = "#ffd700";
        this.$refs.pdfCanvas.hidden = true;
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
          if (this.selectedRadio === "BPKB") {
            this.selectedFiles = event.target.files;
          } else {
            this.selectedFilesFaktur = event.target.files;
          }
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
      if (this.selectedmethod.toUpperCase() == "BR") {
        if (this.tipeKolateral === "BPKB") {
          if (this.selectedRadio === "BPKB") {
            // Hapus semua canvas dan reset state
            this.pdfPages = [];
            this.pdfUrl = null;
            this.$refs.pdfCanvas.innerHTML = ""; // Kosongkan elemen canvas
            this.selectedFiles = "";
          } else {
            // Hapus semua canvas dan reset state
            this.pdfPages = [];
            this.pdfUrl = null;
            this.$refs.pdfCanvas.innerHTML = ""; // Kosongkan elemen canvas
            this.selectedFilesFaktur = "";
          }
        } else {
          // Hapus semua canvas dan reset state
          this.pdfPages = [];
          this.pdfUrl = null;
          this.$refs.pdfCanvas.innerHTML = ""; // Kosongkan elemen canvas
          this.selectedFiles = "";
        }
      } else {
        if (this.selectedRadio === "BPKB") {
          this.scannedImages = this.scannedImages.filter(
            (_, index) => !this.selectedImages.includes(index)
          );
          this.scannedDisplayed = this.scannedImages.filter(
            (_, index) => !this.selectedImages.includes(index)
          );
          this.selectedImages = [];
        } else {
          this.scannedImagesFaktur = this.scannedImagesFaktur.filter(
            (_, index) => !this.selectedImages.includes(index)
          );
          this.scannedDisplayed = this.scannedDisplayed.filter(
            (_, index) => !this.selectedImages.includes(index)
          );
          this.selectedImages = [];
        }
        this.scannedImages = this.scannedImages.filter(
          (_, index) => !this.selectedImages.includes(index)
        );
        this.selectedImages = [];
      }
    },
    async idp() {
      this.isLoading = true;
      this.$refs.reviewSection.hidden = true;

      const formData = new FormData();
      formData.append("requestId", this.requestId);
      formData.append("fileType", this.tipeKolateral);
      formData.append("contractNo", this.contractNo);
      formData.append("requestBy", this.requestBy);

      var URL = "";
      var cont = false;
      if (this.selectedmethod.toUpperCase() == "BR") {
        if (this.selectedFiles.length > 0) {
          URL = `${this.baseUrl}/api/${this.serviceTransaksi}/idp/upload`;
          for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append("file", this.selectedFiles[i]);
          }
          cont = true;
        } else {
          cont = false;
          this.responseMessage = "Silahkan upload file terlebih dahulu !";
        }
      } else {
        if (this.scannedImages.length > 0) {
          URL = `${this.baseUrl}/api/${this.serviceTransaksi}/idp/scan`;
          for (let i = 0; i < this.scannedImages.length; i++) {
            const blob = this.convertBase64ToBlob(this.scannedImages[i]);

            formData.append("file", blob, `image${i}.png`);
          }
          cont = true;
        } else {
          cont = false;
          this.responseMessage = "Silahkan scan dokumen terlebih dahulu !";
        }
      }
      if (cont) {
        try {
          const response = await axios.post(`${URL}`, formData, {
            headers: {
              Authorization: `${localStorage.getItem("authToken")}`,
              "Content-Type": "multipart/form-data",
            },
          });
          if (this.jenisTransaksi == "1") {
            if (this.tipeKolateral.toLowerCase() == "bpkb") {
              this.fileNameBPKB = response.data.data.filename;
              this.fileNameFacture = `Faktur_BPKB_${this.contractNo}_V1.pdf`;
              Object.keys(this.idpBPKB).forEach((key) => {
                if (
                  this.idpBPKB[key] &&
                  response.data.data.idp.bpkbData[key].confidenceLevel
                ) {
                  this.idpBPKB[key].confidenceLevel =
                    parseFloat(
                      response.data.data.idp.bpkbData[key].confidenceLevel
                    ) * 100;
                  this.isHidden = true;

                  if (
                    this.idpBPKB[key].confidenceLevel <
                    localStorage.getItem("confidenceLevel")
                  ) {
                    this.changeColor(key + "BPKB", "Label");
                  }
                  this.idpBPKB[key].value =
                    response.data.data.idp.bpkbData[key].value;
                }
              });
            } else if (this.tipeKolateral.toLowerCase() == "faktur") {
              this.fileName = response.data.data.filename;
              Object.keys(this.idpFaktur).forEach((key) => {
                if (
                  this.idpFaktur[key] &&
                  response.data.data.idp.fakturKendaraanDTO[key].confidenceLevel
                ) {
                  this.idpFaktur[key].confidenceLevel =
                    parseFloat(
                      response.data.data.idp.fakturKendaraanDTO[key]
                        .confidenceLevel
                    ) * 100;
                  this.isHidden = true;

                  if (
                    this.idpFaktur[key].confidenceLevel <
                    localStorage.getItem("confidenceLevel")
                  ) {
                    console.log(key + "Faktur");
                    this.changeColor(key + "Faktur", "Label");
                  }

                  this.idpFaktur[key].value =
                    response.data.data.idp.fakturKendaraanDTO[key].value;
                }
              });

              this.syncData(this.idpBPKB, this.idpFaktur, this.fieldMapping);
            } else if (this.tipeKolateral.toLowerCase() == "invoice") {
              this.fileName = response.data.data.filename;
              Object.keys(this.idpInvoice).forEach((key) => {
                if (
                  this.idpInvoice[key] &&
                  response.data.data.idp.fakturHEDTO[key].confidenceLevel
                ) {
                  this.idpInvoice[key].confidenceLevel =
                    parseFloat(
                      response.data.data.idp.fakturHEDTO[key].confidenceLevel
                    ) * 100;
                  this.isHidden = true;

                  if (
                    this.idpInvoice[key].confidenceLevel <
                    localStorage.getItem("confidenceLevel")
                  ) {
                    console.log(key + "Faktur");
                    this.changeColor(key + "Faktur", "Label");
                  }

                  this.idpInvoice[key].value =
                    response.data.data.idp.fakturHEDTO[key].value;
                }
              });

              this.syncData(this.idpBPKB, this.idpInvoice, this.fieldMapping);
            }
          } else {
            if (this.tipeKolateral.toLowerCase() == "bpkb") {
              this.fileNameBPKB = response.data.data.filename;
              this.fileNameFacture = `Faktur_BPKB_${this.contractNo}_V1.pdf`;
            } else {
              this.fileName = response.data.data.filename;
            }
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
              localStorage.setItem(
                "authToken",
                refreshResponse.data.data.token
              );
              localStorage.setItem(
                "refreshToken",
                refreshResponse.data.data.refresh
              );

              // Panggil kembali Parameter API setelah refresh berhasil
              const response = await axios.post(`${URL}`, formData, {
                headers: {
                  Authorization: `${localStorage.getItem("authToken")}`,
                  "Content-Type": "multipart/form-data",
                },
              });
              if (this.tipeKolateral.toLowerCase() == "bpkb") {
                Object.keys(this.idpBPKB).forEach((key) => {
                  if (this.idpBPKB[key]) {
                    this.idpBPKB[key].confidenceLevel =
                      parseFloat(response.data.data.idp[key].confidenceLevel) *
                      100;
                    this.isHidden = true;

                    console.log(localStorage.getItem("confidenceLevel"));
                    console.log(response.data.data.idp[key].confidenceLevel);
                    if (
                      this.idpBPKB[key].confidenceLevel <
                      localStorage.getItem("confidenceLevel")
                    ) {
                      this.changeColor(key + "BPKB", "Label");
                    }
                    this.idpBPKB[key].value = response.data.data.idp[key].value;
                  }
                });
              } else if (this.tipeKolateral.toLowerCase() == "faktur") {
                Object.keys(this.idpFaktur).forEach((key) => {
                  if (this.idpFaktur[key]) {
                    this.idpFaktur[key].confidenceLevel =
                      parseFloat(response.data.data.idp[key].confidenceLevel) *
                      100;
                    this.isHidden = true;

                    if (
                      this.idpFaktur[key].confidenceLevel <
                      localStorage.getItem("confidenceLevel")
                    ) {
                      console.log(key + Faktur);
                      this.changeColor(key + "Faktur", "Label");
                    }
                    this.idpFaktur[key].value =
                      response.data.data.idp[key].value;
                  }
                });

                this.syncData(this.idpBPKB, this.idpFaktur, this.fieldMapping);
              }
            } catch (refreshError) {
              console.error("Error refreshing token:", refreshError);
            }
          } else {
            this.errordialog = true;
            this.responseMessage = error.message;
            console.log(error);
          }
        }
      } else {
        this.errordialog = true;
      }
      this.isLoading = false;
      this.$refs.reviewSection.hidden = false;
    },
    changeColor(key, type) {
      const refName = key;
      const elemen = this.$refs[refName];
      if (elemen) {
        if (type == "Label") {
          elemen.style.color = "red";
        } else {
          elemen.style.border = "2px solid red";
        }
      }
    },
    scan() {
      alert("A");
    },
    confirmSave() {
      this.confirmDialog = true;
      this.message = "Apakah Anda yakin ingin simpan data ?";
      this.act = "Save";
    },
    async handleSave() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
      const day = String(today.getDate()).padStart(2, "0");
      const jsonData = {
        address: this.idpBPKB.alamat.value,
        bpkbdate: this.idpBPKB.tanggalBPKB.value,
        bpkbname: this.idpBPKB.namaPemilik.value,
        bpkbno: this.idpBPKB.noBpkb.value,
        branchId: this.branchId,
        brand: this.idpBPKB.merekKendaraan.value,
        capacity: this.idpBPKB.isiSilinder.value,
        colour: this.idpBPKB.warna.value,
        contractno: this.contractNo,
        documentType: this.tipeKolateral,
        engineno: this.idpBPKB.nomorMesin.value,
        fakturdate: "",
        fakturname: this.idpFaktur.namaPemilik.value,
        fakturNo: this.idpFaktur.noFaktur.value,
        fileName: this.filename,
        fileNameBPKB: this.fileNameBPKB,
        fileNameFacture: this.fileNameFacture,
        frameno: this.idpBPKB.nomorRangka.value,
        invoicedate: "",
        invoiceName: "",
        invoiceNo: "",
        issuer: this.idpFaktur.noKtpAtauTdpPemilik.value,
        model: this.idpBPKB.modelKendaraan.value,
        period: this.tglBerlaku,
        policeno: this.policeNo,
        requestby: this.requestBy,
        requestdate: `${year}${month}${day}`,
        requestid: this.requestId,
        type: this.idpBPKB.typeKendaraan,
        version: "1",
        versionbpkb: "1",
        versionfaktur: "1",
      };

      var cont = true;

      if (this.jenisTransaksi == "1") {
        if (this.tipeKolateral.toUpperCase() == "BPKB") {
          cont = this.BPKBSubmitValidation();
          if (
            !this.fileNameBPKB &&
            this.fileNameBPKB.trim() !== "" &&
            !this.fileNameFacture &&
            this.fileNameFacture.trim() !== ""
          ) {
            cont = false;
            this.responseMessage = "Harap lakukan proses IDP terlebih dahulu!";
          }
        } else if (this.tipeKolateral.toUpperCase() == "FAKTUR") {
          cont = this.FAKTURSubmitValidation();
          if (!this.fileName && this.fileName.trim() !== "") {
            cont = false;
            this.responseMessage = "Harap lakukan proses IDP terlebih dahulu!";
          }
        } else if (this.tipeKolateral.toUpperCase() == "INVOICE") {
          // cont = this.FAKTURSubmitValidation();
          if (!this.fileName && this.fileName.trim() !== "") {
            cont = false;
            this.responseMessage = "Harap lakukan proses IDP terlebih dahulu!";
          }
        }
      } else {
        if (this.tipeKolateral.toUpperCase() == "BPKB") {
          if (
            !this.fileNameBPKB &&
            this.fileNameBPKB.trim() !== "" &&
            !this.fileNameFacture &&
            this.fileNameFacture.trim() !== ""
          ) {
            cont = false;
            this.responseMessage =
              "Harap lakukan proses Atur Berkas terlebih dahulu!";
          }
        } else if (this.tipeKolateral.toUpperCase() == "FAKTUR") {
          if (!this.fileName && this.fileName.trim() !== "") {
            cont = false;
            this.responseMessage =
              "Harap lakukan proses Atur Berkas terlebih dahulu!";
          }
        } else if (this.tipeKolateral.toUpperCase() == "INVOICE") {
          if (!this.fileName && this.fileName.trim() !== "") {
            cont = false;
            this.responseMessage =
              "Harap lakukan proses Atur Berkas terlebih dahulu!";
          }
        }
      }
      if (cont) {
        this.isLoading = true;
        this.$refs.reviewSection.hidden = true;
        try {
          const response = await Submit(
            jsonData,
            this.baseUrl,
            this.serviceTransaksi
          );

          // this.responseMessage = "Data " + response.data.message + " disimpan";
          // this.responseMessage2 = "Data " + response.data.message + " disimpan";

          if (this.tipeKolateral.toUpperCase() == "BPKB") {
            this.responseMessage = `${this.fileNameBPKB} ${this.fileNameFacture}`;
          } else {
            this.responseMessage = `${this.fileName}`;
          }

          this.confirmDialog = false;
          this.dialog = true;

          this.isLoading = false;
          this.$refs.reviewSection.hidden = false;
        } catch (error) {
          this.isLoading = false;
          this.$refs.reviewSection.hidden = false;

          this.errordialog = true;
          this.responseMessage = error.message;
          console.log(error);
        }
      } else {
        this.errordialog = true;
      }
    },
    action() {
      if (this.act.toUpperCase() == "SAVE") {
        this.handleSave();
      } else if (this.act.toUpperCase() == "DELETE") {
        this.deleteImage();
      }
      this.confirmDialog = false;
    },
    sendMessage() {
      this.message = "show_scanner_form";
      this.websocket.send(this.message); // Kirim pesan yang ada di input
      this.message = ""; // Kosongkan input setelah pesan dikirim
    },
    submitForm(base64String, filename) {
      const blob = this.convertBase64ToBlob(base64String);

      const formData = new FormData();
      formData.append("image", blob, filename + ".png");
    },
    convertBase64ToBlob(base64String) {
      const binary = atob(base64String); // Dekode base64 ke binary
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i)); // Konversi binary ke array byte
      }
      // Gunakan MIME type image/png untuk membuat Blob
      return new Blob([new Uint8Array(array)], { type: "image/png" });
    },
    syncData(idpTarget, idpSource, mapping) {
      for (const [sourceField, targetField] of Object.entries(mapping)) {
        if (idpSource[sourceField]) {
          idpTarget[targetField].value = idpSource[sourceField].value;
          idpTarget[targetField].confidenceLevel =
            idpSource[sourceField].confidenceLevel;

          if (
            idpTarget[targetField].confidenceLevel <
            localStorage.getItem("confidenceLevel")
          ) {
            this.changeColor(targetField + "BPKB", "Label");
          }
        }
      }
    },
    updateArray() {
      // Isi array berdasarkan nilai radio button
      if (this.selectedRadio === "BPKB") {
        if (this.selectedmethod.toUpperCase() == "BR") {
          if (this.selectedFiles.length > 0) {
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
            };
            fileReader.readAsDataURL(this.selectedFiles[0]);
          } else {
            this.$refs.pdfCanvas.innerHTML = "";
          }
        } else {
          this.scannedDisplayed = this.scannedImages;
        }
      } else if (this.selectedRadio === "Faktur") {
        if (this.selectedmethod.toUpperCase() == "BR") {
          if (this.selectedFilesFaktur.length > 0) {
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
            };
            fileReader.readAsDataURL(this.selectedFilesFaktur[0]);
          } else {
            this.$refs.pdfCanvas.innerHTML = "";
          }
        } else {
          this.scannedDisplayed = [];
          this.scannedDisplayed = this.scannedImagesFaktur;
        }
      }
    },
    doneSubmit() {
      localStorage.setItem(
        "errorMessage",
        "Proses selesai silahkan tutup halaman ini"
      );
      window.location.href = "/";
    },
    BPKBSubmitValidation() {
      var cont = true;
      if (!this.tglBerlaku) {
        this.changeColor("tglBerlaku", "Input");
        cont = false;
        this.responseMessage = "Harap lengkapi data terlebih dahulu!";
      }

      if (!this.policeNo) {
        this.changeColor("policeNo", "Input");
        cont = false;
        this.responseMessage = "Harap lengkapi data terlebih dahulu!";
      }

      if (!this.contractNo) {
        this.changeColor("contractNo", "Input");
        cont = false;
        this.responseMessage = "Harap lengkapi data terlebih dahulu!";
      }
      Object.keys(this.idpBPKB).forEach((key) => {
        if (this.idpBPKB[key]) {
          if (!this.idpBPKB[key].value) {
            this.changeColor(key, Input);
            cont = false;
            this.responseMessage = "Harap lengkapi data terlebih dahulu!";
          }

          if (
            this.idpBPKB[key].confidenceLevel <
            localStorage.getItem("confidenceLevel")
          ) {
            cont = false;
            this.responseMessage =
              "Level kepercayaan sama dengan atau dibawah batas minimum !";
          }
        }
      });
      return cont;
    },
    FAKTURSubmitValidation() {
      var cont = true;
      if (!this.tglBerlaku) {
        this.changeColor("tglBerlaku", "Input");
        cont = false;
        this.responseMessage = "Harap lengkapi data terlebih dahulu!";
      }

      if (!this.policeNo) {
        this.changeColor("policeNo", "Input");
        cont = false;
        this.responseMessage = "Harap lengkapi data terlebih dahulu!";
      }

      if (!this.contractNo) {
        this.changeColor("contractNo", "Input");
        cont = false;
        this.responseMessage = "Harap lengkapi data terlebih dahulu!";
      }
      Object.keys(this.idpFaktur).forEach((key) => {
        if (this.idpFaktur[key]) {
          if (!this.idpFaktur[key].value) {
            this.changeColor(key, "Input");
            cont = false;
            this.responseMessage = "Harap lengkapi data terlebih dahulu!";
          }

          if (
            this.idpFaktur[key].confidenceLevel <
            localStorage.getItem("confidenceLevel")
          ) {
            cont = false;
            this.responseMessage =
              "Level kepercayaan sama dengan atau dibawah batas minimum !";
          }
        }
      });
      return cont;
    },
  },
};
