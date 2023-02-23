<template>
    <base-layout page-title="Нет связи с интернетом"  pageDefaultBackLink="/">
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
            this.$router.replace('/')
        },
        async checkOnline(){
            try{
                const user=User.get()
                this.$flash("Связь установлена")
                this.$router.replace('/')
            }catch{
                const self=this
                setTimeout(()=>{self.checkOnline()},10000)
            }
        }
    },
    mounted(){
        this.checkOnline()
    }
}
</script>