<style scoped>
.crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 180px;
}

.crop-to-fit ion-img {
  flex-shrink:0;
  min-width:100%;
  min-height:100%
}
ion-card{
  border-radius: 10px;
}
</style>

<template>
  <ion-list class="store-list" v-if="storeList">
    <ion-card button v-for="store_item in storeList" :key="store_item.store_id" @click="$router.push('store-' + store_item.store_id)">
        <div class="crop-to-fit">
            <ion-img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.200.200.webp'"/>
        </div>
        <ion-chip v-if="store_item.is_opened" color="success">Открыт до {{ store_item.store_time_closes }}:00</ion-chip>
        <ion-chip v-else color="danger">Закрыт до {{ store_item.store_time_opens }}:00</ion-chip>
        <ion-chip v-if="store_item.deliveryTime.timeMin" color="primary">{{store_item.deliveryTime.timeMin}}-{{store_item.deliveryTime.timeMax}}мин</ion-chip>
        <ion-item lines="none">
            <h3>{{store_item.store_name}}</h3>
        </ion-item>
    </ion-card>
  </ion-list>
</template>

<script>
import {
  IonList,
  IonImg,
  IonChip,
  IonItem,
  IonCard,
}                   from "@ionic/vue";
import jQuery       from "jquery";
import heap         from "@/heap";
import Utils        from '@/scripts/Utils.js'

export default {
  components: {
    IonList,
    IonImg,
    IonChip,
    IonItem,
    IonCard,
  },
  data() {
    return {
      storeList: null,
    };
  },
  methods: {
    async listGet() {
      var main_address = heap.state.user.location_main;
      if (!main_address) {
        console.log("what to do address not set!!!");
        return;
      }
      try{
        const found=await jQuery.post(heap.state.hostname + "Store/listNearGet", {location_id: main_address.location_id,})
        this.storeList=this.storeListCalculate(found)
      }catch{/** */}
    },
    storeListCalculate(found){
      for(let i in found){
        found[i].deliveryTime=Utils.deliveryTimeCalculate(found[i].distance,found[i].store_time_preparation)
      }
      return found
    },
  },
  created() {
    this.listGet();
  },
};
</script>

