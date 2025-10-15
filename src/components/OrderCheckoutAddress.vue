<style scoped>
  .center{
    display: flex;
    align-items: center;
    padding: 3px 16px;
    justify-content: left;
    font-size: 12px;
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
  <ion-list v-if="location_delivery" lines="none">
      <!-- <ion-item @click="selectDeliveryAddress()">
        <ion-text color="medium">Адрес доставки заказа</ion-text>
        <ion-icon slot="end" :icon="chevronDownOutline"/>
      </ion-item> -->
      <ion-item @click="selectDeliveryAddress()" button detail="false">
        <ion-thumbnail v-if="location_delivery.image_hash" slot="start" style="width:20px;height:20px">
          <ion-img :src="`${$heap.state.hostname}/image/get.php/${location_delivery.image_hash}.32.32.png`" />
        </ion-thumbnail>
        <ion-text color="dark">{{location_delivery?.location_address}}</ion-text>
        <ion-icon slot="end" :icon="optionsOutline"></ion-icon>
      </ion-item>
  </ion-list>
  <ion-list v-else>
    <ion-item button detail="true" lines="none" @click="selectDeliveryAddress()">Добавить адрес доставки</ion-item>
  </ion-list>
</template>

<script>
import { 
  IonImg,
  IonText,
  IonItem,
  IonList,
  IonThumbnail,
  IonIcon,
 }  from "@ionic/vue";

import { 
  locationOutline, 
  chevronDownOutline,
  timeOutline,
  callOutline,
  addOutline,
  optionsOutline,
}                               from "ionicons/icons";
import heap                     from "@/heap";
import jQuery                   from 'jquery';

export default {
  props:['deliveryTime','showComment','nextRoute'],
  components: {
      IonImg,
      IonText,
      IonItem,
      IonList,
      IonThumbnail,
        IonIcon,

  },
  setup() {
    return { 
      locationOutline, 
      chevronDownOutline,
      timeOutline,
      callOutline,
      addOutline,
      optionsOutline,

    };
  },
  data() {
    return {
      locationCommentEdit:0
    };
  },
  computed: {
    location_delivery() {
      if( !heap.state?.user?.location_main || heap.state.user.location_main.is_default==1 || heap.state.user.location_main.group_name=='Current' ){
        return null
      }
      return heap.state.user.location_main
    }
  },
  methods: {
    selectDeliveryAddress() {
      if(this.nextRoute){
        this.$heap.state.next_route=this.nextRoute
      }
      this.$go('/modal/user-addresses');
    },
    async locationCommentChanged(){
      const request={
        location_id:this.location_delivery.location_id,
        location_comment:this.location_delivery.location_comment
      };
      jQuery.post( this.$heap.state.hostname + "Location/itemUpdate", JSON.stringify(request) );
    }
  },
};
</script>