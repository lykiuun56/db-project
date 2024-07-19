<template>
  <v-container>
    <v-row justify="center">
      <v-col cols ="12" class = "text-center">
        <h1>Remove Duplicate</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-file-input label = "选择文件" outlined></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="submit">提交</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RemoveDuplicate',
  method:{
    submit(){

    }
  }
};

</script>


<style>
.text-center {
  text-align: center;
}
.add-to-database-container {
  padding-top: 16px;
}
</style>
