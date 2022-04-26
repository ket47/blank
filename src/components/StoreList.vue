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
</style>

<template>
  <ion-list class="store-list">
    <ion-card v-for="store_item in storeList" :key="store_item.store_id" @click="$router.push('store-' + store_item.store_id)">
        <div class="crop-to-fit">
            <ion-img
            v-if="store_item.image_hash" 
            :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.200.200.webp'"/>
        </div>
        <ion-chip v-if="store_item.is_opened" color="success">Открыт до {{ store_item.store_time_closes }}:00</ion-chip>
        <ion-chip v-else color="danger">Закрыт до {{ store_item.store_time_opens }}:00</ion-chip>

        <ion-item lines="none">
            <h3>{{store_item.store_name}}</h3>
            <ion-text slot="helper">{{ store_item.store_description }}</ion-text>
        </ion-item>
    </ion-card>
  </ion-list>
</template>

<script>
import {
  IonList,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/vue";
import jQuery from "jquery";
import heap from "../heap";

export default {
  components: {
    IonList,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  },
  data() {
    return {
      error: "",
      storeList: [],
    };
  },
  methods: {
    getStoreList() {
      var main_address = heap.state.user.location_main;
      if (!main_address) {
        console.log("what to do address not set!!!");
        return;
      }
      var self = this;
      jQuery
        .post(heap.state.hostname + "Store/listNearGet", {
          location_id: main_address.location_id,
        })
        .done(function (response) {
          self.storeList = self.prepareStoreList(response);
        })
        .fail(function (err) {
          self.error = err.responseJSON.messages.error;
        });
    },
    prepareStoreList(storeList) {
      for (var index in storeList) {
        var storeItem = storeList[index];
        var date = new Date();
        storeItem.willBeClosedAt =
          storeItem["store_time_closes_" + date.getDay()];
        storeList[index] = storeItem;
      }
      return storeList;
    },
  },
  created() {
    this.getStoreList();
  },
};
</script>

