<template>
  <div>
    <h1>Upload PDF</h1>
    <input
      type="file"
      @change="onFileChange"
      accept="application/pdf"
      multiple
    />
    <div ref="pdfContainer" class="pdf-container">
      <div ref="pdfCanvas"></div>
    </div>
  </div>
</template>

<script>
import * as pdfjsLib from "pdfjs-dist/webpack";
import pdfWorker from "pdfjs-dist/build/pdf.worker.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default {
  methods: {
    async onFileChange(event) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const totalPages = pdf.numPages;

        // Hapus isi canvas sebelum menggambar halaman baru
        this.$refs.pdfCanvas.innerHTML = "";

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const scale = 1.0;
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
      fileReader.readAsArrayBuffer(file);
    },
  },
};
</script>

<style scoped>
.pdf-container {
  width: 400px;
  height: 500px; /* Tinggi tetap untuk container, sesuaikan sesuai kebutuhan */
  overflow-y: auto; /* Agar bisa scroll secara vertikal */
  border: 1px solid #ccc; /* Tambahkan border jika diinginkan */
}
</style>
