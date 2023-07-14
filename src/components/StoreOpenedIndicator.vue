<template>
    <ion-chip v-if="storeItem.is_opened==1" style="background: var(--ion-color-success); color: white">
        <label><ion-text color="light"> ◉ </ion-text>Открыт до {{ storeItem.store_time_closes }}:00</label>
    </ion-chip>
    <ion-chip v-else style="background: var(--ion-color-danger); color: white">
        <label v-if="storeItem.is_working==0"><ion-text color="light"> ◉ </ion-text>Временно не работает</label>
        <label v-else-if="storeItem.store_next_time_opens>0"><ion-text color="light"> ◉ </ion-text>Закрыт до {{ storeItem.store_next_time_opens }}:00</label>
        <label v-else><ion-text color="light"> ◉ </ion-text>Закрыт</label>
    </ion-chip>
</template>
<script>
import {
    IonChip,
    IonText
} from '@ionic/vue'
import { ellipse } from 'ionicons/icons'
export default {
    props:['storeItem'],
    components:{
        IonChip, 
        IonText
    },
    setup(){
        return {
            ellipse
        }
    }
}
</script>