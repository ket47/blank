<template>
  <base-layout page-title="Сообщения" hideBackLink="true">
  <ion-list>
    <ion-item v-for="room in rooms_computed" :key="room.notice_holder_id" @click="itemOpen(room.notice_holder_id)">
        <ion-avatar slot="start">
            <ion-icon :src="simpleLogo" size="large"/>
        </ion-avatar>
        
        <div>
            <ion-label><b>{{ room.notice_holder_name }}</b></ion-label>
            <ion-note>{{ room.preview_text }}</ion-note>
        </div>
        <ion-label slot="end">{{ room.last_updated }}</ion-label>
        <ion-badge slot="end">{{ room.new_notice_count }}</ion-badge>
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
            rooms:[]
        };
    },
    mounted(){
        this.listGet()

        clearInterval(localStorage.chatautoreload)
        localStorage.chatautoreload=setInterval(()=>this.listGet(),1000)
    },
    computed:{
        rooms_computed(){
            let rooms=[]
            for(let i in this.rooms){
                let room=this.rooms[i]
                const updated_at=new Date(Date.parse(room.updated_at))
                room.last_updated=updated_at.toLocaleDateString(undefined, { month: 'short', day: 'numeric',hour:'numeric',minute:'numeric' })
                rooms.push(room)
            }
            return rooms
        }
    },
    methods:{
        async listGet(){
            try{
                const rooms=await this.$post(`${this.$heap.state.hostname}Talk/roomListGet`)
                this.rooms=rooms
            }catch{/** */}
        },
        itemOpen(room_id){
            this.$go(`/admin/chat-room-${room_id}`)
        }
    }
}
</script>