<template>
  <div class="container">
    <div class="header">
      <v-img :src="require('@/assets/logo_ADIRA.png')" class="image" />
    </div>
    <v-dialog v-model="confirmDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title> </v-card-title>
        <v-img
          :src="require('@/assets/QuestionAlert.png')"
          style="
            width: 200px;
            height: 200px;
            align-items: left;
            padding-left: 400px;
          "
        />
        <v-card-text> {{ message }} </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmDialog = false" class="cancelbtn">Tidak</v-btn>
          <v-btn @click="handleSave()" class="dialogbtn">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="400px" persistent>
      <v-card>
        <v-card-title></v-card-title
        ><v-img
          :src="require('@/assets/SuccessAlert.png')"
          style="
            width: 200px;
            height: 200px;
            align-items: left;
            padding-left: 400px;
          "
        />
        <v-card-text style="align-items: left; padding-left: 140px">
          {{ responseMessage }}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="doneSubmit()" class="dialogbtn">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="content">
      <div class="form-container">
        <h2>Pengaturan CMS Scan</h2>

        <label for="level-kepercayaan">Level Kepercayaan (Min)</label>
        <div class="text-container">
          <input
            v-model="levelKepercayaan"
            type="number"
            id="level-kepercayaan"
            name="level-kepercayaan"
            min="0"
            max="100"
            placeholder="0"
          />
          <div class="satuan">%</div>
        </div>

        <label for="ukuran-bpkb-utama">Ukuran Dokumen BPKB Utama (Maks)</label>
        <div class="text-container">
          <input
            v-model="ukuranBpkbUtama"
            type="number"
            id="ukuran-bpkb-utama"
            name="ukuran-bpkb-utama"
            placeholder="0"
          />
          <div class="satuan">kB</div>
        </div>

        <label for="ukuran-bpkb">Ukuran Dokumen Faktur BPKB (Maks)</label>
        <div class="text-container">
          <input
            v-model="ukuranBpkb"
            type="number"
            id="ukuran-bpkb"
            name="ukuran-bpkb"
            placeholder="0"
          />
          <div class="satuan">kB</div>
        </div>

        <label for="ukuran-faktur">Ukuran Dokumen Faktur/Invoice (Maks)</label>
        <div class="text-container">
          <input
            v-model="ukuranFaktur"
            type="number"
            id="ukuran-faktur"
            name="ukuran-faktur"
            placeholder="0"
          />
          <div class="satuan">kB</div>
        </div>

        <div class="buttons">
          <button class="btn-cancel" @click="handleCancel">Batal</button>
          <button class="btn-save" @click="confirmation()">Simpan</button>
        </div>
      </div>
    </div>

    <footer>
      <div class="left">&copy; Copyright ADIRA 2024</div>
      <div class="right">CMS Scan v1.0.0</div>
    </footer>
  </div>
</template>

<script src="./MasterParamPage.js"></script>
<style src="./MasterParamPage.css" scoped></style>
