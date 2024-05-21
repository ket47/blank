<template>
    <h6 class="ion-padding-horizontal">{{ label }}</h6>
    <apexchart v-if="data.length > 0" type="bar" height="370" :options="chartOptions" :series="series" ref="apexChartElement"></apexchart >
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
  props:['label', 'data', 'format', 'color'],
  setup(){
    return {}
  },
  data() {
    return {
      value: 0,
      series: this.data,
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          zoom: { enabled: false },
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: [],
        },
        fill: {
          opacity: 1
        },
      },
    };
  },
  computed:{
      dates(){
          return this.getDates(this.data)
      },
  },
  methods: {
    initChart () {
      if(this.$refs.apexChartElement){ 
        this.$refs.apexChartElement.updateSeries(this.data);
        this.$refs.apexChartElement.updateOptions({xaxis: {
          categories: this.dates
        }});
      }
    },
    getDates(data) {
      let result = [];
      for(let i = 1; i < data.length; i++){
        console.log(data[i])
        result.unshift(new Date(data[i].point_finish).toLocaleString("ru", {day: 'numeric', month: 'long'}))
      }
      return result;
    }

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