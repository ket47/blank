<template>
  <div class="horizontalScroller">
      <ion-chip @click="reportPrint()" color="medium"><ion-icon :src="printOutline"/><ion-label>Напечатать</ion-label></ion-chip> 
      <ion-chip @click="load()" color="medium"><ion-icon :src="reloadOutline"/><ion-label>Обновить</ion-label></ion-chip>
  </div>
  <div class="printDiv ">
    <div class="ion-padding-horizontal"> 
      <h5>Общая статистика {{store.store_name ?? ''}}</h5>
      <p>За последние 7 дней</p>
    </div>
    <ion-grid>
      <ion-row>
        <ion-col size="12" size-sm="6"><statistics-card v-if="dataset.order_count" label="Заказы" :data="dataset.order_count" format="integer" color="#008FFB" :dates="totalDates"/></ion-col>
        <ion-col size="12" size-sm="6"><statistics-card v-if="dataset.order_sum" label="Сумма" :data="dataset.order_sum" format="currency" color="#04e398" :dates="totalDates"/></ion-col>
        <ion-col size="12" size-sm="6"><statistics-card v-if="dataset.order_sum_avg" label="Средний чек" :data="dataset.order_sum_avg" format="currency" color="#feba37" :dates="totalDates"/></ion-col>
        <ion-col size="12" size-sm="6"><statistics-card v-if="dataset.product_quantity" label="Товаров продано" :data="dataset.product_quantity" format="integer" color="#c304f9" :dates="totalDates"/></ion-col>
      </ion-row>
    </ion-grid>
  </div>
  <div  class="printDiv ">
    <div class="ion-padding-horizontal"> 
      <h5>Товарная статистика {{store.store_name ?? ''}}</h5>
      <p>За последние 7 дней</p>
    </div>
    <ion-grid>
      <ion-row>
        <ion-col size="12" size-sm="4"><statistics-card v-if="dataset.product_viewed" label="Показы" :data="dataset.product_viewed" format="integer" color="#008FFB" :dates="totalDates"/></ion-col>
        <ion-col size="12" size-sm="4"><statistics-card v-if="dataset.product_added" label="Оформление" :data="dataset.product_added" format="integer" color="#04e398" :dates="totalDates"/></ion-col>
        <ion-col size="12" size-sm="4"><statistics-card v-if="dataset.product_purchased" label="Продано" :data="dataset.product_purchased" format="integer" color="#feba37" :dates="totalDates"/></ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12" size-sm="6">
          <statistics-funnel  label="Воронка продаж" :data="funnelData"/>
        </ion-col>
        <ion-col size="12" size-sm="6">
          <statistics-timeline  label="Динамика" :data="timelineSeries" :dates="productDates"/>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script>
import {
  IonGrid,
  IonRow,
  IonChip,
  IonLabel,
  IonIcon,
  IonCol
}                             from "@ionic/vue";
import { 
  printOutline,
  reloadOutline
}                             from "ionicons/icons";
import jquery                 from "jquery";

import StatisticsCard          from "@/components/StatisticsCard.vue";
import StatisticsFunnel        from "@/components/StatisticsFunnel.vue";
import StatisticsTimeline        from "@/components/StatisticsTimeline.vue";

export default {
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
    IonIcon,
    StatisticsCard,
    StatisticsFunnel,
    StatisticsTimeline
  },
  props:['store'],
  setup(){
    return {
      printOutline,
      reloadOutline
    }
  },
  data() {
    return {
      dataset: {},
      head: {},
      body: {},
      productStatistics: {},
      funnelData: {},
      timelineSeries: [],
      totalDates: [],
      productDates: []
    };
  },
  methods: {
    async parametersGet() {
      try {
        const response = await jquery.post(`${this.$heap.state.hostname}Statistics/sellParametersGet`, {store_id: this.store.store_id, point_span: 7, point_num: 10})
        if(response.body.length > 0){
          response.body.reverse()
          this.parseStatisticResponse(response)
          this.totalDates = this.parseDates(response)
        }
      } catch (err) {
        const exception_code = err?.responseJSON?.messages?.error;
        switch (exception_code) {
          case "large_interval":
            this.$flash("Период должен быть не больше 3 месяцев")
            break;
          default:
            console.log(err)
            this.$flash("Ошибка получения выписки")
            break;
        }
        this.ledger=[]
        this.balance=0
        return false;
      }
    },
    async productsGet() {
      try {
        const response = await jquery.post(`${this.$heap.state.hostname}Statistics/sellProductFunnelGet`, {store_id: 119, point_span: 7, point_num: 10})
        if(response.body.length > 0){
          response.body.reverse()
          this.productDates = this.parseDates(response)
          this.parseStatisticResponse(response)
          this.parseFunnelData(response)
          this.parseTimelineData(response)
        }
      } catch (err) {
        const exception_code = err?.responseJSON?.messages?.error;
        switch (exception_code) {
          case "large_interval":
            this.$flash("Период должен быть не больше 3 месяцев")
            break;
          default:
            this.$flash("Ошибка получения выписки")
            break;
        }
        this.ledger=[]
        this.balance=0
        return false;
      }
    },
    parseStatisticResponse(response){
      for(var param in response.head.avg){
        this.dataset[param] = {
          avg: response.head.avg[param],
          value: response.body[response.body.length - 1][param],
          series: []
        }
        for(var i in response.body){
          if(response.body[i][param]){
            this.dataset[param].series.push(response.body[i][param])
          }
        }
      }
    },
    parseFunnelData(response){
      this.funnelData = {}
      const bars = {
        product_viewed: 'Показы',
        product_added: 'Оформления',
        product_purchased: 'Продажи'
      }
      this.funnelData = {
        series: [],
        labels: []
      }
      
      const lastChunk = response.body[response.body.length - 1]
      for(var key in bars){
        this.funnelData.series.push(lastChunk[key])
        this.funnelData.labels.push(bars[key])
      }
    },
    parseTimelineData(response){
      this.timelineSeries = []
      const bars = {
        product_viewed: 'Показы',
        product_added: 'Оформления',
        product_purchased: 'Продажи'
      }
      this.timelineSeries = []
      for(var key in bars){
        this.timelineSeries.push({
          name: bars[key],
          data: this.dataset[key].series
        })
      }
    },
    parseDates(response){
        let result = [];
        for(var i in response.body){
            result.unshift(response.body[i].point_finish)
        }
        return result
    },
    async load () {
      await this.parametersGet()
      this.productsGet()
    },
    reportPrint(){
        window.print()
    },
  },
  async mounted () {
    this.load()
    
  },
};
</script>