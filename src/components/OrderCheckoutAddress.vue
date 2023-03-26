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
  <ion-list v-if="location_delivery" @click="selectDeliveryAddress()">
      <ion-item lines="none">
        <ion-text color="medium">Адрес доставки заказа</ion-text>
        <ion-icon slot="end" :icon="chevronDownOutline"/>
      </ion-item>
      <ion-item lines="none">
        <ion-thumbnail v-if="location_delivery.image_hash" slot="start" style="width:30px;height:30px">
          <ion-img :src="`${$heap.state.hostname}/image/get.php/${location_delivery.image_hash}.32.32.png`" />
        </ion-thumbnail>

        <ion-text color="dark">{{location_delivery?.location_address}}</ion-text>
        <ion-chip v-if="deliveryTime?.time>0" slot="end"  color="medium"  background="transparent">
          <ion-icon :src="timeOutline"/><label>{{deliveryTime.time}}</label>
        </ion-chip>
      </ion-item>
      <ion-item>
          <ion-textarea rows="1" placeholder="комментарий к адресу" @change="locationCommentChanged()" :value="location_delivery.location_comment"></ion-textarea>
      </ion-item>
  </ion-list>
  <ion-list v-else>
    <ion-item button detail="true" lines="none" @click="selectDeliveryAddress()" color="secondary">Добавить адрес доставки заказа</ion-item>
  </ion-list>
</template>

<script>
import { 
  IonImg,
  IonIcon,
  IonTextarea,
  IonText,
  IonItem,
  IonList,
  IonThumbnail,
  IonChip,
 }  from "@ionic/vue";

import { 
  locationOutline, 
  chevronDownOutline,
  timeOutline
}                               from "ionicons/icons";
import heap                     from "@/heap";
import router                   from '@/router';
import jQuery                   from 'jquery';

export default {
  props:['deliveryTime','showComment','nextRoute'],
  components: {
      IonImg,
      IonIcon,
      IonTextarea,
      IonText,
      IonItem,
      IonList,
      IonThumbnail,
      IonChip,
  },
  setup() {
    return { 
      locationOutline, 
      chevronDownOutline,
      timeOutline
    };
  },
  data() {
    return {
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
      router.push('/user/user-addresses');
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