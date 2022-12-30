<template>
    <base-layout pageDefaultBackLink="/user/" page-title="Редактирование тарифа">    
        <ion-list @change="itemUpdate()">
            <ion-item>
                <ion-label position="floating">Название тарифа</ion-label>
                <ion-input v-model="tariff.tariff_name" placeholder="название" color="primary" style="font-size:1.5em"></ion-input>
            </ion-item>
            <ion-item lines="full">
                <ion-label>Отключен</ion-label>
                <ion-toggle v-model="tariff.is_disabled" @click="itemUpdate()" />
            </ion-item>
            <ion-item lines="full">
                <ion-label>Удалить</ion-label>
                <ion-icon :icon="trashOutline" color="danger" @click="itemDelete()" />
            </ion-item>

            <ion-item-divider>
                Настройки тарифа
            </ion-item-divider>
        </ion-list>
        <ion-grid @change="itemUpdate()">
            <ion-row>
                <ion-col></ion-col>
                <ion-col>Разрешено</ion-col>
                <ion-col>Комиссия%</ion-col>
                <ion-col>Плата {{$heap.state.currencySign}}</ion-col>
            </ion-row>

            <ion-row>
                <ion-col><ion-label>Заказ</ion-label></ion-col>
                <ion-col><ion-toggle v-model="tariff.order_allow" @click="itemUpdate()" /></ion-col>
                <ion-col><ion-input  v-model="tariff.order_fee" placeholder="%" /></ion-col>
                <ion-col><ion-input  v-model="tariff.order_cost" :placeholder="$heap.state.currencySign" /></ion-col>
            </ion-row>

            <ion-row>
                <ion-col><ion-label>Опл. картой</ion-label></ion-col>
                <ion-col><ion-toggle v-model="tariff.card_allow"  @click="itemUpdate()" /></ion-col>
                <ion-col><ion-input  v-model="tariff.card_fee" placeholder="%" /></ion-col>
                <ion-col></ion-col>
            </ion-row>

            <ion-row>
                <ion-col><ion-label>Опл. наличными</ion-label></ion-col>
                <ion-col><ion-toggle v-model="tariff.cash_allow" @click="itemUpdate()" /></ion-col>
                <ion-col><ion-input  v-model="tariff.cash_fee" placeholder="%" /></ion-col>
                <ion-col></ion-col>
            </ion-row>

            <ion-row>
                <ion-col><ion-label>Доставка</ion-label></ion-col>
                <ion-col><ion-toggle v-model="tariff.delivery_allow" @click="itemUpdate()" /></ion-col>
                <ion-col><ion-input  v-model="tariff.delivery_fee" placeholder="%" /></ion-col>
                <ion-col><ion-input  v-model="tariff.delivery_cost" :placeholder="$heap.state.currencySign" /></ion-col>
            </ion-row>
        </ion-grid>
    </base-layout>
</template>
<script>
import {
  IonInput,
  IonIcon,
  IonList,
  IonItem,
  IonToggle,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonItemDivider,
}                          from '@ionic/vue';
import {
    trashOutline
}                          from 'ionicons/icons'
import jquery              from 'jquery'

export default {
    components: {
  IonInput,
  IonIcon,
  IonList,
  IonItem,
  IonToggle,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonItemDivider,
    },
    setup(){
        return {trashOutline}
    },
    data(){
        return{
            tariffId: this.$route.params.id,
            tariff:{},
            updateallow:false,
        }
    },
    computed:{
    },
    methods:{
        async itemGet(){
            let request={
                tariff_id:this.tariffId
            };
            try{
                this.tariff=await jquery.post(`${this.$heap.state.hostname}Admin/Tariff/itemGet`,request)
            }
            catch(err){
                const exception=err.responseJSON;
                const exception_code=exception.messages.error;
                switch(exception_code){
                    case 'forbidden':
                        this.$flash("Не достаточно прав");
                        break;
                }
                return false
            }
        },
        async itemUpdate(){
            let request=this.tariff;
            try{
                await jquery.post(`${this.$heap.state.hostname}Admin/Tariff/itemUpdate`,JSON.stringify(request))
                this.$flash("сохранено")
            }
            catch(err){
                const exception=err.responseJSON;
                const exception_code=exception.messages.error;
                switch(exception_code){
                    case 'forbidden':
                        this.$flash("Не достаточно прав");
                        break;
                }
                return false
            }
        },
        async itemDelete(){
            if(!confirm("Вы уверенны?")){
                return
            }
            try{
                await jquery.post(`${this.$heap.state.hostname}Admin/Tariff/itemDelete`,{tariff_id:this.tariffId})
                this.$router.go(-1);
            }catch{/** */}
        }
    },
    mounted(){
        this.itemGet();
    },
}
</script>