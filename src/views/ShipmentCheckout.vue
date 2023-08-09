<template>
    <base-layout page-title="Вызов курьера" :cartComponent="CartHeader">


        <ion-button @click="$go('/order/shipment-')">New Shipment</ion-button>
        <ion-button>New Shopping</ion-button>
    </base-layout>
</template>
<script>
import {
    IonButton
}               from '@ionic/vue'


export default {
    components:{
        IonButton,
    },


}
</script>