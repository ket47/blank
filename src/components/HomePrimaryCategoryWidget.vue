<style scoped>
#hcat_widget_grid {
  cursor: pointer;
  display: grid;
  margin:10px;
  gap:6px;
  grid-template-columns: repeat(3,1fr);
  grid-template-rows: 140px;
}
ion-thumbnail{
  border-radius:10px;
  border:1px solid var(--ion-color-medium);
  height:100px;
  width:100px;
  padding: 1px;
}
ion-img{
  border-radius:10px;
}
@media screen and (min-width: 600px) {
    #hcat_widget_grid {
        grid-template-columns: repeat(5,1fr);
    }
}
@media screen and (min-width: 1000px) {
    #hcat_widget_grid {
        grid-template-columns: repeat(8,1fr);
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
    background-color: var(--ion-color-light);
    margin-top: 10px;
    padding-bottom: 10px;
}
#hcat_widget_header{
  background-position: top center;
  height: 200px;
  border-radius: 10px;
  margin: 0px 10px 10px 10px;
  cursor: pointer;
}
#hcat_widget_info{
  background-color: #fffa;
  color:#333;
  padding: 10px;
  font-weight: 700;
}
</style>

<template>
    <div id="hcat_widget_wrapper" v-if="productGroupList">

        <div id="hcat_widget_header" @click="this.$go('/catalog/store-'+primaryStoreData.store_id)"  :style="`background-image:url(${$heap.state.hostname}image/get.php/${primaryStoreData.image_hash}.500.500.webp)`">
          <div id="hcat_widget_info">
            <ion-title size="large">{{primaryStoreData.store_name}}</ion-title>
            <ion-title size="small">опорный поставщик</ion-title>
          </div>
        </div>
          <store-opened-indicator :storeItem="primaryStoreData"/>
          <ion-chip v-if="deliveryTime.timeMin" color="primary">доставка {{deliveryTime.timeMin}}-{{deliveryTime.timeMax}}мин</ion-chip>

        <div id="hcat_widget_grid">
            <div v-for="group in productGroupList" :key="group.group_id" @click="$go(`/catalog/store-${primaryStoreData.store_id}?parent_group_id=${group.group_id}`)">
                <ion-thumbnail>
                    <ion-img :src="$heap.state.hostname + 'image/get.php/'+group.image_hash+'.250.250.webp'"/>
                </ion-thumbnail>
                <ion-label style="height:2em;text-align:center;padding: 3px;font-size:0.7em" color="dark">{{group.group_name}}</ion-label>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import heap       from "@/heap";
import jQuery     from "jquery";
import Topic      from "@/scripts/Topic.js"
import Utils      from "@/scripts/Utils.js"
import {
  IonImg,
  IonThumbnail,
  IonLabel,
  IonTitle,
  IonChip
} from "@ionic/vue"
import { defineComponent } from 'vue';
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';

export default defineComponent({
  components:{
    IonImg,
    IonThumbnail,
    IonLabel,
    IonTitle,
    IonChip,
    StoreOpenedIndicator
  },
  data() {
    return {
      productGroupList: null,
      primaryStoreData:null,
      deliveryTime:{},
      main_location_id:null,
      old_location_id:-1
    };
  },
  mounted(){
    let self=this;
    this.$topic.on('userMainLocationSet',mainloc=>{
      self.main_location_id=mainloc.location_id;
      self.productGroupListGet()
    })
    this.$topic.on('userGet',user=>{
      self.main_location_id=user.location_main?.location_id;
      self.productGroupListGet()
    })
    this.main_location_id=heap.state.user.location_main?heap.state.user.location_main.location_id:null
    this.productGroupListGet()
  },
  methods: {
    async productGroupListGet() {
        if(!this.main_location_id || this.old_location_id==this.main_location_id){
            return ;      
        }
        this.old_location_id=this.main_location_id
        try{
          const primaryStore=await jQuery.get(heap.state.hostname + "Store/primaryNearGet",{location_id:this.main_location_id})
          this.productGroupList=primaryStore.category_list;
          this.deliveryTime=Utils.deliveryTimeCalculate(primaryStore.distance,primaryStore.store_time_preparation)
          this.primaryStoreData=primaryStore
          this.$emit('deliveryTimeGet',this.deliveryTime)
        } catch(err){
          this.productGroupList=null
          this.primaryStoreData=null
          this.$emit('deliveryTimeGet',null)
          //
        }
    },
  },
})
</script>