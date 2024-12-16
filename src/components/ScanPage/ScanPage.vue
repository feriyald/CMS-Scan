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
        <v-card-title>Data berhasil disimpan!</v-card-title
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
              v-model="nomorRangkaModel"
              ref="nomorRangka"
              required
              :disabled="isDisabled"
              maxlength="25"
            />
            <label ref="LabelnomorRangka" v-show="isHidden"
              >Level Kepercayaan {{ nomorRangkaCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNoMesin">
            <label>No Mesin *</label>
            <input
              type="text"
              placeholder=""
              v-model="nomorMesinModel"
              ref="nomorMesin"
              required
              :disabled="isDisabled"
              maxlength="25"
            />
            <label ref="LabelnomorMesin" v-show="isHidden"
              >Level Kepercayaan {{ nomorMesinCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNoPolisi">
            <label>No Polisi *</label>
            <input
              type="text"
              v-model="policeNo"
              ref="policeNo"
              :disabled="isDisabled"
              maxlength="10"
            />
          </div>
          <div class="form-group" ref="AreaNoBPKB">
            <label>No BPKB *</label>
            <input
              type="text"
              v-model="idpBPKB.noBpkb.value"
              ref="noBpkb"
              required
              :disabled="isDisabled"
              maxlength="25"
            />
            <label ref="LabelnoBpkbBPKB" v-show="isHidden"
              >Level Kepercayaan {{ idpBPKB.noBpkb.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNoInvoice">
            <label>No Invoice *</label>
            <input
              type="text"
              ref="noFakturInvoice"
              required
              :disabled="isDisabled"
              v-model="nomorFakturModel"
              maxlength="25"
            />
            <label ref="LabelnoFaktur" v-show="isHidden"
              >Level Kepercayaan {{ nomorFakturCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaTglInvoice">
            <label>Tanggal Invoice *</label>
            <input
              type="date"
              ref="tglInvoice"
              required
              :disabled="isDisabled"
              v-model="idpInvoice.tglInvoice.value"
            />
            <label ref="LabeltglInvoiceInvoice" v-show="isHidden"
              >Level Kepercayaan
              {{ idpInvoice.tglInvoice.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNamapdInvoice">
            <label>Nama Pada Invoice *</label>
            <input
              type="text"
              placeholder=""
              ref="namaIdentitasPemilik"
              required
              :disabled="isDisabled"
              maxlength="100"
              v-model="idpInvoice.namaIdentitasPemilik.value"
            />
            <label ref="LabelnamaIdentitasPemilikInvoice" v-show="isHidden"
              >Level Kepercayaan
              {{ idpInvoice.namaIdentitasPemilik.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNoFaktur">
            <label>No Faktur *</label>
            <input
              type="text"
              v-model="nomorFakturModel"
              ref="nomorFaktur"
              required
              :disabled="isDisabled"
              maxlength="25"
            />
            <label ref="LabelnomorFaktur" v-show="isHidden"
              >Level Kepercayaan {{ nomorFakturCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaMerek">
            <label>Merek *</label>
            <input
              type="text"
              placeholder=""
              v-model="merkKendaraanModel"
              ref="merekKendaraan"
              required
              disabled
              maxlength="50"
            />
            <label ref="LabelmerekKendaraan" v-show="isHidden"
              >Level Kepercayaan {{ merkKendaraanCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaTipe">
            <label>Tipe *</label>
            <input
              type="text"
              placeholder=""
              v-model="typeKendaraanModel"
              ref="typeKendaraan"
              required
              disabled
              maxlength="50"
            />
            <label ref="LabeltypeKendaraan" v-show="isHidden"
              >Level Kepercayaan {{ typeKendaraanCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaTahunPembuatan">
            <label>Tahun Pembuatan *</label>
            <input
              type="text"
              placeholder=""
              v-model="tahunPembuatanModel"
              ref="tahunPembuatan"
              required
              :disabled="isDisabled"
              maxlength="4"
            />
            <label ref="LabeltahunPembuatan" v-show="isHidden"
              >Level Kepercayaan {{ tahunPembuatanCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNamapdFaktur">
            <label>Nama Pada Faktur *</label>
            <input
              type="text"
              placeholder=""
              v-model="namaPemilikModel"
              ref="namaPemilikFaktur"
              required
              :disabled="isDisabled"
              maxlength="100"
            />
            <label ref="LabelnamaPemilikFaktur" v-show="isHidden"
              >Level Kepercayaan {{ namaPemilikCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaAlamatFaktur">
            <label>Alamat *</label>
            <input
              type="text"
              placeholder=""
              v-model="alamatModel"
              ref="alamatPemilikFaktur"
              required
              :disabled="isDisabled"
              maxlength="200"
            />
            <label ref="LabelalamatPemilikFaktur" v-show="isHidden"
              >Level Kepercayaan {{ alamatCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaAlamatInvoice">
            <label>Alamat *</label>
            <input
              type="text"
              placeholder=""
              ref="alamatIdentitasPemilikInvoice"
              required
              :disabled="isDisabled"
              maxlength="200"
              v-model="alamatModel"
            />
            <label ref="LabelalamatIdentitasPemilikInvoice" v-show="isHidden"
              >Level Kepercayaan {{ alamatCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaPenerbitInvoice">
            <label>Penerbit Invoice *</label>
            <input
              type="text"
              placeholder=""
              ref="namaSuplier"
              required
              :disabled="isDisabled"
              maxlength="100"
              v-model="idpInvoice.namaSuplier.value"
            />
            <label ref="LabelnamaSuplierInvoice" v-show="isHidden"
              >Level Kepercayaan
              {{ idpInvoice.namaSuplier.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaMasaBerlakuJaminanInvoice">
            <label>Masa Berlaku Jaminan *</label>
            <input
              type="date"
              v-model="tglBerlaku"
              ref="tglBerlaku"
              required
              :disabled="isDisabled"
            />
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
              :disabled="isDisabled"
            />
            <label ref="LabeltanggalBPKBBPKB" v-show="isHidden"
              >Level Kepercayaan
              {{ idpBPKB.tanggalBPKB.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaTglFaktur">
            <label>Tanggal Faktur *</label>
            <input
              type="date"
              v-model="idpFaktur.tanggalFaktur.value"
              ref="tanggalFaktur"
              required
              :disabled="isDisabled"
              maxlength="4"
            />
            <label ref="LabeltanggalFakturFaktur" v-show="isHidden"
              >Level Kepercayaan
              {{ idpFaktur.tanggalFaktur.confidenceLevel }}%</label
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
              :disabled="isDisabled"
            />
            <label ref="LabelnoKtpAtauTdpPemilikFaktur" v-show="isHidden"
              >Level Kepercayaan
              {{ idpFaktur.noKtpAtauTdpPemilik.confidenceLevel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaKapasitas">
            <label>Kapasitas/CC *</label>
            <input
              type="text"
              placeholder=""
              v-model="isiSilinderModel"
              ref="isiSilinder"
              required
              :disabled="isDisabled"
              maxlength="5"
            />
            <label ref="LabelisiSilinder" v-show="isHidden"
              >Level Kepercayaan {{ isiSilinderCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaModel">
            <label>Model *</label>
            <input
              type="text"
              placeholder=""
              v-model="modelKendaraanModel"
              ref="modelKendaraan"
              required
              disabled
              maxlength="50"
            />
            <label ref="LabelmodelKendaraan" v-show="isHidden"
              >Level Kepercayaan {{ modelKendaraanCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaWarna">
            <label>Warna *</label>
            <input
              type="text"
              placeholder=""
              v-model="warnaModel"
              ref="warna"
              required
              :disabled="isDisabled"
              maxlength="50"
            />
            <label ref="Labelwarna" v-show="isHidden"
              >Level Kepercayaan {{ warnaCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaNamapdBPKB">
            <label>Nama Pada BPKB *</label>
            <input
              type="text"
              placeholder=""
              v-model="namaPemilikModel"
              ref="namaPemilikBPKB"
              required
              :disabled="isDisabled"
              maxlength="100"
            />
            <label ref="LabelnamaPemilik" v-show="isHidden"
              >Level Kepercayaan {{ namaPemilikCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaAlamat">
            <label>Alamat *</label>
            <input
              type="text"
              placeholder=""
              v-model="alamatModel"
              ref="alamat"
              required
              :disabled="isDisabled"
              maxlength="200"
            />
            <label ref="LabelalamatBPKB" v-show="isHidden"
              >Level Kepercayaan {{ alamatCLModel }}%</label
            >
          </div>
          <div class="form-group" ref="AreaMasaBerlakuJaminan">
            <label>Masa Berlaku Jaminan *</label>
            <input type="date" v-model="tglBerlaku" ref="tglBerlaku" disabled />
          </div>
        </div>

        <v-img
          :src="require('@/assets/processLoading.gif')"
          style="width: 30%; height: 30%"
          v-show="isLoading"
        />
        <!-- Review Section -->
        <div class="review-section" ref="reviewSection">
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
              ref="rbBPKB"
              v-model="selectedRadio"
              @change="updateArray"
            />
            BPKB Utama
            <input
              type="radio"
              name="review"
              value="Faktur"
              ref="rbFaktur"
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
              ref="idpButton"
            >
              {{ buttonText }}
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
