<style scoped>
.primary-category-grid{
  position: relative;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.primary-category-grid:before{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #000000b2, #0000);
}
.primary-categories{
  display: flex;
  position: relative;
  grid-gap: 10px;
  max-width: 100vw;
  padding: 0 10px;
}
#primary-category-info{
  background-color: #fffa;
  color:#333;
  padding: 10px;
  font-weight: 700;
}
.indicator-label{
  background: #ffffffb2;
  border-radius: 10px;
  font-size: 12px;
}
.indicator-label .indicator-label-text{
  color: #000000b2;
}
.section-title{
  margin: 0;
  color: white;
}
.fake-label{
  border-radius: 5px;
  padding: 5px;
}
</style>

<template>
    <div id="primary-category-wrapper" class="ion-padding-vertical" v-if="productGroupList">
        <ion-item lines="none"  style="--background: transparent;--padding-start: 10px;">
          <h5 slot="start" class="section-title"><span class="fake-label" :style="`background-color: ${titleColor}`">#Маркет</span></h5>
        </ion-item>
      <ion-grid class="primary-category-grid ion-margin-top  ion-no-padding" :style="`background-image: url(${$heap.state.hostname}/image/get.php/${primaryStoreData.image_hash}.1000.1000.webp); height: 250px;`" >
        <ion-row class="ion-justify-content-between">
            <ion-col class="ion-padding-horizontal">
                <ion-label lines="none" class="store-title" style="color: white">
                    <b>Категории:</b>
                </ion-label>
            </ion-col>
          </ion-row>
        <ion-row class="primary-category-container ion-padding-vertical">
          <ion-col class="primary-categories horizontalScroller">
              <div v-for="group in productGroupList" :key="group.group_id" @click="$go(`/catalog/store-${primaryStoreData.store_id}?parent_group_id=${group.group_id}`)" style="cursor: pointer">
                  <ion-card class="ion-no-margin" style="border-radius: 10px; border: 1px solid rgb(221, 221, 221);">
                    <ion-img style="width: 70px; height: 70px;" :src="$heap.state.hostname + 'image/get.php/'+group.image_hash+'.150.150.webp'"/>
                  </ion-card>
              </div>
              <div @click="$go(`/catalog/store-${primaryStoreData.store_id}`)" style="cursor: pointer">
                  <ion-card class="ion-no-margin ion-align-items-center ion-text-center" color="primary" style="display: grid; width: 70px; height: 70px;">
                    <ion-card-title style="font-size: 12px;">Ещё...</ion-card-title>
                  </ion-card>
              </div>
          </ion-col>
        </ion-row>
      </ion-grid><ion-grid class="store-indicators">
            <ion-row class="ion-justify-content-between">
              <ion-col size="auto">
                <div @click="$go(`/catalog/store-${primaryStoreData.store_id}`)" style="cursor:pointer"  class="">
                  <ion-label lines="none" class="store-title" style="font-family: Roboto; font-size: 17px;">
                      <b>{{primaryStoreData.store_name}}</b>
                  </ion-label>
                </div>
              </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-between " style="font-size: 12px">
              <ion-col size="auto" class="indicator-label">
                <div v-if="primaryStoreData.is_opened==1">
                    <label><ion-text color="success"> ◉ </ion-text> <ion-text class="indicator-label-text" color="medium">открыт до {{ primaryStoreData.store_time_closes }}:00</ion-text></label>
                </div>
                <div v-else>
                    <label v-if="primaryStoreData.is_working==0"><ion-text class="indicator-label-text"> ◉ </ion-text><ion-text color="medium">временно не работает</ion-text></label>
                    <label v-else-if="primaryStoreData.store_next_time_opens>0"><ion-text class="indicator-label-text"> ◉ </ion-text><ion-text color="medium">закрыт до {{ primaryStoreData.store_next_time_opens }}:00</ion-text></label>
                    <label v-else><ion-text color="danger"> ◉ </ion-text><ion-text class="indicator-label-text">закрыт</ion-text></label>
                </div>
              </ion-col>
              <ion-col size="auto"  class="indicator-label">
                <div v-if="deliveryTime.timeMin" lines="none">
                  <ion-text class="indicator-label-text">{{deliveryTime.timeMin}}-{{deliveryTime.timeMax}}мин</ion-text>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>  
    </div>
</template>

<script lang="js">
import heap       from "@/heap";
import jQuery     from "jquery";
import Topic      from "@/scripts/Topic.js"
import Utils      from "@/scripts/Utils.js"
import {
  IonImg,
  IonText,
  IonGrid,
  IonItem,
  IonCol,
  IonRow,
  IonCard,
  IonCardTitle,
  IonLabel,
} from "@ionic/vue"
import {  
  chevronBackOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'
import { defineComponent } from 'vue';

export default defineComponent({
  components:{
    IonImg,
    IonText,
    IonGrid,
    IonItem,
    IonCol,
    IonRow,
    IonCard,
    IonCardTitle,
    IonLabel,
  },
  props: ['categoryLimit', 'titleColor'],
  setup(){
      return {
        chevronBackOutline,
        chevronForwardOutline
      }
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
          const primaryStore = await jQuery.get(heap.state.hostname + "Store/primaryNearGet",{location_id:this.main_location_id})
          this.productGroupList = Object.entries(primaryStore.category_list).slice(0, this.categoryLimit).map(entry => entry[1])
          this.deliveryTime = Utils.deliveryTimeCalculate(primaryStore.distance,primaryStore.store_time_preparation)
          this.primaryStoreData = primaryStore
          
          this.$emit('deliveryTimeGet',this.deliveryTime)
        } catch(err){
          this.productGroupList = null
          this.primaryStoreData = null
          this.$emit('deliveryTimeGet',null)
          //
        }
    }
  },
})
</script>