<style scoped>
    ion-datetime {
        --background: #fff;
        --wheel-fade-background-rgb: 255, 255, 255;
    }
</style>
<template>
    <div style="height:100%;">
        <ion-content class="ion-padding">
            <h3 style="color:#999">Выбрать день и время</h3>
            <ion-datetime 
                style="max-width:100%;border-radius:10px"
                presentation="date-time" 
                v-model="datetime"
                :prefer-wheel="true" 
                :first-day-of-week="1" 
                :min="dateRange?.dayFirst"
                :max="dateRange?.dayLast"
                :hour-values="hourValues"
                :minute-values="minuteValues"
                @ionChange="validate(datetime)"
            />
            <ion-button color="primary" @click="confirm()" expand="block" :disabled="notvalid">Ок</ion-button>
            <ion-button color="light" @click="cancel()" expand="block">Закрыть</ion-button>
        </ion-content>
    </div>
</template>
<script>
import {
        modalController,
        IonDatetime,
        IonContent,
        IonButton,
}               from '@ionic/vue'
import {
  closeOutline,
}                         from 'ionicons/icons';
export default {
    props:['dateRange','defaultDatetime'],
    components:{
        IonDatetime,
        IonContent,
        IonButton,
    },
    setup(){
        return {closeOutline}
    },
    data(){
        const dtime=this.defaultDatetime?.replace(' ','T')
        return {
            datetime:dtime,
            notvalid:false,
        }
    },
    computed:{
        hourValues(){
            if(this.dateRange && this.dateRange.dayHours && this.datetime){
                const [pickedDate]=this.datetime.split('T')
                let dayHour=[]
                for(let h in this.dateRange.dayHours[pickedDate]){
                    const hour=h.split('_')[1]
                    dayHour.push(hour)
                }
                return dayHour
            }
            return null
        },
        minuteValues(){
            const [pickedDate,pickedTime]=this.datetime.split('T')
            const [hour,minute,second]=pickedTime.split(':')
            let minutes=null
            //console.log(pickedDate,hour,minute,second,this.dateRange.dayHours[pickedDate][`h_${hour}`])
            return this.dateRange.dayHours[pickedDate]?.[`h_${hour}`]
        }
    },
    methods:{
        validate(){
            const [pickedDate]=this.datetime.split('T')
            const haveWorkingHours=this.dateRange.dayHours[pickedDate]
            if( haveWorkingHours ){
                this.notvalid=0
                return
            }
            this.$flash("Выходной день")
            this.notvalid=1
        },
        confirm(){
            if(this.notvalid){
                return
            }
            modalController.dismiss(this.datetime, 'confirm')
        },
        cancel(){
            modalController.dismiss(null, 'cancel')
        },
    },
    mounted(){
        this.validate()
    }
}
</script>