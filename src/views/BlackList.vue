<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h2>Black List</h2>
        </v-col>
      </v-row>
      <v-row class="mb-5" justify="center">
        <v-col cols ="12" md="5">
          <v-text-field label = "Handle Name" outlined></v-text-field>
        </v-col>
        <v-col cols ="12" md ="5">
          <v-text-field label ="Email" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mb-5" justify="center">
        <v-col cols = "8" class ="text-center">
          <v-btn color ="primary" @click="Add">Add</v-btn>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
export default{
  name:'BlackList',
  methods:{
    Add(){
    },
  }
}
</script>
<style>
.text-center {
  text-align: center;
}
.mb-5 {
  margin-bottom: 10px;
}
.v-data-table {
  max-height: 400px;
}
</style>