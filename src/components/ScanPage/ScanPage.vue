<template>
  <div class="container">
    <div class="header">
      <v-img :src="require('@/assets/logo_ADIRA.png')" class="image" />
    </div>
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text> Ini adalah konten modal. </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false" class="dialogbtn">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <main class="form-container">
      <h1>CMS Scan</h1>
      <div class="scan-form">
        <!-- Left Form Section -->
        <div class="left-form">
          <div class="form-group" ref="AreaTipeKolateral">
            <label>Tipe Collateral</label>
            <input
              type="text"
              placeholder="BPKB"
              v-model="TipeKolateral"
              disabled
            />
          </div>
          <div class="form-group" ref="AreaNoRangka">
            <label>No Rangka *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaNoMesin">
            <label>No Mesin *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaNoPolisi">
            <label>No Polisi *</label>
            <input type="text" />
          </div>
          <div class="form-group" ref="AreaNoBPKB">
            <label>No BPKB *</label>
            <input type="text" />
          </div>
          <div class="form-group" ref="AreaNoFaktur">
            <label>No Faktur *</label>
            <input type="text" />
          </div>
          <div class="form-group" ref="AreaMerek">
            <label>Merek *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaTipe">
            <label>Tipe *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaTahunPembuatan">
            <label>Tahun Pembuatan *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaNamapdFaktur">
            <label>Nama Pada Faktur *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaAlamatFaktur">
            <label>Alamat *</label>
            <input type="text" placeholder="" />
          </div>
        </div>

        <!-- Right Form Section -->
        <div class="right-form">
          <div class="form-group" ref="AreaTglBPKB">
            <label>Tanggal BPKB *</label>
            <input type="date" />
          </div>
          <div class="form-group" ref="AreaTglFaktur">
            <label>Tanggal Faktur *</label>
            <input type="date" />
          </div>
          <div class="form-group" ref="AreaPenerbitFaktur">
            <label>Penerbit Faktur *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaKapasitas">
            <label>Kapasitas/CC *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaModel">
            <label>Model *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaWarna">
            <label>Warna *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaNamapdBPKB">
            <label>Nama Pada BPKB *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaAlamat">
            <label>Alamat *</label>
            <input type="text" placeholder="" />
          </div>
          <div class="form-group" ref="AreaMasaBerlakuJaminan">
            <label>Masa Berlaku Jaminan *</label>
            <input type="date" />
          </div>
        </div>

        <!-- Review Section -->
        <div class="review-section">
          <!-- Scan Section -->
          <div class="form-group">
            <label>Scan/Jelajahi</label>
            <select
              @change="SelectedMethod"
              v-model="method"
              style="padding: 10px"
            >
              <option value="0">Jelajahi</option>
              <option value="1">Scan</option>
            </select>
            <button
              class="btnScan"
              id="buttonScan"
              @click="scan"
              ref="scan"
              :disabled="btnScanDisable"
            >
              Scan
            </button>
          </div>
          <div class="form-group">
            <label>Unggah Dokumen *</label>
            <div class="text-container" ref="BrowseArea">
              <input
                class="input-browser"
                type="file"
                placeholder=""
                ref="browse"
                multiple
                hidden
                accept="application/pdf"
                @change="onFileSelected"
              />
              <div class="btn-Upload">
                <v-img
                  :src="require('@/assets/upload.png')"
                  class="image"
                  @click="upload"
                />
              </div>
            </div>

            <!-- <input type="file" /> -->
          </div>
          <label>Tinjau :</label>
          <div class="form-radiobutton">
            <input type="radio" name="review" checked /> BPKB Utama
            <input type="radio" name="review" /> Faktur BPKB
          </div>
          <div ref="pdfContainer" class="review-box">
            <div ref="pdfCanvas"></div>
          </div>
          <div class="btn-action-area">
            <button class="btn" @click="deleteImage">Hapus</button>
            <button class="btn" @click="idp">IDP</button>
            <button class="btn" @click="handleSave()">Simpan</button>
          </div>
        </div>
      </div>
    </main>
  </div>
  <footer>
    <div class="left">&copy; Copyright ADIRA 2024</div>
    <div class="right">CMS Scan v1.0.0</div>
  </footer>
</template>
<script src="./ScanPage.js"></script>
<style src="./ScanPage.css" scoped></style>
