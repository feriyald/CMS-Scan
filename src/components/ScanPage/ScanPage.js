/* eslint-disable */

import * as pdfjsLib from "pdfjs-dist/webpack";
import pdfWorker from "pdfjs-dist/build/pdf.worker.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
export default {
  data() {
    return {
      TipeKolateral: "FAKTUR",
      NoRangka: "",
      NoMesin: "",
      NoPolisi: "",
      NoBpkb: "",
      Merek: "",
      Tipe: "",
      ThnPembuatan: "",
      dialog: false,
      selectedFiles: [],
      previewUrls: [],
      method: "0",
      pdfSrc: "",
      page: 1,
      pdfLoaded: false,
    };
  },
  mounted() {
    this.formBehaviour();
    if (this.method == 0) {
      this.$refs.scan.disabled = true;
      this.$refs.browse.disabled = false;
    } else {
      this.$refs.browse.disabled = true;
      this.$refs.scan.disabled = false;
    }
  },
  methods: {
    formBehaviour() {
      if (this.TipeKolateral == "BPKB") {
        this.$refs.AreaNamapdFaktur.hidden = true;
        this.$refs.AreaAlamatFaktur.hidden = true;
        this.$refs.AreaTglFaktur.hidden = true;
        this.$refs.AreaPenerbitFaktur.hidden = true;
        this.$refs.AreaAlamatFaktur.hidden = true;
      } else if (this.TipeKolateral == "FAKTUR") {
        this.$refs.AreaNoPolisi.hidden = true;
        this.$refs.AreaNoBPKB.hidden = true;
        this.$refs.AreaTglBPKB.hidden = true;
        this.$refs.AreaKapasitas.hidden = true;
        this.$refs.AreaModel.hidden = true;
        this.$refs.AreaWarna.hidden = true;
        this.$refs.AreaNamapdBPKB.hidden = true;
        this.$refs.AreaAlamat.hidden = true;
      }
    },
    upload() {
      this.$refs.browse.click();
    },
    SelectedMethod() {
      if (this.method == 0) {
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
      const file = event.target.files[0];
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
    },
    deleteImage() {
      // Hapus semua canvas dan reset state
      this.pdfPages = [];
      this.pdfUrl = null;
      this.$refs.pdfCanvas.innerHTML = ""; // Kosongkan elemen canvas
    },
    handleSave() {
      // Simpan logika atau validasi data di sini
      alert("Data berhasil disimpan!");
    },
    scan() {
      alert("A");
    },
    idp() {
      if (this.method == 0) {
      } else {
      }
    },
  },
};
