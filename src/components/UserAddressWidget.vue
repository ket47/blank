<style scoped>
  .delivery-adress{
    
  }
  .delivery-time{

  }
  .center{
    display: flex;
    align-items: center;
    padding: 3px 16px;
    justify-content: left;
    font-size: 14px;
  }
  .center ion-icon{
    margin: 0 3px;
    font-size: 16px;
  }
  .center ion-icon[slot="start"]{
    margin-left: -2px;
  }
  .rightend{
    height: 100%;
    width:90px;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: space-between;
  }
  .selector{
    display: flex;
    margin: 5px 0;
  }
</style>

<template>
    <div v-if="isMainLocationSet" @click="selectDeliveryAddress()" class="selector">
      <div class="delivery-adress"  style="font-size: 1em;" >
        <div class="center">
          <ion-text size="small" color="medium" >Адрес</ion-text>
          <ion-icon :icon="chevronDownOutline" color="medium"></ion-icon>
        </div>
        <div class="center">
          <ion-icon slot="start" color="secondary" :icon="location"/>
          <ion-text color="dark"><b>{{$heap.state.user?.location_main?.location_address}}</b></ion-text>
        </div>
      </div>
      <div class="delivery-time" v-if="deliveryTime">
        <ion-text style="font-size:24px;color:var(--ion-color-secondary-contrast)">{{deliveryTime.time}}</ion-text>
        <ion-note style="font-size:10px;color:var(--ion-color-secondary-contrast)">мин</ion-note>
      </div>
    </div>
    <ion-item v-else detail button @click="selectDeliveryAddress()" class="selector">
      <ion-icon slot="start" style="color: var(--ion-color-primary)" :icon="location"/>
      <ion-label> Выбрать адрес доставки </ion-label>
    </ion-item>

    <ion-item v-if="showComment && $heap.state.user.location_main">
        <ion-textarea rows="1" placeholder="комментарий к адресу" @change="locationCommentChanged()" v-model="$heap.state.user.location_main.location_comment"></ion-textarea>
    </ion-item>
</template>

<script>
import { 
  IonIcon,
  IonTextarea,
  IonText,
  IonNote,
  IonLabel,
  IonItem,
 }  from "@ionic/vue";

import { 
  location, 
  chevronDownOutline 
}                               from "ionicons/icons";
import heap                     from "@/heap";
import router                   from '@/router';
import Topic                    from '@/scripts/Topic.js'
import jQuery                   from 'jquery';

export default {
  props:['deliveryTime','showComment'],
  components: {
      IonIcon,
      IonTextarea,
      IonText,
      IonNote,
      IonLabel,
      IonItem,
  },
  setup() {
    return { 
      location, 
      chevronDownOutline 
    };
  },
  data() {
    return {
      location_main: heap.state.user.location_main,
    };
  },
  created(){
    let self=this;
    Topic.on('userMainLocationSet',mainloc=>{
      self.location_main=mainloc
    })
    Topic.on('userGet',user=>{
      self.location_main=user.location_main
    })
  },
  methods: {
    selectDeliveryAddress() {
        router.push('/user/user-addresses');
    },
    async locationCommentChanged(){
      const request={
        location_id:heap.state.user.location_main.location_id,
        location_comment:heap.state.user.location_main.location_comment
      };
      jQuery.post( this.$heap.state.hostname + "Location/itemUpdate", JSON.stringify(request) );
    }
  },
  computed: {
    isSignedIn() {
      return heap.state.user.user_id && heap.state.user.user_id > -1;
    },
    isMainLocationSet(){
        return this.location_main?1:0;
    }
  },
};
</script>