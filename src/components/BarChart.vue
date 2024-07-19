<template>
  <div class="chart-wrapper">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      new Chart(this.$refs.canvas, {
        type: 'bar',
        data: this.chartData,
        options: this.options
      });
    }
  }
};
</script>

<style>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
