<template>
  <base-layout page-title="Сообщения" hideBackLink="true">
    <ion-item @click="itemOpen(-100)">
        <ion-icon :src="simpleLogo" slot="start" size="large"/>
        <div>
            <ion-label><b>Поддержка Тезкель</b></ion-label>
            <ion-note>На склад поступили</ion-note>
        </div>
    </ion-item>
  </base-layout>
</template>
<script>
import { 
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonNote,
    IonSkeletonText,
}                           from '@ionic/vue';
import {
    informationOutline,
}                           from 'ionicons/icons';
import simpleLogo           from "@/assets/icons/tezkel_simple_logo.svg";

export default {
    components: {
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonNote,
    IonSkeletonText,
    },
    setup() {
      return { 
        informationOutline,simpleLogo
            };
    },
    data(){
        return {
            room_id:this.$route.params.id,
        };
    },

    methods:{
        toLocDate( iso ){
            const event = new Date(Date.parse(iso));
            const options = { month: 'short', day: 'numeric' };

            return event.toLocaleDateString(undefined, options);
        },
    }
}
</script>