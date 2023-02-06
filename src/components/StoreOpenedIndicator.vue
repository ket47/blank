<template>
    <ion-chip v-if="storeItem.is_opened==1" color="medium">
        <label><ion-text color="success"> ◉ </ion-text>Открыт до {{ storeItem.store_time_closes }}:00</label>
    </ion-chip>
    <ion-chip v-else color="medium">
        <label v-if="storeItem.is_working==0"><ion-text color="medium"> ◉ </ion-text>Временно не работает</label>
        <label v-else-if="storeItem.store_next_time_opens>0"><ion-text color="danger"> ◉ </ion-text>Закрыт до {{ storeItem.store_next_time_opens }}:00</label>
        <label v-else><ion-text color="danger"> ◉ </ion-text>Закрыт</label>
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