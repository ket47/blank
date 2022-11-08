<template>
    <ion-header>
        <ion-toolbar color="secondary">
            <ion-title><ion-icon :icon="briefcaseOutline" /> Добавить тариф</ion-title>
            <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
        </ion-toolbar>
    </ion-header>
  <ion-content>
        <ion-list>
            <ion-item>
                <ion-label>Тариф</ion-label>
                <ion-select slot="end" v-model="tariff_id" interface="action-sheet" placeholder="Выберите тариф">
                    <ion-select-option :value="tariff.tariff_id" v-for="tariff in tariffList" :key="tariff.tariff_id">
                        {{tariff.tariff_name}}
                    </ion-select-option>
                </ion-select>
            </ion-item>
            <ion-item>
                <ion-label>Начало действия</ion-label>
                <ion-input slot="end" type="date" v-model="start_at"/>
            </ion-item>
            <ion-item>
                <ion-label>Окончание действия</ion-label>
                <ion-input slot="end" type="date" v-model="finish_at"/>
            </ion-item>
        </ion-list>
        <ion-button @click="itemCreate()" expand="block">Добавить</ion-button>
  </ion-content>
</template>

<script>
import { 
    IonContent,
    IonToolbar,
    IonButton,
    IonHeader,
    IonIcon,
    IonTitle,
    IonLabel,
    IonSelectOption,
    IonSelect,
    IonItem,
    IonInput,
    IonList,
    modalController
}                       from "@ionic/vue";
import { 
    briefcaseOutline,
    closeOutline 
}                       from 'ionicons/icons';
import jquery           from 'jquery';

export default({
    components: {
    IonContent,
    IonToolbar,
    IonButton,
    IonHeader,
    IonIcon,
    IonTitle,
    IonLabel,
    IonSelectOption,
    IonSelect,
    IonItem,
    IonInput,
    IonList,
    },
    props:['store_id'],
    setup() {
        const closeModal = function(){
            modalController.dismiss();
        };
        return { closeModal, briefcaseOutline, closeOutline };
    },
    data(){
        return {
            start_at:null,
            finish_at:null,
            tariff_id:null,
            tariffList:null
        };
    },
    methods:{
        async listGet(){
            try{
                this.tariffList=await jquery.post(`${this.$heap.state.hostname}Admin/Tariff/listGet`)
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
        async itemCreate(){
            if(    !this.tariff_id
                || !this.store_id
                || !this.start_at
                || !this.finish_at
                ){
                    this.$flash("Форма не заполнена полностью");
                    return
            }
            const request={
                tariff_id:this.tariff_id,
                store_id:this.store_id,
                start_at:this.start_at,
                finish_at:this.finish_at,
            }
            modalController.dismiss(request);
        },
    },
    mounted(){
        this.listGet()
    }
    
});
</script>