<template>
    <base-layout page-title="Вызов курьера" :cartComponent="CartHeader">


        <ion-button @click="itemCreate(0)">New Shipment</ion-button>
        <ion-button @click="itemCreate(1)">New Shopping</ion-button>
    </base-layout>
</template>
<script>
import {
    IonButton
}                       from '@ionic/vue'
import jQuery           from "jquery";

export default {
    components:{
        IonButton,
    },
    methods:{
        async itemCreate( is_shopping=0 ){
            const request={
                is_shopping,
            }
            try{
                const result=await jQuery.post(`${this.$heap.state.hostname}Shipment/itemCreate`,request)
                this.$go(`/order/shipment-${result}`)
            } catch(err){
                console.log(err)
            }
        }
    }
}
</script>