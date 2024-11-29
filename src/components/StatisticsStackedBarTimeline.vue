<template>
    <h6 class="ion-padding-horizontal">
      {{ label }}
      <ion-chip  v-if="showDynamics && data.length > 0" :outline="true"  :color="dynamicsData.color" class=" ion-no-margin " style="font-size: 12px; border: none; ">
        <ion-icon :icon="dynamicsData.icon"></ion-icon>
        <ion-label>{{ dynamicsData.value }}%</ion-label>
      </ion-chip>
    </h6>
    <apexchart v-if="data.length > 0" type="bar" height="370" :options="chartOptions" :series="series" ref="apexChartElement"></apexchart >
    <div v-else class="ion-padding ion-text-center">
      <h2>Недостаточно данных</h2>
      <p>для показа статистики</p>
    </div>
</template>

<script>
import {
  IonChip,
  IonLabel,
  IonIcon
}                             from "@ionic/vue";
import { 
  caretUpOutline,
  caretDownOutline,
  caretForwardOutline
}                             from "ionicons/icons";
import VueApexCharts          from "vue3-apexcharts";

export default {
  components: {
    IonChip,
    IonLabel,
    IonIcon,
    apexchart: VueApexCharts
  },
  props:['label', 'data', 'format', 'color', 'dates', 'showTotal', 'showDynamics'],
  setup(){
    return {
      caretUpOutline,
      caretDownOutline,
      caretForwardOutline
    }
  },
  data() {
    return {
      value: 0,
      series: this.data,
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          zoom: { enabled: false },
          toolbar: { show: false }
        },
        dataLabels: {
          enabled:false
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '35%',
            dataLabels: {
              total: {
                enabled: this.showTotal,
                formatter: function (val, opts) {
                    return "Всего: \n"+val
                },
                style: {
                  fontSize: '13px',
                }
              }
            }
          },
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
      datesParsed(){
          return this.getDates(this.dates)
      },
      dynamicsData(){
          var sumCurrent = 0;
          var sumPrevious = 0;
          for(var i in this.data){
            if(this.data[i].data.lenght < 2){
              break;
            }
            sumCurrent += this.data[i].data[this.data.length - 1]
            sumPrevious += this.data[i].data[this.data.length - 2]

          }
          const dynamicsValue = ((100 * ( (sumCurrent - sumPrevious) / ( (sumCurrent + sumPrevious)/2 ) )) || 0 ).toFixed(2) 
          var color = "medium"
          var icon = caretForwardOutline
          if(dynamicsValue > 0){
            color = 'danger'
            icon = caretUpOutline
          }
          if(dynamicsValue < 0){
            color = 'success'
            icon = caretDownOutline
          }
          return {
            value: dynamicsValue,
            color: color,
            icon: icon
          };
      },
  },
  
  methods: {
    initChart () {
      if(this.$refs.apexChartElement){ 
        this.$refs.apexChartElement.updateSeries(this.data);
        this.$refs.apexChartElement.updateOptions({xaxis: {
          categories: this.datesParsed
        }});
      }
    },
    getDates(data) {
      let result = [];
      for(let i = 0; i < data.length; i++){
        result.unshift(new Date(data[i]).toLocaleString("ru", {day: 'numeric', month: 'long'}))
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