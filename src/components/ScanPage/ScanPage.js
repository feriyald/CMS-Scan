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
        tanggalFaktur: {
          confidenceLevel: 80,
          value: "",
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
          value: localStorage.getItem("alamat"),
        },
        identitasPemilik: {
          confidenceLevel: 0,
          value: "-",
        },
        merekKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("merk"),
        },
        modelKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("model"),
        },
        namaIdentitasPemilik: {
          confidenceLevel: 0,
          value: localStorage.getItem("nama"),
        },
        namaSuplier: {
          confidenceLevel: 0,
          value: localStorage.getItem("issuer"),
        },
        noFaktur: {
          confidenceLevel: 0,
          value: localStorage.getItem("noKolateral"),
        },
        noMesin: {
          confidenceLevel: 0,
          value: localStorage.getItem("noMesin"),
        },
        noMesin: {
          confidenceLevel: 0,
          value: localStorage.getItem("noMesin"),
        },
        noRangka: {
          confidenceLevel: 0,
          value: localStorage.getItem("noRangka"),
        },
        tahunPembuatan: {
          confidenceLevel: 0,
          value: localStorage.getItem("tahun"),
        },
        tglInvoice: {
          confidenceLevel: 0,
          value: localStorage.getItem("tanggal"),
        },
        typeKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("type"),
        },
        warnaKendaraan: {
          confidenceLevel: 0,
          value: localStorage.getItem("warna"),
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
      port: localStorage.getItem("port"),
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
  computed: {
    alamatModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.alamat.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.alamatPemilik.value;
        } else {
          return this.idpInvoice.alamatIdentitasPemilik.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.alamat.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.alamatPemilik.value = value;
        } else {
          this.idpInvoice.alamatIdentitasPemilik.value = value;
        }
      },
    },
    alamatCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.alamat.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.alamatPemilik.confidenceLevel;
        } else {
          return this.idpInvoice.alamatIdentitasPemilik.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.alamat.confidenceLevel = confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.alamatPemilik.confidenceLevel = value;
        } else {
          this.idpInvoice.alamatIdentitasPemilik.confidenceLevel = value;
        }
      },
    },
    isiSilinderModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.isiSilinder.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.isiSilinder.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.isiSilinder.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.isiSilinder.value = value;
        }
      },
    },
    isiSilinderCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.isiSilinder.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.isiSilinder.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.isiSilinder.confidenceLevel = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.isiSilinder.confidenceLevel = value;
        }
      },
    },
    merkKendaraanModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.merekKendaraan.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.merekKendaraan.value;
        } else {
          return this.idpInvoice.merekKendaraan.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.merekKendaraan.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.merekKendaraan.value = value;
        } else {
          this.idpInvoice.merekKendaraan.value = value;
        }
      },
    },
    merkKendaraanCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.merekKendaraan.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.merekKendaraan.confidenceLevel;
        } else {
          return this.idpInvoice.merekKendaraan.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.merekKendaraan.confidenceLevel = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.merekKendaraan.confidenceLevel = value;
        } else {
          this.idpInvoice.merekKendaraan.confidenceLevel = value;
        }
      },
    },
    modelKendaraanModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.modelKendaraan.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.modelKendaraan.value;
        } else {
          return this.idpInvoice.modelKendaraan.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.modelKendaraan.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.modelKendaraan.value = value;
        } else {
          this.idpInvoice.modelKendaraan.value = value;
        }
      },
    },
    modelKendaraanCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.modelKendaraan.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.modelKendaraan.confidenceLevel;
        } else {
          return this.idpInvoice.modelKendaraan.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.modelKendaraan.confidenceLevel = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.modelKendaraan.confidenceLevel = value;
        } else {
          this.idpInvoice.modelKendaraan.confidenceLevel = value;
        }
      },
    },
    namaPemilikModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.namaPemilik.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.namaPemilik.value;
        } else {
          return this.idpInvoice.namaIdentitasPemilik.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.namaPemilik.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.namaPemilik.value = value;
        } else {
          this.idpInvoice.namaIdentitasPemilik.value = value;
        }
      },
    },
    namaPemilikCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.namaPemilik.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.namaPemilik.confidenceLevel;
        } else {
          return this.idpInvoice.namaIdentitasPemilik.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.namaPemilik.confidenceLevel = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.namaPemilik.confidenceLevel = value;
        } else {
          this.idpInvoice.namaIdentitasPemilik.confidenceLevel = value;
        }
      },
    },
    nomorFakturModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.nomorFaktur.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.noFaktur.value;
        } else {
          return this.idpInvoice.noFaktur.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.nomorFaktur.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.noFaktur.value = value;
        } else {
          this.idpInvoice.noFaktur.value = value;
        }
      },
    },
    nomorFakturCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.nomorFaktur.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.noFaktur.confidenceLevel;
        } else {
          return this.idpInvoice.noFaktur.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.nomorFaktur.confidenceLevel = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.noFaktur.confidenceLevel = value;
        } else {
          this.idpInvoice.noFaktur.confidenceLevel = value;
        }
      },
    },
    nomorMesinModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.nomorMesin.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.noMesin.value;
        } else {
          return this.idpInvoice.noMesin.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.nomorMesin.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.noMesin.value = value;
        } else {
          this.idpInvoice.noMesin.value = value;
        }
      },
    },
    nomorMesinCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.nomorMesin.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.noMesin.confidenceLevel;
        } else {
          return this.idpInvoice.noMesin.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.nomorMesin.confidenceLevel = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.noMesin.confidenceLevel = value;
        } else {
          this.idpInvoice.noMesin.confidenceLevel = value;
        }
      },
    },
    nomorRangkaModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.nomorRangka.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.noRangka.value;
        } else {
          return this.idpInvoice.noRangka.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.nomorRangka.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.noRangka.value = value;
        } else {
          this.idpInvoice.noRangka.value = value;
        }
      },
    },
    nomorRangkaCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.nomorRangka.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.noRangka.confidenceLevel;
        } else {
          return this.idpInvoice.noRangka.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.nomorRangka.confidenceLevel = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.noRangka.confidenceLevel = value;
        } else {
          this.idpInvoice.noRangka.confidenceLevel = value;
        }
      },
    },
    tahunPembuatanModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.tahunPembuatan.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.tahunPembuatan.value;
        } else {
          return this.idpInvoice.tahunPembuatan.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.tahunPembuatan.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.tahunPembuatan.value = value;
        } else {
          this.idpInvoice.tahunPembuatan.value = value;
        }
      },
    },
    tahunPembuatanCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.tahunPembuatan.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.tahunPembuatan.confidenceLevel;
        } else {
          return this.idpInvoice.tahunPembuatan.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.tahunPembuatan.confidenceLevel = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.tahunPembuatan.confidenceLevel = value;
        } else {
          this.idpInvoice.tahunPembuatan.confidenceLevel = value;
        }
      },
    },
    typeKendaraanModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.typeKendaraan.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.typeKendaraan.value;
        } else {
          return this.idpInvoice.typeKendaraan.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.typeKendaraan.value = value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.typeKendaraan.value = value;
        } else {
          this.idpInvoice.typeKendaraan.value = value;
        }
      },
    },
    typeKendaraanCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.typeKendaraan.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.typeKendaraan.confidenceLevel;
        } else {
          return this.idpInvoice.typeKendaraan.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.typeKendaraan.value = confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          this.idpFaktur.typeKendaraan.value = confidenceLevel;
        } else {
          this.idpInvoice.typeKendaraan.value = confidenceLevel;
        }
      },
    },
    warnaModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.warna.value;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.warnaKendaraan.value;
        } else {
          return this.idpInvoice.warnaKendaraan.value;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.warna.value = value;
        } else if (this.tipeKolateral === "FAKTUR") {
          this.idpFaktur.warnaKendaraan.value = value;
        } else {
          this.idpInvoice.warnaKendaraan.value = value;
        }
      },
    },
    warnaCLModel: {
      get() {
        if (this.tipeKolateral === "BPKB") {
          return this.idpBPKB.warna.confidenceLevel;
        } else if (this.tipeKolateral.toUpperCase() === "FAKTUR") {
          return this.idpFaktur.warnaKendaraan.confidenceLevel;
        } else {
          return this.idpInvoice.warnaKendaraan.confidenceLevel;
        }
      },
      set(value) {
        if (this.tipeKolateral === "BPKB") {
          this.idpBPKB.warna.confidenceLevel = value;
        } else if (this.tipeKolateral === "FAKTUR") {
          this.idpFaktur.warnaKendaraan.confidenceLevel = value;
        } else {
          this.idpInvoice.warnaKendaraan.confidenceLevel = value;
        }
      },
    },
  },
  mounted() {
    this.formBehaviour();

    this.websocket = new WebSocket(`ws://localhost:${this.port}/ws/`);

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

            if (this.tipeKolateral == "BPKB") {
              this.$refs.rbBPKB.disabled = true;
              this.$refs.rbFaktur.disabled = true;
            }
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

            if (this.tipeKolateral == "BPKB") {
              this.$refs.rbBPKB.disabled = false;
              this.$refs.rbFaktur.disabled = false;
            }
          };
          fileReader.readAsDataURL(file);
        }
      } catch (error) {
        console.log(error);
      }
      if (this.tipeKolateral == "BPKB") {
        this.$refs.rbBPKB.disabled = false;
        this.$refs.rbFaktur.disabled = false;
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
            this.$refs.browse.value = null;
          } else {
            // Hapus semua canvas dan reset state
            this.pdfPages = [];
            this.pdfUrl = null;
            this.$refs.pdfCanvas.innerHTML = ""; // Kosongkan elemen canvas
            this.selectedFilesFaktur = "";
            this.$refs.browse.value = null;
          }
        } else {
          // Hapus semua canvas dan reset state
          this.pdfPages = [];
          this.pdfUrl = null;
          this.$refs.pdfCanvas.innerHTML = ""; // Kosongkan elemen canvas
          this.selectedFiles = "";
          this.$refs.browse.value = null;
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

      const fakturformData = new FormData();
      const formData = new FormData();
      formData.append("requestId", this.requestId);
      formData.append("fileType", this.tipeKolateral);
      formData.append("contractNo", this.contractNo);
      formData.append("requestBy", this.requestBy);

      var URL = "";
      var cont = true;
      if (this.selectedmethod.toUpperCase() == "BR") {
        //periksa file
        if (this.selectedFiles.length > 0) {
          URL = `${this.baseUrl}/api/${this.serviceTransaksi}/idp/upload`;
          for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append("file", this.selectedFiles[i]);
          }

          //jika tipe kolatereal adalah BPKB masuk ke proses periksa file faktur bpkb
          if (this.tipeKolateral.toUpperCase() == "BPKB") {
            if (this.selectedFilesFaktur.length < 1) {
              cont = false;
              this.responseMessage =
                "Silahkan upload file faktur terlebih dahulu !";
            } else {
              for (let i = 0; i < this.selectedFilesFaktur.length; i++) {
                fakturformData.append("file", this.selectedFilesFaktur[i]);
              }
              cont = true;
            }
          }
        } else {
          cont = false;
          this.responseMessage = "Silahkan upload file terlebih dahulu !";
        }
      } else {
        //periksa file
        if (this.scannedImages.length > 0) {
          URL = `${this.baseUrl}/api/${this.serviceTransaksi}/idp/scan`;
          for (let i = 0; i < this.scannedImages.length; i++) {
            const blob = this.convertBase64ToBlob(this.scannedImages[i]);

            formData.append("file", blob, `image${i}.png`);
          }

          //jika tipe kolatereal adalah BPKB masuk ke proses periksa file faktur bpkb
          if (this.tipeKolateral.toUpperCase() == "BPKB") {
            if (this.scannedImagesFaktur.length < 1) {
              cont = false;
              this.responseMessage =
                "Silahkan scan file faktur terlebih dahulu !";
            } else {
              for (let i = 0; i < this.scannedImagesFaktur.length; i++) {
                formData.append("file", this.scannedImagesFaktur[i]);
              }
              cont = true;
            }
          }
        } else {
          cont = false;
          this.responseMessage = "Silahkan scan dokumen terlebih dahulu !";
        }
      }
      //setelah lolos validasi
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

              fakturformData.append("requestId", this.requestId);
              fakturformData.append("fileType", "FakturBPKB");
              fakturformData.append("contractNo", this.contractNo);
              fakturformData.append("requestBy", this.requestBy);
              const fakturBPKB = await axios.post(`${URL}`, formData, {
                headers: {
                  Authorization: `${localStorage.getItem("authToken")}`,
                  "Content-Type": "multipart/form-data",
                },
              });
              this.fileNameFacture = fakturBPKB.data.data.filename;

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
                    this.changeColor("Label" + key + "BPKB", "Label");
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
                  response.data.data.idp.fakturKendaraanDTO[key]
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
                    this.changeColor(key + "Faktur", "Label");
                  }

                  this.idpFaktur[key].value =
                    response.data.data.idp.fakturKendaraanDTO[key].value;
                }
              });
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
                    this.changeColor(key + "Invoice", "Label");
                  }

                  this.idpInvoice[key].value =
                    response.data.data.idp.fakturHEDTO[key].value;
                }
              });
            }
          } else {
            if (this.tipeKolateral.toLowerCase() == "bpkb") {
              this.fileNameBPKB = response.data.data.filename;
              fakturformData.append("requestId", this.requestId);
              fakturformData.append("fileType", "FakturBPKB");
              fakturformData.append("contractNo", this.contractNo);
              fakturformData.append("requestBy", this.requestBy);
              const fakturBPKB = await axios.post(`${URL}`, formData, {
                headers: {
                  Authorization: `${localStorage.getItem("authToken")}`,
                  "Content-Type": "multipart/form-data",
                },
              });
              this.fileNameFacture = fakturBPKB.data.data.filename;
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
              if (this.jenisTransaksi == "1") {
                if (this.tipeKolateral.toLowerCase() == "bpkb") {
                  this.fileNameBPKB = response.data.data.filename;

                  fakturformData.append("requestId", this.requestId);
                  fakturformData.append("fileType", "FakturBPKB");
                  fakturformData.append("contractNo", this.contractNo);
                  fakturformData.append("requestBy", this.requestBy);
                  const fakturBPKB = await axios.post(`${URL}`, formData, {
                    headers: {
                      Authorization: `${localStorage.getItem("authToken")}`,
                      "Content-Type": "multipart/form-data",
                    },
                  });
                  this.fileNameFacture = fakturformData.data.data.filename;

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
                      response.data.data.idp.fakturKendaraanDTO[key]
                        .confidenceLevel
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
                        this.changeColor(key + "Faktur", "Label");
                      }

                      this.idpFaktur[key].value =
                        response.data.data.idp.fakturKendaraanDTO[key].value;
                    }
                  });

                  this.syncData(
                    this.idpBPKB,
                    this.idpFaktur,
                    this.fieldMapping
                  );
                } else if (this.tipeKolateral.toLowerCase() == "invoice") {
                  this.fileName = response.data.data.filename;
                  Object.keys(this.idpInvoice).forEach((key) => {
                    if (
                      this.idpInvoice[key] &&
                      response.data.data.idp.fakturHEDTO[key].confidenceLevel
                    ) {
                      this.idpInvoice[key].confidenceLevel =
                        parseFloat(
                          response.data.data.idp.fakturHEDTO[key]
                            .confidenceLevel
                        ) * 100;
                      this.isHidden = true;

                      if (
                        this.idpInvoice[key].confidenceLevel <
                        localStorage.getItem("confidenceLevel")
                      ) {
                        this.changeColor(key + "Invoice", "Label");
                      }

                      this.idpInvoice[key].value =
                        response.data.data.idp.fakturHEDTO[key].value;
                    }
                  });

                  this.syncData(
                    this.idpBPKB,
                    this.idpInvoice,
                    this.fieldMapping
                  );
                }
              } else {
                if (this.tipeKolateral.toLowerCase() == "bpkb") {
                  this.fileNameBPKB = response.data.data.filename;
                  this.fileNameFacture = `Faktur_BPKB_${this.contractNo}_V1.pdf`;
                } else {
                  this.fileName = response.data.data.filename;
                }
              }
            } catch (refreshError) {
              console.error("Error refreshing token:", refreshError);
            }
          } else {
            this.errordialog = true;
            this.responseMessage = error.response.data.message;
          }
        }
      } else {
        this.errordialog = true;
      }
      this.isLoading = false;
      this.$refs.reviewSection.hidden = false;
    },
    changeColor(key, type) {
      var refName = key;
      const elemen = this.$refs[refName];
      if (elemen) {
        if (type == "Label") {
          elemen.style.color = "red";
        } else {
          elemen.style.border = "2px solid red";
        }
      } else {
        if (refName.includes("noMesin")) {
          refName = "nomorMesin";
        }
        if (refName.includes("noRangka")) {
          refName = "nomorRangka";
        }
        if (refName.includes("warnaKendaraan")) {
          refName = "warna";
        }

        if (this.tipeKolateral == "BPKB") {
          refName = refName.replace("BPKB", "");
          const elemen = this.$refs[refName];
          if (elemen) {
            if (type == "Label") {
              elemen.style.color = "red";
            } else {
              elemen.style.border = "2px solid red";
            }
          }
        } else if (this.tipeKolateral.toUpperCase() == "FAKTUR") {
          refName = refName.replace("Faktur", "");
          const elemen = this.$refs[refName];
          if (elemen) {
            if (type == "Label") {
              elemen.style.color = "red";
            } else {
              elemen.style.border = "2px solid red";
            }
          }
        } else {
          refName = refName.replace("Invoice", "");
          const elemen = this.$refs[refName];
          if (elemen) {
            if (type == "Label") {
              elemen.style.color = "red";
            } else {
              elemen.style.border = "2px solid red";
            }
          }
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
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      const seconds = String(today.getSeconds()).padStart(2, "0");
      const jsonData = {
        address: this.alamatModel,
        bpkbDate: this.idpBPKB.tanggalBPKB.value,
        bpkbName: this.idpBPKB.namaPemilik.value,
        bpkbNo: this.idpBPKB.noBpkb.value,
        branchId: this.branchId,
        brand: this.merkKendaraanModel,
        capacity: this.isiSilinderModel,
        colour: this.warnaModel,
        contractNo: this.contractNo,
        documentType: this.tipeKolateral,
        engineNo: this.nomorMesinModel,
        fakturDate: this.idpFaktur.tanggalFaktur.value,
        fakturName: this.idpFaktur.namaPemilik.value,
        fakturNo: this.idpFaktur.noFaktur.value,
        fileName: this.fileName,
        fileNameBPKB: this.fileNameBPKB,
        fileNameFacture: this.fileNameFacture,
        frameNo: this.nomorRangkaModel,
        invoiceDate: this.idpInvoice.tglInvoice.value,
        invoiceName: this.idpInvoice.namaIdentitasPemilik.value,
        invoiceNo: this.idpInvoice.noFaktur.value,
        issuer: this.idpFaktur.noKtpAtauTdpPemilik.value,
        model: this.modelKendaraanModel,
        period: this.tglBerlaku,
        policeNo: this.policeNo,
        requestBy: this.requestBy,
        requestDate: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
        requestId: this.requestId,
        type: this.typeKendaraanModel,
        version: "1",
        versionBpkb: "1",
        versionFaktur: "1",
      };
      console.log(jsonData);
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
          cont = this.INVOICESubmitValidation();
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

              this.$refs.rbBPKB.disabled = true;
              this.$refs.rbFaktur.disabled = true;
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
                page.render(renderContext).promise;
              }

              this.$refs.rbBPKB.disabled = false;
              this.$refs.rbFaktur.disabled = false;
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

              this.$refs.rbBPKB.disabled = true;
              this.$refs.rbFaktur.disabled = true;
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
                page.render(renderContext).promise;
              }

              this.$refs.rbBPKB.disabled = false;
              this.$refs.rbFaktur.disabled = false;
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
            this.changeColor(key + "BPKB", "Input");
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
            this.changeColor(key + "Faktur", "Input");
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
    INVOICESubmitValidation() {
      var cont = true;
      if (!this.tglBerlaku) {
        this.changeColor("tglBerlaku", "Input");
        cont = false;
        this.responseMessage = "Harap lengkapi data terlebih dahulu!";
      }
      Object.keys(this.idpInvoice).forEach((key) => {
        if (this.idpInvoice[key]) {
          if (!this.idpInvoice[key].value) {
            this.changeColor(key + "Invoice", "Input");
            cont = false;
            this.responseMessage = "Harap lengkapi data terlebih dahulu!";
          }

          if (
            this.idpInvoice[key].confidenceLevel <
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
