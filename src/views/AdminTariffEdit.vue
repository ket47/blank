<template>
    <base-layout pageDefaultBackLink="/user" page-title="Редактирование тарифа">    
        <ion-list>
            <ion-item>
                <ion-input label="Название тарифа" label-placement="floating" v-model="tariff.tariff_name" placeholder="название" debounce="600" @ionInput="itemUpdate()"/>
            </ion-item>
            <ion-item lines="full">
                <ion-toggle v-model="tariff.is_disabled" @ionChange="itemUpdate()">Отключен</ion-toggle>
            </ion-item>
            <ion-item lines="full">
                <ion-label>Удалить</ion-label>
                <ion-icon :icon="trashOutline" color="danger" @click="itemDelete()" />
            </ion-item>

            <ion-item-divider>
                Настройки тарифа
            </ion-item-divider>
        </ion-list>
        <div style="overflow-x:scroll">
        <ion-grid @change="itemUpdate()" style="min-width:470px">
            <ion-row>
                <ion-col></ion-col>
                <ion-col>Разрешено</ion-col>
                <ion-col>Комиссия%</ion-col>
                <ion-col>Плата {{$heap.state.currencySign}}</ion-col>
            </ion-row>

            <ion-row>
                <ion-col><ion-label>Заказ</ion-label></ion-col>
                <ion-col><ion-toggle aria-label="" v-model="tariff.order_allow" @ionChange="itemUpdate()"></ion-toggle></ion-col>
                <ion-col><ion-input label=""  v-model="tariff.order_fee" placeholder="%" /></ion-col>
                <ion-col><ion-input label=""  v-model="tariff.order_cost" :placeholder="$heap.state.currencySign" /></ion-col>
            </ion-row>

            <ion-row>
                <ion-col><ion-label>Опл. картой</ion-label></ion-col>
                <ion-col><ion-toggle aria-label="" v-model="tariff.card_allow"  @ionChange="itemUpdate()"></ion-toggle></ion-col>
                <ion-col><ion-input label=""  v-model="tariff.card_fee" placeholder="%" /></ion-col>
                <ion-col></ion-col>
            </ion-row>

            <ion-row>
                <ion-col><ion-label>Опл. наличными</ion-label></ion-col>
                <ion-col><ion-toggle aria-label="" v-model="tariff.cash_allow" @ionChange="itemUpdate()"></ion-toggle></ion-col>
                <ion-col><ion-input label=""  v-model="tariff.cash_fee" placeholder="%" /></ion-col>
                <ion-col></ion-col>
            </ion-row>

            <ion-row>
                <ion-col><ion-label>Доставка</ion-label></ion-col>
                <ion-col><ion-toggle aria-label="" v-model="tariff.delivery_allow" @ionChange="itemUpdate()"></ion-toggle></ion-col>
                <ion-col><ion-input label=""  v-model="tariff.delivery_fee" placeholder="%" /></ion-col>
                <ion-col><ion-input label=""  v-model="tariff.delivery_cost" :placeholder="$heap.state.currencySign" /></ion-col>
            </ion-row>
        </ion-grid>
        </div>
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
  IonItemDivider,
    },
    setup(){
        return {trashOutline}
    },
    data(){
        return{
            tariffId: this.$route.params.id,
            tariff:{},
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
                const self=this;
                setTimeout(()=>self.updateallow=true,100)
                this.tariff.is_disabled*=1
                this.tariff.order_allow*=1
                this.tariff.card_allow*=1
                this.tariff.cash_allow*=1
                this.tariff.delivery_allow*=1
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
            if(!confirm("Вы уверены?")){
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