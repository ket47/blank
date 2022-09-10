<template>
    <base-layout page-title="Нет связи с интернетом"  pageDefaultBackLink="/catalog">
        <ion-card>
            <ion-card-header>
                <ion-card-title>Нет связи с интернетом</ion-card-title>
                
            </ion-card-header>
            <ion-card-content>
                <ion-button @click="reload()">Перезапустить приложение</ion-button>
            </ion-card-content>
        </ion-card>
    </base-layout>
</template>
<script>
import {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonButton
} from '@ionic/vue'
import User from '@/scripts/User.js'
export default {
    components:{
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonButton
    },
    methods:{
        reload(){
            location.hash=""
            location.reload()
        },
        // checkOnline(){
        //     const user=User.get()
        //     if(user){
        //         this.$router.push('/home')
        //     }
        // }
    }
}
</script>