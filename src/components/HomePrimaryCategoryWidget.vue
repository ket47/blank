<template>
    <div id="hcat_widget_wrapper" v-if="productGroupList">
        <ion-item button detail lines="none" color="light" @click="this.$router.push('store-'+primaryStoreData.store_id)">
          <ion-title color="primary">{{primaryStoreData.store_name}}</ion-title>
          <ion-note slot="helper">
            Доставка за {{deliveryTime.timeMin}}-{{deliveryTime.timeMax}}мин
          </ion-note>    
        </ion-item>

        <div id="hcat_widget_grid">
            <div v-for="group in productGroupList" :key="group.group_id" @click="$router.push(`store-${primaryStoreData.store_id}?parent_group_id=${group.group_id}`)">
                <ion-thumbnail>
                    <ion-img :src="$heap.state.hostname + 'image/get.php/'+group.image_hash+'.100.100.webp'"/>
                </ion-thumbnail>
                <ion-label style="height:2em;text-align:center;padding: 3px;font-weight:bold" color="medium">{{group.group_name}}</ion-label>
            </div>
        </div>
    </div>
</template>

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
</style>

<script lang="js">
import heap       from "@/heap";
import jQuery     from "jquery";
import Topic      from "@/scripts/Topic.js"
import Utils      from "@/scripts/Utils.js"
import {
  IonImg,
  IonThumbnail,
  IonNote,
  IonItem,
  IonLabel,
  IonTitle
} from "@ionic/vue"
import { defineComponent } from 'vue';

export default defineComponent({
  components:{
    IonImg,
    IonThumbnail,
    IonNote,
    IonItem,
    IonLabel,
      IonTitle
  },
  data() {
    return {
      productGroupList: null,
      primaryStoreData:null,
      deliveryTime:{},
      main_location_id:null,
    };
  },
  mounted(){
    let self=this;
    this.$topic.on('userMainLocationSet',mainloc=>{
      self.main_location_id=mainloc.location_id;
      self.productGroupListGet()
    })
    this.$topic.on('userGet',user=>{
      self.main_location_id=user.location_main.location_id;
      self.productGroupListGet()
    })
    this.main_location_id=heap.state.user.location_main?heap.state.user.location_main.location_id:null
    this.productGroupListGet()
            console.log('userMainLocationSet');
  },
  methods: {
    async productGroupListGet() {
        if(!this.main_location_id){
            return ;      
        }
        try{
          const primaryStore=await jQuery.get(heap.state.hostname + "Store/primaryNearGet",{location_id:this.main_location_id})
          this.productGroupList=primaryStore.category_list;
          this.deliveryTime=Utils.deliveryTimeCalculate(primaryStore.distance,primaryStore.store_time_preparation)
          this.primaryStoreData=primaryStore
          this.$emit('deliveryTimeGet',this.deliveryTime)
        } catch(err){
          this.productGroupList=null
          this.primaryStoreData=null
          //
        }
    },
  },
})
</script>