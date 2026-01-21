<template>
  <base-layout page-title="Сообщения" hideBackLink="true">
  <ion-list>
    <ion-item @click="itemOpen(-100)">
        <ion-icon :src="simpleLogo" slot="start" size="large"/>
        <div>
            <ion-label><b>Поддержка Тезкель</b></ion-label>
            <ion-note>На склад поступили</ion-note>
        </div>
    </ion-item>
  </ion-list>
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
    sparklesOutline,
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
      return { sparklesOutline,simpleLogo };
    },
    data(){
        return {
        };
    },
    mounted(){
        const evtSource = new EventSource(`${this.$heap.state.hostname}Talk/noticeListGet`);
        evtSource.addEventListener("chat", function(e) {
            const data = JSON.parse(e.data);
            console.log("Structured update received:", data);
        });
    },

    methods:{
        toLocDate( iso ){
            const event = new Date(Date.parse(iso));
            const options = { month: 'short', day: 'numeric' };

            return event.toLocaleDateString(undefined, options);
        },
        itemOpen(room_id){
            //this.$go(`/admin/chat-room-${room_id}`)
        }
    }
}
</script>