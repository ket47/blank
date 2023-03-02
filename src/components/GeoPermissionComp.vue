<template>
  <ion-list>
      <ion-item v-if="permission=='prompt'" lines="none">
        <ion-icon :src="warningOutline" color="warning" slot="start"/>
        <ion-text>
          Используется адрес по умолчанию
        </ion-text>
        <ion-button @click="locate()">Искать около меня</ion-button>
      </ion-item>
      <ion-item v-if="permission=='denied'" lines="none">
        <ion-icon :src="warningOutline" color="danger" slot="start"/>
        <ion-text>
          Используется адрес по умолчанию. Вы блокировали доступ к местоположению
        </ion-text>
      </ion-item>
  </ion-list>
</template>
<script>
import User                 from '@/scripts/User'
import { 
  locationOutline,
  warningOutline,
  }                        from 'ionicons/icons';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonText,
  IonList,
}                           from "@ionic/vue"

export default {
  components:{
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonText,
  IonList,
  },
  setup(){
    return {locationOutline,warningOutline,}
  },
  data(){
    return {
      permission:'notneeded'
    }
  },
  async mounted(){
    this.check()
  },
  methods: {
    async locate(){
      this.check()
      if(this.permission=='granted'){
        User.geo.trackingStart()
        return 
      }
      if(this.permission=='denied'){
        this.$flash("Вы блокировали доступ к местоположению")
        return
      }
      try{
        const point=await User.geo.get()
        const loc={
          location_latitude:point.coords.latitude,
          location_longitude:point.coords.longitude,
          location_address:'Текущее местоположение',
          timestamp:point.timestamp
        }
        this.$heap.commit('setUserCurrentLocation', loc);
        if(loc.location_latitude){
          this.permission='granted'
          return
        }
      } catch{/** */}
      this.check()
    },
    async check(){
      if(this.$heap.state.user.user_id>-1){
        return
      }
      this.permission=await User.geo.permissionCheck()
    }
  },
}
</script>