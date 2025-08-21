<style>
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
    body #printPage .block{
        flex: 0 0 47% !important;
    }
}
</style>
<template>
    <base-layout pageTitle="Общая статистика" pageDefaultBackLink="/user">
        <div class="horizontalScroller">
            <ion-chip @click="reportPrint()" color="medium"><ion-icon :src="printOutline"/><ion-label>Напечатать</ion-label></ion-chip> 
            <ion-chip @click="listGet()" color="medium"><ion-icon :src="reloadOutline"/><ion-label>Обновить</ion-label></ion-chip> 
        </div>
        <ion-list>
            <ion-item>
                <ion-text color="medium">Дата</ion-text>
                <div slot="end" style="display:grid;grid-template-columns:120px 100px;">
                    <ion-input @ionInput="listGet" type="date" v-model="finish_at"/>
                </div>
            </ion-item>
            <ion-item>
                <ion-select v-model="user_group" @ionChange="listGet" label="Группа пользователей" placeholder="Выберите группу..." :multiple="true">
                    <ion-select-option value="guest">Гость</ion-select-option>
                    <ion-select-option value="customer">Покупатель</ion-select-option>
                    <ion-select-option value="courier">Курьер</ion-select-option>
                    <ion-select-option value="supplier">Продавец</ion-select-option>
                    <ion-select-option value="admin">Администратор</ion-select-option>
                </ion-select>
            </ion-item>
            <ion-item>
                <ion-toggle @ionChange="order_only = $event.target.checked; listGet()" justify="space-between">Только заказавшие</ion-toggle>
            </ion-item>
        </ion-list>
        <div id="userMetricPage">
            <div v-if="data.length > 0">
                <div v-html="data"></div>
                <ion-infinite-scroll @ionInfinite="listLoadMore($event)" id="user-metric-infinite-scroll">
                    <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Загрузка..."></ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </div>
            <div v-else>
                <div style="padding: 1em 2em;">
                    <h4>Ничего не найдено</h4>
                    <p style="font-size: 14px; margin: 0;">Нет активности за выбранный период</p>
                </div>
            </div>
        </div>
    </base-layout>
</template>

<script>
import {
    IonChip,
    IonLabel,
    IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonText,
    IonSelect,
    IonSelectOption,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonToggle
}                             from "@ionic/vue";
import { 
  calendarOutline,
  addOutline,
  calculatorOutline,
  printOutline,
  reloadOutline,
}                             from "ionicons/icons";


import jQuery                 from "jquery";
import Utils                  from '@/scripts/Utils.js'
import User                   from '@/scripts/User.js'

export default {
    components:{
        IonChip,
        IonLabel,
        IonIcon,
        IonList,
        IonItem,
        IonInput,
        IonText,
        IonSelect,
        IonSelectOption,
        IonInfiniteScroll,
        IonInfiniteScrollContent,
        IonToggle
    },
    setup(){
        return {
            printOutline,
            calendarOutline,
            addOutline,
            calculatorOutline,
            reloadOutline,
        }
    },
    data(){
        const today=Utils.date.today()
        return {
            data: [],
            finish_at: Utils.date.toIso(today),
            user_group: ['guest','admin','courier','customer','supplier'],
            order_only: false,
            currentPage: 0
        }
    },
    computed:{
        is_admin(){
            return User.isAdmin()
        },
        finish_at_dmy(){
            return Utils.date.isoToDmy(this.finish_at)
        },
    },
    async mounted (){
        this.listGet()
    },
    methods:{
        async listLoadMore(ev){
            await this.listGet('append')
            ev.target.complete();
        },
        async listGet(mode = ''){
            const request={
                finish_at: this.finish_at,
                user_group: this.user_group,
                order_only: this.order_only
            }
            if(mode == 'append'){
                this.currentPage++;
            } else {
                this.currentPage = 0;
            }
            request.page = this.currentPage
            const response = await jQuery.post(this.$heap.state.hostname + 'Metric/buildView', request)
            if(!response){
                return
            }
            if(mode == 'append'){
                this.data += response
            } else {
                this.data = response
            }
        },
        reportPrint(){
            document.getElementById('printPage')?.remove();
            document.body.setAttribute('class', 'print')
            let page = document.getElementById('userMetricPage');
            let newElement = document.createElement('DIV');
            newElement.setAttribute('id', 'printPage');
            newElement.innerHTML = page.innerHTML;
            document.body.appendChild(newElement)
            setTimeout(window.print(), 500)
        }
    },
}
</script>