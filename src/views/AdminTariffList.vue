<template>
    <base-layout pageDefaultBackLink="/user" page-title="Список тарифов">
        <ion-list>
            <ion-item v-for="tariff in tariffList" :key="tariff.tariff_id" detail button @click="$go(`/user/admin-tariff-edit-${tariff.tariff_id}`)">
                <ion-icon :icon="briefcaseOutline" slot="start" color="primary"></ion-icon>
                <ion-label>{{tariff.tariff_name}}</ion-label>
            </ion-item>
            <ion-item detail button @click="itemCreate()">
                <ion-icon :icon="addOutline" slot="start"></ion-icon>
                <ion-label>Добавить тариф</ion-label>
            </ion-item>
        </ion-list>
    </base-layout>
</template>
<script>
import {
  briefcaseOutline,
  addOutline
} from "ionicons/icons";
import {
  IonItem,
  IonLabel,
  IonList,
  IonIcon
 }                          from '@ionic/vue';
import jquery               from 'jquery'

export default {
    components: {
        IonItem,
        IonLabel,
        IonList,
        IonIcon,
    },
    setup(){
        return {briefcaseOutline,addOutline}
    },
    data(){
        return{
            tariffList:[]
        }
    },
    computed:{
    },
    methods:{
        async listLoad(){
            try{
                this.tariffList=await jquery.post(`${this.$heap.state.hostname}Admin/Tariff/listGet`)
            }catch{/** */}
        },
        async itemCreate(){
            let request={
                tariff_name:'new tariff'
            };
            try{
                let tariff_id=await jquery.post(`${this.$heap.state.hostname}Admin/Tariff/itemCreate`,JSON.stringify(request))
                this.$go(`/user/admin-tariff-edit-${tariff_id}`)
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
        async itemDelete(tariff_id){
            if(!confirm("Вы уверены")){
                return
            }
            let request={
                tariff_id:tariff_id
            };
            try{
                await jquery.post(`${this.$heap.state.hostname}Admin/Tariff/itemDelete`,JSON.stringify(request))
                this.listLoad()
            }
            catch(err){
                const exception=err.responseJSON;
                const exception_code=exception.messages.error;
                switch(exception_code){
                    case 'forbidden':
                        this.$flash("Не достаточно прав");
                        break;
                }
            }
        },
    },
    mounted(){
        this.listLoad();
    },
    ionViewDidEnter() {
        if(!this.tariffList.length){
            this.listLoad();
        }
    },
    ionViewDidLeave(){
        this.tariffList=[];
    },
}
</script>