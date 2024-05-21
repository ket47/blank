<template>
      <h6 class="ion-padding-horizontal">{{ label }}</h6>
      <apexchart v-if="series.length > 0" type="bar" height="350" :options="chartOptions" :series="series" ref="apexChartElement"></apexchart >
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
      series: [{
          name: this.label,
          data: this.data.series ?? []
      }],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          zoom: { enabled: false },
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 0,
            horizontal: true,
            barHeight: '80%',
            isFunnel: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
          },
          dropShadow: {
            enabled: true,
          },
        },
        xaxis: {
          categories: this.data.labels ?? [],
        },
        legend: {
          show: false,
        }
      },
    };
  },
  methods: {
    initChart () {
      if(this.$refs.apexChartElement){ 
        this.$refs.apexChartElement.updateSeries([{
          data: this.data.series
        }]);
        this.$refs.apexChartElement.updateOptions({
          xaxis: {
            categories: this.data.labels ?? []
          }
        });
      }
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