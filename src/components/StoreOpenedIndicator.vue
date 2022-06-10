<template>
    <ion-chip v-if="storeItem.is_opened==1" color="success">Открыт до {{ storeItem.store_time_closes }}:00</ion-chip>
    <ion-chip v-else color="danger">
        <span v-if="storeItem.is_working==0">Временно не работает</span>
        <span v-else-if="storeItem.store_next_time_opens>0">Закрыт до {{ storeItem.store_next_time_opens }}:00</span>
        <span v-else>Закрыт</span>
    </ion-chip>
</template>
<script>
import {
    IonChip
} from '@ionic/vue'
export default {
    props:['storeItem'],
    components:{
        IonChip
    }
}
</script>