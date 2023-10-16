<style scoped>
    ion-datetime {
        --background: #fff;
        --wheel-fade-background-rgb: 255, 255, 255;
    }
</style>
<template>
    <div style="height:100%;">
        <ion-header >
            <ion-toolbar>
                <ion-item lines="none">
                    <ion-title>Выбрать день и время</ion-title>
                    <ion-icon slot="end" @click="cancel();" :icon="closeOutline" size="large"></ion-icon>   
                </ion-item>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-card color="light">
                <ion-card-header>
                    <ion-card-title style="font-size:0.9em">
                        Время доставки может отличаться
                    </ion-card-title>
                </ion-card-header>
                <ion-card-content style="font-size:0.7em">
                    Погода, время приготовления, загруженость дорог и другие факторы могут ускорить или замедлить доставку.
                </ion-card-content>
            </ion-card>
            <ion-datetime 
                style="max-width:100%;border-radius:10px"
                presentation="date-time" 
                v-model="datetime"
                :prefer-wheel="true" 
                :first-day-of-week="1" 
                :min="dateRange?.dayFirst"
                :max="dateRange?.dayLast"
                :hour-values="hourValues"
                :minute-values="[0,30]"
            />
            <ion-button color="primary" @click="confirm()" expand="block">Ок</ion-button>
            <ion-button color="light" @click="cancel()" expand="block">Закрыть</ion-button>
        </ion-content>
    </div>
</template>
<script>
import {
        modalController,
        IonTitle,
        IonDatetime,
        IonToolbar,
        IonContent,
        IonHeader,
        IonIcon,
        IonItem,
        IonButton,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
}               from '@ionic/vue'
import {
  closeOutline,
}                         from 'ionicons/icons';
export default {
    props:['dateRange'],
    components:{
        IonTitle,
        IonDatetime,
        IonToolbar,
        IonContent,
        IonHeader,
        IonIcon,
        IonItem,
        IonButton,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
    },
    setup(){
        return {closeOutline}
    },
    data(){
        const hour=this.dateRange.dayHours[this.dateRange.dayFirst][0]
        let dt=`${this.dateRange.dayFirst}T${hour}:00:00`
        if(this.dateRange?.defaultValue){
            dt=this.dateRange.defaultValue
        }
        return {
            datetime:dt
        }
    },
    computed:{
        hourValues(){
            if(this.dateRange && this.dateRange.dayHours && this.datetime){
                const [pickedDate]=this.datetime.split('T')
                return this.dateRange.dayHours[pickedDate]
            }
            return null
        },
    },
    methods:{
        confirm(){
            modalController.dismiss(this.datetime, 'confirm')
        },
        cancel(){
            modalController.dismiss(null, 'cancel')
        },
    }
}
</script>