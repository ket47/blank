<template>
    <div id="hcat_widget_wrapper" v-if="productGroupList">
        <h4>
          <router-link :to="'store-'+primaryStoreData.store_id">
            {{primaryStoreData.store_name}}
          </router-link>
        </h4>
        <ion-note>
          Доставка за {{primaryStoreData.deliveryTimeMin}}-{{primaryStoreData.deliveryTimeMax}}мин
          </ion-note>
        <div id="hcat_widget_grid">
            <div v-for="group in productGroupList" :key="group.group_id">
                <ion-thumbnail >
                    <ion-img style="border-radius:10px;border:1px solid #ddd" :src="$heap.state.hostname + 'image/get.php/'+group.image_hash+'.150.150.webp'"/>
                </ion-thumbnail>
                <ion-label style="height:2em;text-align:center">{{group.group_name}}</ion-label>
            </div>
        </div>
    </div>
</template>

<style scoped>
#hcat_widget_grid {
    display: grid;
    margin-top:10px;
    gap:6px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 100px;
}
@media screen and (min-width: 600px) {
    #hcat_widget_grid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}
@media screen and (min-width: 1000px) {
    #hcat_widget_grid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}
#hcat_widget_grid>div{
    display: flex;
    flex-direction: column;
    -moz-box-align: center;
    align-items: center;
    -moz-box-pack: center;
    justify-content: center;
}
#hcat_widget_wrapper{
    background-color: #f5f5f5;
    padding: 10px;
}
</style>

<script>
//import { IonIcon } from "@ionic/vue";
import heap from "@/heap";
import jQuery from "jquery";

export default {
  name: "HomePrimaryCategoryWidget",
  components: {
    //IonIcon,
  },
  data() {
    return {
      productGroupList: null,
      primaryStoreData:null
    };
  },
  mounted(){
    this.productGroupListGet()
  },
  methods: {
    productGroupListGet() {
        var main_address=heap.state.user.location_main;
        if(!main_address){
            console.log('what to do address not set!!!');
            return ;
        }
        let self=this;
        return jQuery.get(heap.state.hostname + "Store/primaryNearGet",{location_id:main_address.location_id})
        .done(function(primaryStore){
            self.productGroupList=primaryStore.category_list;
            self.storeDataCalculate(primaryStore);
        });
    },
    storeDataCalculate(primaryStore){
      this.storeDataCalculateDeliveryTime(primaryStore);
      this.primaryStoreData=primaryStore;
    },
    storeDataCalculateDeliveryTime(Store){
      var preparation=Store.store_time_preparation||0;
      var delta=heap.state.deliverySettings.deliveryTimeDelta;
      var time=Math.round(Store.distance/heap.state.deliverySettings.courierVelocity*60/5)*5+parseInt(preparation);
      var timeMin=time>delta?time-delta:time;
      var timeMax=timeMin+delta;
      Store.deliveryTime=time;
      Store.deliveryTimeMin=timeMin;
      Store.deliveryTimeMax=timeMax;
    }
  },
  computed: {
    isSignedIn() {
      return heap.state.user.user_id && heap.state.user.user_id > -1;
    },
    isMainLocationSet() {
      return heap.state.user && heap.state.user.location_main;
    },
  },
};
</script>