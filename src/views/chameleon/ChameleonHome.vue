<style scoped>
.special-grid{
  display: flex;
  overflow: auto;
  white-space: nowrap;
  padding: 0 5px;
}
.fake-searchbar{
  background: white;
  box-shadow: 0px 0px 10px -5px black;
  display: flex;
  align-items: center;
  border-radius: 10px;
  cursor: text;
  margin: 5px 10px 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  color: #8e8e8e;
}
.crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 150px;
  border-radius: 10px;
}
.crop-to-fit img{
  min-width: 100%;
  height: 100%;
  object-fit: cover;
}
@media screen and (max-width: 740px) {
  .special-grid{
    grid-template-columns: 100%;
  }
}
@media screen and (min-width: 1420px) {
  .special-grid{
    grid-template-columns: 30% 70%;
  }
}
@media screen and (min-width: 720px) {
  .store-list{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title><b>ВкусоГид</b></ion-title>
        <ion-button @click="$go('/chameleon-user')">
          User
        </ion-button>
      </ion-toolbar>  
    </ion-header>
    <ion-content class="main-container">
      <div ref="topMarker"></div>
      <div style="padding: 10px">
        <div>
          <ion-label style="font-size: 15px;"><b>Рестораны и магазины</b></ion-label>
        </div>
        <ion-label>Здесь вы найдёте отзывы на самые популярные заведения</ion-label>
      </div>
      <ion-list class="store-list">
        <div  v-for="store_item in storeList"  :key="store_item.store_id"  >
          <div v-if="!store_item.not_found">
            <ion-card style="position:relative;height:fit-content;border-radius:12px;" :class="store_item.is_opened==0?'closed':''">
              <div @click="$go(`/chameleon-store-${store_item.store_id}`)" class="crop-to-fit" style="height: 180px;cursor:pointer">
                  <img v-if="store_item.image_hash" :src="$heap.state.hostname +'image/get.php/' +store_item.image_hash +'.700.700.webp'"/>
              </div>
              <ion-grid class="store-indicators" style="position: absolute; bottom: 0; width: 100%; color: white; background: linear-gradient(to top, #000c, #00000040); padding: 16px 8px;">
                <ion-row class="ion-justify-content-between">
                  <ion-col size="9">
                    <div @click="$go(`/catalog/store-${store_item.store_id}`)" style="cursor:pointer"  class="">
                      <ion-label lines="none" class="store-title " style=" font-size: 15px;">
                          <b>{{store_item.store_name}}</b>
                      </ion-label>
                    </div>
                  </ion-col>
                  <ion-col size="3" v-if="store_item.rating">
                    <div class="rating" style="text-align: right;">
                      <ion-icon :icon="star" style="font-size: 15px" color="warning"></ion-icon>
                      <span> {{ store_item.rating ?? 0 }}</span>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card>
          </div>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import StoreListNew   from "@/components/StoreListNew";
import Utils          from '@/scripts/Utils.js'
import User           from '@/scripts/User.js';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonLabel,
  IonRow,
  IonCol,
  IonImg,
  IonCard,
  IonText,
  IonGrid,
  IonList
}                   from "@ionic/vue";

import { star }     from 'ionicons/icons'


export default {
  setup() {
    return {
      star,
    }
  },
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
    IonTitle,
    IonLabel,
    IonRow,
    IonCol,
    IonImg,
    IonCard,
    IonText,
    IonGrid,
    IonList
  },
  data(){
    return {
      storeList: []
    }
  },
  mounted(){
    this.listNearGet(this.$heap.state.user.location_current??this.$heap.state.user.location_main);
  },
  created(){
    this.$topic.on('userGet',user=>{
      this.listNearGet(this.$heap.state.user.location_current??this.$heap.state.user.location_main);  
    })
  },
  methods: {
    async listNearGet(loc) {
      if( !loc ){
        return
      }
      try{
        const location={
          location_id:loc?.location_id,
          location_latitude:loc?.location_latitude,
          location_longitude:loc?.location_longitude
        }
        this.$emit('isloading', true)
        let response
        response=await Utils.post(`${this.$heap.state.hostname}Store/listNearGet`, location)
        this.storeList = response.store_list
        this.$emit('isloading', false)
      }catch(err){
        this.$emit('isloading', false)
        this.storeList=[]
        console.log(err)
      }
    },
    
  }
};
</script>