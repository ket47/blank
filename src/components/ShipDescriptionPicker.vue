<template>
    <div style="height:100%">
        <ion-header>
            <ion-toolbar>
                <ion-item lines="none">
                    <ion-title>Описание посылки</ion-title>
                    <ion-icon slot="end" @click="cancel();" :icon="closeOutline" size="large"></ion-icon>   
                </ion-item>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item lines="full">
                <ion-textarea v-model="description" rows="5" label="Описание посылки" label-placement="stacked" placeholder="что будем везти?"></ion-textarea>
            </ion-item>
            <ion-item lines="none">
                Подтверждаю, что посылка
            </ion-item>

            <div style="display:grid;grid-template-columns:1fr 1fr;width:100%">
                <ion-card :color="isDimentionValid?'light':''" mode="md">
                    <ion-card-content>
                            <ion-checkbox v-model="isDimentionValid" label-placement="end">меньше 40см</ion-checkbox>
                    </ion-card-content>
                </ion-card>
                <ion-card :color="isWeightValid?'light':''" mode="md">
                    <ion-card-content>
                        <ion-checkbox v-model="isWeightValid" label-placement="end">легче 8кг</ion-checkbox>
                    </ion-card-content>
                </ion-card>
            </div>

            <ion-button v-if="!isValid && !description" disabled expand="block" color="medium">Заполните описание</ion-button>
            <ion-button v-else-if="!isValid && (!isDimentionValid||!isWeightValid)" disabled expand="block" color="medium">Подтвердите размеры</ion-button>
            <ion-button v-else expand="block" @click="confirm()">Ок</ion-button>
        </ion-content>
    </div>
</template>
<script>
import {
        modalController,
        IonTitle,
        IonToolbar,
        IonContent,
        IonHeader,
        IonIcon,
        IonItem,
        IonButton,
        IonCheckbox,
        IonTextarea,
        IonCard,
        IonCardContent,
}                           from '@ionic/vue'
import {
  closeOutline,
}                           from 'ionicons/icons';
export default {
    props:['ship_description'],
    components:{
        IonTitle,
        IonToolbar,
        IonContent,
        IonHeader,
        IonIcon,
        IonItem,
        IonButton,
        IonCheckbox,
        IonTextarea,
        IonCard,
        IonCardContent,
    },
    setup(){
        return {closeOutline}
    },
    data(){
        return {
            description:this.ship_description,
            isDimentionValid:this.ship_description?1:0,
            isWeightValid:this.ship_description?1:0,
        }
    },
    computed:{
        isValid(){
            return this.description && this.isDimentionValid && this.isWeightValid
        }
    },
    methods:{
        confirm(){
            modalController.dismiss(this.description, 'confirm')
        },
        cancel(){
            modalController.dismiss(null, 'cancel')
        },
    }
}
</script>