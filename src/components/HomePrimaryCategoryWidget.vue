<style scoped>
.primary-category-grid{
  background-size: cover;
}
.primary-categories{
  display: grid;
  position: relative;
  grid-template-areas:  "a a b b"
                        "a a c c" 
                        "d d f f"
                        "e e f f";
  grid-gap: 10px;
}
.primary-categories > div:nth-child(1){
  grid-area: a;
}
.primary-categories > div:nth-child(1) ion-img{
  width: 150px !important;
  height: 150px !important;
}
.primary-categories > div:nth-child(2){
  grid-area: b;
}
.primary-categories > div:nth-child(3){
  grid-area: c;
}
.primary-categories > div:nth-child(4){
  grid-area: d;
}
.primary-categories > div:nth-child(5){
  grid-area: e;
}
.primary-categories > div:nth-child(6){
  grid-area: f;
}
.primary-categories > div  ion-card{
  min-height: 80px; 
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}
.primary-categories > div  ion-card ion-img{
  border-radius: 10px;
  margin-top: -20px;
}
#primary-category-wrapper{
    background-color: var(--ion-color-light);
}
#primary-category-wrapper > div{
  position: relative;
}
    
#primary-category-header{
  background-position: top center;
  height: 200px;
  border-radius: 10px;
  margin: 0px 10px 10px 10px;
  cursor: pointer;
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
@media screen and (min-width: 740px) {
  
  .primary-categories{
    grid-template-areas:  "a a b b d d e e"
                          "a a c c d d f f" ;
    grid-gap: 20px;
  }
  .primary-categories > div:nth-child(4) ion-img{
    width: 150px !important;
    height: 150px !important;
  }
}
</style>

<template>
    <div id="primary-category-wrapper" class="ion-padding-vertical" v-if="productGroupList">
      <ion-grid class="primary-category-grid" :style="`background-image: url(${$heap.state.hostname}/image/get.php/${primaryStoreData.image_hash}.1000.1000.webp);`" >
        <ion-item lines="none"  style="--background: transparent;">
          <h5 slot="start" class="section-title"><span class="fake-label" style="background-color: var(--ion-color-primary)">#{{ primaryStoreData.store_name }}</span></h5>
        </ion-item>
        <ion-item lines="none"  style="--background: transparent;">
          <ion-grid class="store-indicators">
            <ion-row class="ion-justify-content-between ion-padding-bottom" >
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
                <div v-if="deliveryTime.timeMin" >
                  <label><ion-text class="indicator-label-text">{{deliveryTime.timeMin}}-{{deliveryTime.timeMax}}мин</ion-text></label>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
        <ion-row class="primary-category-container ion-padding-vertical ion-align-self-end">
          <ion-col class="primary-categories">
              <div v-for="group in productGroupList" :key="group.group_id" @click="$go(`/catalog/store-${primaryStoreData.store_id}?parent_group_id=${group.group_id}`)" style="cursor: pointer">
                  <ion-card class="ion-no-margin">
                    <ion-card-title class="ion-padding" style="font-size:1em; width: 100%" color="dark"><b>{{group.group_name}}</b></ion-card-title>
                    <ion-img style="width: 80px; height: 80px;" :src="$heap.state.hostname + 'image/get.php/'+group.image_hash+'.150.150.webp'"/>
                  </ion-card>
              </div>
              <div @click="$go(`/catalog/store-${primaryStoreData.store_id}`)" style="cursor: pointer">
                  <ion-card class="ion-no-margin ion-justify-content-center ion-text-center" color="primary">
                    <ion-card-title style="padding: 3px; font-size:1em; width: 100%" color="dark">Показать ещё...</ion-card-title>
                  </ion-card>
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
  },
  props: ['categoryLimit'],
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