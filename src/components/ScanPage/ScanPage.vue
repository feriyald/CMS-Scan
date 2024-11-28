<template>
  <div class="container">
    <div class="header">
      <v-img :src="require('@/assets/logo_ADIRA.png')" class="image" />
    </div>
    <v-dialog v-model="confirmDialog" max-width="300px" persistent>
      <v-card>
        <v-card-title> </v-card-title>
        <v-img
          :src="require('@/assets/QuestionAlert.png')"
          style="
            width: 100px;
            height: 100px;
            align-items: center;
            padding-left: 300px;
          "
        />
        <v-card-text class="textpopup"> {{ message }} </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmDialog = false" class="cancelbtn">Tidak</v-btn>
          <v-btn @click="action()" class="dialogbtn">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="300px" persistent>
      <v-card>
        <v-card-title></v-card-title
        ><v-img
          :src="require('@/assets/SuccessAlert.png')"
          style="
            width: 150px;
            height: 150px;
            align-items: center;
            padding-left: 300px;
          "
        />
        <v-card-text class="textpopup"> {{ responseMessage }} </v-card-text>
        <v-card-actions>
          <v-btn @click="doneSubmit()" class="dialogbtn">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errordialog" max-width="300px" persistent>
      <v-card>
        <v-card-title></v-card-title
        ><v-img
          :src="require('@/assets/ErrorAlert.png')"
          style="
            width: 150px;
            height: 150px;
            align-items: center;
            padding-left: 300px;
          "
        />
        <v-card-text class="textpopup"> {{ responseMessage }} </v-card-text>
        <v-card-actions>
          <v-btn @click="errordialog = false" class="dialogbtn">Kembali</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <main class="form-container">
      <h1>CMS Scan</h1>
      <div class="scan-form">
        <!-- Left Form Section -->
        <div class="left-form">
          <div class="form-group" ref="AreatipeKolateral">
            <label>Tipe Collateral</label>
            <input
              type="text"
              placeholder="BPKB"
              v-model="tipeKolateral"
              disabled
            />
          </div>
          <div class="form-group" ref="AreaNoRangka">
            <label>No Rangka *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.nomorRangka.value"
              ref="nomorRangka"
              required
            />
            <label ref="nomorRangkaBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.nomorRangka.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNoMesin">
            <label>No Mesin *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.nomorMesin.value"
              ref="nomorMesin"
              required
            />
            <label ref="nomorMesinBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.nomorMesin.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNoPolisi">
            <label>No Polisi *</label>
            <input type="text" v-model="policeNo" ref="policeNo" />
          </div>
          <div class="form-group" ref="AreaNoBPKB">
            <label>No BPKB *</label>
            <input
              type="text"
              v-model="idpBPKB.noBpkb.value"
              ref="noBpkb"
              required
            />
            <label ref="noBpkbBPKB" v-show="isHidden"
              >Level Kepercayaan {{ idpBPKB.noBpkb.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNoInvoice">
            <label>No Invoice *</label>
            <input type="text" ref="noInvoice" required />
          </div>
          <div class="form-group" ref="AreaTglInvoice">
            <label>Tanggal Invoice *</label>
            <input type="date" ref="dateInvoice" required />
          </div>
          <div class="form-group" ref="AreaNamapdInvoice">
            <label>Nama Pada Invoice *</label>
            <input type="text" placeholder="" ref="invoiceName" required />
          </div>
          <div class="form-group" ref="AreaNoFaktur">
            <label>No Faktur *</label>
            <input
              type="text"
              v-model="idpBPKB.nomorFaktur.value"
              ref="nomorFaktur"
              required
            />
            <label ref="nomorFakturBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.nomorFaktur.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaMerek">
            <label>Merek *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.merekKendaraan.value"
              ref="merekKendaraan"
              required
            />
            <label ref="merekKendaraanBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.merekKendaraan.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaTipe">
            <label>Tipe *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.typeKendaraan.value"
              ref="typeKendaraan"
              required
            />
            <label ref="typeKendaraanBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.typeKendaraan.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaTahunPembuatan">
            <label>Tahun Pembuatan *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.tahunPembuatan.value"
              ref="tahunPembuatan"
              required
            />
            <label ref="tahunPembuatanBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.tahunPembuatan.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNamapdFaktur">
            <label>Nama Pada Faktur *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpFaktur.namaPemilik.value"
              ref="namaPemilik"
              required
            />
            <label ref="namaPemilikFaktur" v-show="isHidden"
              >Level Kepercayaan
              {{ idpFaktur.namaPemilik.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaAlamatFaktur">
            <label>Alamat *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpFaktur.alamatPemilik.value"
              ref="alamatPemilik"
              required
            />
            <label ref="alamatPemilikFaktur" v-show="isHidden"
              >Level Kepercayaan
              {{ idpFaktur.alamatPemilik.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaAlamatInvoice">
            <label>Alamat *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpFaktur.alamatPemilik.value"
              ref="alamatPemilik"
              required
            />
          </div>
          <div class="form-group" ref="AreaPenerbitInvoice">
            <label>Penerbit Invoice *</label>
            <input type="text" placeholder="" ref="penerbitInvoice" required />
          </div>
          <div class="form-group" ref="AreaMasaBerlakuJaminanInvoice">
            <label>Masa Berlaku Jaminan *</label>
            <input type="date" v-model="tglBerlaku" ref="tglBerlaku" required />
          </div>
        </div>

        <!-- Right Form Section -->
        <div class="right-form" ref="rightForm">
          <div class="form-group" ref="AreaTglBPKB">
            <label>Tanggal BPKB *</label>
            <input
              type="date"
              v-model="idpBPKB.tanggalBPKB.value"
              ref="tanggalBPKB"
              required
            />
            <label ref="tanggalBPKBBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.tanggalBPKB.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaTglFaktur">
            <label>Tanggal Faktur *</label>
            <input
              type="date"
              v-model="idpFaktur.tahunPembuatan.value"
              ref="tahunPembuatan"
              required
            />
            <label ref="tahunPembuatanFaktur" v-show="isHidden"
              >Level Kepercayaan
              {{ idpFaktur.tahunPembuatan.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaPenerbitFaktur">
            <label>Penerbit Faktur *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpFaktur.noKtpAtauTdpPemilik.value"
              ref="noKtpAtauTdpPemilik"
              required
            />
            <label ref="noKtpAtauTdpPemilikFaktur" v-show="isHidden"
              >Level Kepercayaan
              {{ idpFaktur.noKtpAtauTdpPemilik.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaKapasitas">
            <label>Kapasitas/CC *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.isiSilinder.value"
              ref="isiSilinder"
              required
            />
            <label ref="modelKendaraanBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.isiSilinder.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaModel">
            <label>Model *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.modelKendaraan.value"
              ref="modelKendaraan"
              required
            />
            <label ref="modelKendaraanBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.modelKendaraan.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaWarna">
            <label>Warna *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.warna.value"
              ref="warna"
              required
            />
            <label ref="warnaBPKB" v-show="isHidden"
              >Level Kepercayaan {{ idpBPKB.warna.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNamapdBPKB">
            <label>Nama Pada BPKB *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.namaPemilik.value"
              ref="namaPemilik"
              required
            />
            <label ref="namaPemilikBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.namaPemilik.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaAlamat">
            <label>Alamat *</label>
            <input
              type="text"
              placeholder=""
              v-model="idpBPKB.alamat.value"
              ref="alamat"
              required
            />
            <label ref="alamatBPKB" v-show="isHidden"
              >Level Kepercayaan {{ idpBPKB.alamat.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaMasaBerlakuJaminan">
            <label>Masa Berlaku Jaminan *</label>
            <input type="date" v-model="tglBerlaku" ref="periodDate" />
          </div>
        </div>

        <!-- Review Section -->
        <div class="review-section">
          <!-- Scan Section -->
          <div class="form-group">
            <label>Scan/Jelajahi</label>
            <select @change="methodChange" v-model="selectedmethod">
              <option
                v-for="(item, index) in uploadMethod"
                :key="index"
                :value="item.value"
              >
                {{ item.description }}
              </option>
            </select>
            <button
              class="btnScan"
              id="buttonScan"
              @click="sendMessage"
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
          <div class="form-radiobutton" ref="AreaRadioButton">
            <input
              type="radio"
              name="review"
              checked
              value="BPKB"
              v-model="selectedRadio"
              @change="updateArray"
            />
            BPKB Utama
            <input
              type="radio"
              name="review"
              value="Faktur"
              v-model="selectedRadio"
              @change="updateArray"
            />
            Faktur BPKB
          </div>
          <div ref="pdfContainer" class="review-box">
            <div ref="pdfCanvas"></div>
            <div
              ref="ScannedUtama"
              v-for="(image, index) in scannedDisplayed"
              :key="index"
              class="image-container"
            >
              <table>
                <td style="vertical-align: middle">
                  <input
                    type="checkbox"
                    :value="index"
                    v-model="selectedImages"
                  />
                </td>
                <td>
                  <div style="padding: 20px">
                    <img
                      :src="'data:image/png;base64,' + image"
                      alt="Image"
                      style="width: 100%; height: 500px"
                    />
                  </div>
                </td>
              </table>
            </div>
          </div>
          <div class="btn-action-area">
            <button
              class="btn"
              @click="confirmDelete"
              style="background-color: red; color: white"
            >
              Hapus
            </button>
            <button
              class="btn"
              @click="idp"
              style="
                background: #fcfcfd;
                border: 1px solid #53b1fd;
                color: #175cd3;
              "
            >
              IDP
            </button>
            <button class="btn" @click="confirmSave()">Simpan</button>
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
