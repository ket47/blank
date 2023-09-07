<style scoped>
    ion-datetime {
        --background: #fff;
        --wheel-fade-background-rgb: 255, 255, 255;
    }
</style>

<template>
    <div style="height:100%">
        <ion-header>
            <ion-toolbar>
                <ion-title>Время прибытия курьера {{datetime}}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-datetime 
                style="max-width:100%"
                presentation="date-time" 
                v-model="datetime"
                :prefer-wheel="true" 
                :first-day-of-week="1" 
                :min="dateRange?.dayFirst"
                :max="dateRange?.dayLast"
                :hour-values="hv"
                :minute-values="0"
                :show-default-buttons="true"
                @ionConfirm="console.log($event)"
            >
            </ion-datetime>


            <button @click="conf()">iii</button>
        </ion-content>
    </div>
</template>
<script>
import {
        modalController,
        IonTitle,
        IonDatetime,
        IonModal,
        IonToolbar,
        IonButtons,
        IonButton,
        IonContent,
        IonHeader,
}               from '@ionic/vue'
export default {
    props:['dateRange'],
    components:{
        IonTitle,
        IonDatetime,
        IonModal,
        IonToolbar,
        IonButtons,
        IonButton,
        IonContent,
        IonHeader,
    },
    data(){
        return {
            datetime:this.dateRange.dayFirst
        }
    },
    computed:{
        hv(){
            if(this.dateRange && this.dateRange.dayHours && this.datetime){
                const [pickedDate]=this.datetime.split('T')
                //console.log(this.dateRange.dayHours,pickedDate)
                return this.dateRange.dayHours[pickedDate]
            }
            return null
        },
        // pickedDate(){
        //     if(this.datetime){
        //         const [date]=this.datetime.split('T')
        //         return date
        //     }
        //     return null
        // }
    },
    watch:{
        dateRange(){
            this.datetime=this.dateRange.dayFirst
        },
    },
    mounted(){
        //console.log(this.dateRange)
        // this.hourValues=[]
        // console.log(this.dateRange)
        // if(this.dateRange??null){
        //     this.hourValues=this.dateRange.dayHours[this.dateRange.dayFirst]
        // }
    },
    methods:{
        conf(){
            modalController.dismiss('name.value', 'confirm')
        },
        dateChanged(e){
            const datetime=e.detail.value??null
            if(!datetime){
                return
            }
            const [date,time]=datetime.split('T')
            this.hourValues=this.dateRange.dayHours[date]
        }
    }
}
</script>