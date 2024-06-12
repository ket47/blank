<template>
    <h6 class="ion-padding-horizontal">{{ label }}</h6>
    <apexchart v-if="data.series.length > 0" type="pie"  width="380"  :options="chartOptions" :series="series" ref="apexChartElement"></apexchart >
    <div v-else class="ion-padding ion-text-center">
      <h2>Недостаточно данных</h2>
      <p>для показа статистики</p>
    </div>
</template>

<script>

import VueApexCharts          from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts
  },
  props:['label', 'data', 'format', 'color', 'dates'],
  setup(){
    return {}
  },
  data() {
    return {
      series: this.data?.series,
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie',
        },
        colors: ['#00e396', '#ff4560'],
        labels: this.data.labels,
        legend: {
          position: 'bottom'
        }
      },
    };
  },
  
  methods: {
    initChart () {
      if(this.$refs.apexChartElement){ 
        this.$refs.apexChartElement.updateSeries(this.data.series);
        this.$refs.apexChartElement.updateOptions({labels: this.data.labels});
      }
    },

  },
  mounted() {
    setTimeout(() => {
      this.initChart()
    }, 100)  
  },
  updated() {
    setTimeout(() => {
      this.initChart()
    }, 1)  
  }
};
</script>