<template>
  <v-container class="database-preview-container">
    <v-row justify="center">
      <v-col cols="12" md="10" class="text-center">
        <h1>Database Preview</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <h2>Total Database</h2>
        <div class="chart-container">
          <BarChart :chartData="totalDatabaseData" :options="chartOptions" />
        </div>
      </v-col>
      <v-col cols="12" md="5">
        <h2>Collaborated Database</h2>
        <div class="chart-container">
          <BarChart :chartData="collaboratedDatabaseData" :options="chartOptions" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BarChart from '@/components/BarChart.vue';

export default {
  components: {
    BarChart
  },
  data() {
    return {
      totalDatabaseData: {
        labels: ['1月', '2月', '3月', '4月', '5月'],
        datasets: [
          {
            label: 'Total Database',
            backgroundColor: '#42A5F5',
            data: [100, 150, 200, 150, 100]
          }
        ]
      },
      collaboratedDatabaseData: {
        labels: ['1月', '2月', '3月', '4月', '5月'],
        datasets: [
          {
            label: 'Collaborated Database',
            backgroundColor: '#66BB6A',
            data: [150, 100, 200, 150, 100]
          }
        ]
      },
      chartOptions: {
        maintainAspectRatio: false,
        responsive: true
      }
    };
  }
};
</script>

<style>
.text-center {
  text-align: center;
}
.chart-container {
  height: 400px; /* 设置图表容器高度 */
}
.database-preview-container {
  padding-top: 16px;
}
</style>
