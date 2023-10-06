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
            <ion-list  lines="none">
                <ion-item>
                    <ion-textarea v-model="description" rows="5" label="" placeholder="напишите, что будем везти" style="background-color:var(--ion-color-light);border-radius:10px"></ion-textarea>
                </ion-item>
                
                <ion-item lines="full">
                    Подтверждаю, что посылка:
                </ion-item>

                <ion-item>
                    <ion-checkbox v-model="isDimentionValid">меньше 40см</ion-checkbox>
                </ion-item>
                <ion-item>
                    <ion-checkbox v-model="isWeightValid">легче 8кг</ion-checkbox>
                </ion-item>
                <ion-item>
                    <ion-checkbox v-model="isContentValid">без запрещенных вещей</ion-checkbox>
                </ion-item>
            </ion-list>

            <ion-button v-if="!isValid && !description" disabled expand="block" color="medium">Заполните описание</ion-button>
            <ion-button v-else-if="!isValid && (!isDimentionValid||!isWeightValid||!isContentValid)" disabled expand="block" color="medium">Подтвердите условия</ion-button>
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
  checkmarkOutline,
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
        return {
            closeOutline,
            checkmarkOutline,
            }
    },
    data(){
        return {
            description:this.ship_description,
            isDimentionValid:this.ship_description?1:0,
            isWeightValid:this.ship_description?1:0,
            isContentValid:this.ship_description?1:0,
        }
    },
    computed:{
        isValid(){
            return this.description && this.isDimentionValid && this.isWeightValid && this.isContentValid
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