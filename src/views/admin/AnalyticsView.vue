<style>
.grid{
    display: grid;
}
.row{
    display: flex;
}
.col{
    width: 100%;
}
#printPage {
    display: none;
}
.print-nonbreakable {
    page-break-after: avoid;
    break-inside: avoid;
}
@media print {
    body #app {
        display: none;
    }
    body #printPage{
        display: contents !important;
    } 
}
</style>
<template>
    <base-layout pageTitle="Общая статистика" pageDefaultBackLink="/user">
  <div class="horizontalScroller">
      <ion-chip @click="reportPrint()" color="medium"><ion-icon :src="printOutline"/><ion-label>Напечатать</ion-label></ion-chip> 
  </div>
        <div id="analysisPage">
                <div class="print-nonbreakable">
                    <div class="ion-padding-horizontal"> 
                        <h5>Статистика действий по заказам</h5>
                        <p>За последние 7 дней</p>
                    </div>
                    <statistics-stacked-bar-timeline  label="Воронка заказов" :data="dataset" :dates="totalDates"/>
                </div>
                <div class="grid">
                    <div class="row">
                        <div class="col">
                            <statistics-radial-pie  v-if="datasetPie.pay"  label="Успешные оплаты" :data="datasetPie.pay"/>
                        </div>
                        <div class="col">
                            <statistics-radial-pie  v-if="datasetPie.completed"  label="Отказы продавцов" :data="datasetPie.completed"/>
                        </div>
                    </div>
                </div>
                <div class="print-nonbreakable">
                    <div class="ion-padding-horizontal"> 
                        <h5>Рейтинг продавцов</h5>
                        <p>За последние 7 дней</p>
                    </div>
                    <div class="grid">
                        <div class="row">
                            <div class="col">
                                <statistics-rating-list  v-if="datasetRatingLists.top_stores"  label="Лучшие продавцы" :data="datasetRatingLists.top_stores"/>
                            </div>
                            <div class="col">
                                <statistics-rating-list  v-if="datasetRatingLists.antitop_stores"  label="Худшие продавцы" :data="datasetRatingLists.antitop_stores"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="print-nonbreakable">
                    <div class="ion-padding-horizontal"> 
                        <h5>Рейтинг товаров</h5>
                        <p>За последние 7 дней</p>
                    </div>
                    <div class="grid">
                        <div class="row">
                            <div class="col">
                                <statistics-rating-list  v-if="datasetRatingLists.top_products"  label="Лучшие товары" :data="datasetRatingLists.top_products"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="print-nonbreakable">
                    <div class="ion-padding-horizontal"> 
                        <h5>Статистика отказов</h5>
                        <p>За последние 7 дней</p>
                    </div>
                    <statistics-stacked-bar-timeline  label="Отказы" :data="datasetRejections" :dates="rejectionDates" :showTotal="true" :showDynamics="true"/>
                </div>
            </div>
    </base-layout>
</template>

<script>
import {
  IonChip,
  IonLabel,
  IonIcon
}                             from "@ionic/vue";
import { 
  printOutline
}                                   from "ionicons/icons";
import StatisticsRadialPie          from "@/components/StatisticsRadialPie.vue";
import StatisticsStackedBarTimeline from "@/components/StatisticsStackedBarTimeline.vue";
import StatisticsRatingList         from "@/components/StatisticsRatingList.vue";


import jQuery                       from "jquery";

export default {
    components:{
        IonChip,
        IonLabel,
        IonIcon,
        StatisticsStackedBarTimeline,
        StatisticsRadialPie,
        StatisticsRatingList
    },
    setup(){
        return {
        printOutline
        }
    },
    data(){
        return {
            dataset: [],
            totalDates: [],
            datasetPie: {},
            datasetRatingLists: {},
            datasetRejections: [],
            rejectionDates: []
        }
    },
    async mounted (){
        await this.analysisGet()
        await this.topRatingGet()
        this.rejectionAnalysisGet()
    },
    methods:{
        async analysisGet(){
            const response = await jQuery.post(`${this.$heap.state.hostname}Statistics/totalOrderAnalysisGet`, {point_span: 7, point_num: 10})
            response.body.reverse()
            this.parseAnalysisResponse(response.body)
            this.parsePieStatisticResponse(response.body)
            this.totalDates = this.parseDates(response.body)
        },
        async topRatingGet(){
            const raitingResponse = await jQuery.post(`${this.$heap.state.hostname}Statistics/ratingAnalysisGet`, {point_span: 7, point_num: 10})
            this.datasetRatingLists = raitingResponse.body
        },
        async rejectionAnalysisGet(){
            const rejectionResponse = await jQuery.post(`${this.$heap.state.hostname}Statistics/rejectionAnalysisGet`, {point_span: 7, point_num: 10})
            rejectionResponse.body.reverse()
            this.parseRejectionResponse(rejectionResponse.body)
            this.rejectionDates = this.parseDates(rejectionResponse.body)
        },
        parseAnalysisResponse(response){
            const bars = {
                create: 'Начало оформления',
                start: 'Оформление',
                finish: 'Завершение'
            }
            const statuses = {
                success: 'Успех',
                failure: 'Ошибка'
            }
            for(var param in bars){
                for(var status in statuses){
                    let series_item = {
                        name: bars[param] + ' (' + statuses[status] + ')',
                        group: param,
                        data: []
                    }
                    for(var i in response){
                        series_item.data.push(response[i][param+'_'+status]*1)
                    }
                    this.dataset.push(series_item)
                }
            }
        },
        parsePieStatisticResponse(response){
            const bars = {
                pay: 'Оплаты',
            }
            const statuses = {
                success: 'Успех',
                failure: 'Ошибка'
            }
            const lastChunk = response[response.length - 1]
            for(var param in bars){
                this.datasetPie[param] = {
                    labels: [],
                    series: []
                }
                for(var status in statuses){
                    if(lastChunk[param+'_'+status]){
                        this.datasetPie[param].series.push(lastChunk[param+'_'+status]*1)
                        this.datasetPie[param].labels.push(statuses[status])
                    }
                }
            }
            this.datasetPie.completed = {
                series: [lastChunk.finish_success*1 - lastChunk.reject_success*1, lastChunk.reject_success*1],
                labels: ['Исполнен', 'Отказ']
            }
        },
        parseRejectionResponse(response){
            const bars = {
                home: 'Главная',
                store: 'Продавец',
                product: 'Товар',
                location: 'Локация',
                auth: 'Вход'
            }

            for(var param in bars){
                let series_item = {
                    name: bars[param],
                    data: []
                }
                for(var i in response){
                    series_item.data.push(response[i][param]*1)
                }
                this.datasetRejections.push(series_item)
            }
        },
        parseDates(response){
            let result = [];
            for(var i in response){
                result.unshift(response[i].point_finish)
            }
            return result
        },
        reportPrint(){
            document.getElementById('printPage')?.remove();
            document.body.setAttribute('class', 'print')
            let page = document.getElementById('analysisPage');
            let newElement = document.createElement('DIV');
            newElement.setAttribute('id', 'printPage');
            newElement.innerHTML = page.innerHTML;
            document.body.appendChild(newElement)
            setTimeout(window.print(), 500)
        }
    },
}
</script>