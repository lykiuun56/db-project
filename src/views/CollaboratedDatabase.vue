<template>
  <v-container class="database-preview-container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class = "header"> Collaborated Database Home</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" v-for = "(button, index) in buttons" :key ="index">
        <v-btn
            block
            class = "custom-btn"
            @click = "$router.push(button.route)"
        >
          {{button.label}}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CollaboratedDatabase',
  data() {
    return {
      buttons: [
        {label : "View the database", route: '/cd-grid'},
        {label : "Add To Database", route: '/cd-add'},
        {label : "Remove From Database", route: '/cd-remove'},
        // {label : "Find Creators", route: '/cd-find'},
        // {label : "Change Information", route: '/cd-change'},
      ],
    };
  },
};
</script>


<style scoped>
  .database-preview-container {
  padding: 24px 16px;
  background-color : #f9f9f9;
  border-radius : 8px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
  max-width: 600px;

}
  .text-center {
    text-align: center;
}
  .header {
    font-size :2rem;
    margin-bottom: 30px;
    color: #333;
}
  .custom-btn {
    margin-bottom: 16px;
    padding: 14px 20px;
    background-color: #007bff;
    color: white;
    border-radius : 8px;
    font-size: 16px;
    text-transform: uppercase;
    box-shadow: 0px 2px 5px  rgba(0,0,0,0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
}

  .custom-btn:hover{
    background-color: #0056b3;
    transform:translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0,0,0,0.15);
}
</style>
