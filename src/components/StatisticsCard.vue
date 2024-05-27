<template>
  <ion-card style="contain: initial;  overflow: visible; ">
    <ion-card-header style="padding-bottom: 0">
      <ion-card-subtitle>{{ label }}</ion-card-subtitle>
      <ion-card-title>
        <div>
          <b style="font-size: 22px">{{ mainValue }}</b> 
          <ion-chip  v-if="data.series.length > 0" :outline="true"  :color="dynamicsData.color" class=" ion-no-margin " style="font-size: 12px; border: none; ">
            <ion-icon :icon="dynamicsData.icon"></ion-icon>
            <ion-label>{{ dynamicsData.value }}%</ion-label>
          </ion-chip>
        </div>
      </ion-card-title>
    </ion-card-header>
    <ion-card-content class="ion-no-padding ">
      <apexchart v-if="data.series.length > 1" type="area" height="70" :options="chartOptions" :series="series" ref="apexChart"></apexchart >
      <div v-else class="ion-padding ion-text-center">
        <h2>Недостаточно данных</h2>
        <p>для показа статистики</p>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script>
import {
  IonIcon,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
}                             from "@ionic/vue";
import { 
  calendarOutline,
  caretUpOutline,
  caretDownOutline,
  caretForwardOutline
}                             from "ionicons/icons";

import VueApexCharts          from "vue3-apexcharts";

export default {
  components: {
    IonIcon,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonChip,
    apexchart: VueApexCharts
  },
  props:['label', 'data', 'format', 'color', 'dates'],
  setup(){
    return {
      calendarOutline,
      caretUpOutline,
      caretDownOutline,
      caretForwardOutline
    }
  },
  data() {
    return {
      value: 0,
      series: [{
          name: this.label,
          data: this.data.series
      }],
      chartOptions: {
        chart: {
          height: 70,
          type: 'area',
          zoom: { enabled: false },
          toolbar: { show: false },
          parentHeightOffset: 0,
          sparkline: {
            enabled: true
          }
        },
        stroke: {
          width: 2,
        },
        colors: ['#008FFB'],
        legend: {
          show: false
        },
        fill: { 
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.4,
          }
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          padding: { left: -10, right: -10, top: -15, bottom: -15 },
          yaxis: {
            lines: { show: false }
          },   
        },
        xaxis: {
          show: false,
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false },
          categories: [],
        },
        yaxis: {
          show: false,
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        /*
        annotations: {
          yaxis: [
            {
              y: this.data.avg,
              y2: this.data.series[this.data.series.length - 1]*1,
              width: '10px',
              yAxisIndex: 4,
              borderColor: '#775DD0',
              fillColor: '#775DD0',
            }
          ]
        }*/
      },
    };
  },
  computed:{
      mainValue(){
          const value = this.data.value ?? 0
          if( this.format == 'integer' ){
              return new Intl.NumberFormat('ru-RU').format(Math.round(value))
          }
          if( this.format == 'float' ){
              return new Intl.NumberFormat('ru-RU', { maximumSignificantDigits: 2 }).format(parseFloat(value).toFixed(2))
          }
          if( this.format == 'currency' ){
              return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB'}).format(parseFloat(value).toFixed(2))
          }
          return null
      },
      dynamicsData(){
          const avg = this.data.avg*1 ?? 0
          const value = this.data.value*1 ?? 0
          const dynamicsValue = ((100 * ( (value - avg) / ( (value + avg)/2 ) )) || 0 ).toFixed(2) 
          var color = "medium"
          var icon = caretForwardOutline
          if(dynamicsValue > 0){
            color = 'success'
            icon = caretUpOutline
          }
          if(dynamicsValue < 0){
            color = 'danger'
            icon = caretDownOutline
          }
          return {
            value: dynamicsValue,
            color: color,
            icon: icon
          };
      },
      datesParsed(){
          return this.getDates(this.dates)
      },
  },
  methods: {
    initChart () {
      if(this.$refs.apexChart) this.$refs.apexChart.updateSeries(this.series);
      this.$refs.apexChart.updateOptions({xaxis: {
        categories: this.datesParsed
      }});
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
    this.chartOptions.colors = [this.color] ?? ['#008FFB']
    setTimeout(() => {
      this.initChart()
    }, 10)  
  },
  updated() {
    this.initChart()
  }
};
</script>