<style scoped>
.store-list .crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.store-list .crop-to-fit img {
  width: 100%;
  min-height: 190px !important;
  object-fit: cover;
}
.store-list ion-card{
  border-radius: 10px;
}
.closed img{
  filter: grayscale(1);
}
.store-list .section-title{
  margin: 0;
}
.store-list .perk-row{
  margin:2px;
  position:absolute;
  top:10px;
  right:10px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(auto-fit,  minmax(10px, max-content)) ;
}
.store-list .perk-slider{
  --swiper-navigation-size: 20px;
}
.store-list .perk-slider ion-grid{
  padding: 5px 30px;
  border-top: 1px solid #eee;
}
.store-list .perk-slider .perk-image {
  border-radius:10px;
}
.store-list .perk-slider .perk-title {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
}
</style>

<template>
  <ion-header >
      <ion-toolbar :style="`--background: ${modalColor};`">
        <ion-item lines="none"  :style="`--background: ${modalColor}; color: white`">
          <ion-title>{{ modalTitle }}</ion-title>
          <ion-icon slot="end" @click="closeModal();" :icon="closeOutline" size="large" color="light"></ion-icon>            
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>
      <ion-list class="store-list">
        <div  v-for="(store_item, store_index) in filteredStoreList"  :key="store_item.store_id" >
          <ion-card style="position:relative;height:fit-content"  :class="store_item.is_opened==0?'closed':''">
            <div @click="$go(`/catalog/store-${store_item.store_id}`)" class="crop-to-fit" style="height: 180px;cursor:pointer">
                <img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.700.700.webp'"/>
            </div>
            <div 
              v-if="store_perks[store_index].length > 0" class="perk-row" 
              :style="`width:${store_perks[store_index].length*50}px`">
              <span v-for="perk in store_perks[store_index]" :key="perk.image_hash" class="perk" >
                <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +perk.image_hash +'.80.80.png'}`"/>
                <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
              </span>
            </div>
          </ion-card>
          <ion-grid class="store-indicators">
            <ion-row class="ion-justify-content-between">
              <ion-col size="auto">
                <div @click="$go(`/catalog/store-${store_item.store_id}`)" style="cursor:pointer"  class="">
                  <ion-label lines="none" class="store-title" style="font-family: Roboto; font-size: 15px;">
                      <b>{{store_item.store_name}}</b>
                  </ion-label>
                </div>
              </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-between ion-padding-bottom" style="font-size: 12px">
              <ion-col size="auto">
                <div v-if="store_item.is_opened==1">
                    <label><ion-text color="success"> ◉ </ion-text> <ion-text color="medium">открыт до {{ store_item.store_time_closes }}:00</ion-text></label>
                </div>
                <div v-else>
                    <label v-if="store_item.is_working==0"><ion-text color="medium"> ◉ </ion-text><ion-text color="medium">временно не работает</ion-text></label>
                    <label v-else-if="store_item.store_next_time_opens>0"><ion-text color="danger"> ◉ </ion-text><ion-text color="medium">закрыт до {{ store_item.store_next_time_opens }}:00</ion-text></label>
                    <label v-else><ion-text color="danger"> ◉ </ion-text><ion-text color="medium">закрыт</ion-text></label>
                </div>
              </ion-col>
              <ion-col size="auto">
                <div v-if="store_item.deliveryTime.timeMin" lines="none">
                  <ion-text color="medium">{{store_item.deliveryTime.timeMin}}-{{store_item.deliveryTime.timeMax}}мин</ion-text>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>  
        </div>
      </ion-list>
  </ion-content>
</template>


<script>
import {
  closeOutline, 
  timeOutline
}      from 'ionicons/icons';        

import {
  modalController,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonImg,
  IonContent,
  IonTitle,
  IonItem,
  IonLabel,
  IonText,
  IonCol,
  IonRow,
  IonGrid,
  IonCard,
  IonList
}  from "@ionic/vue";

import Topic                    from '@/scripts/Topic.js'

export default{
  props: ['filteredStoreList', 'modalTitle', 'modalColor'],
  components:{
    IonIcon,
    IonToolbar,
    IonHeader,
    IonImg,
    IonContent,
    IonTitle,
    IonLabel,
    IonText,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonCard,
    IonList
  },
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { 
        closeModal, 
        closeOutline, 
        timeOutline 
      };
  },
  mounted(){
    Topic.on('dismissModal',()=>{
      if( modalController && modalController.isOpen ){
        modalController.dismiss()
      }
    })
  },
  computed: {
    store_perks () {
      return this.filteredStoreList.map(function(store) {
        return store.perks.filter(perk => perk.slot == 'perk')
      });
    },
    store_perks_slider () {
      return this.filteredStoreList.map(function(store) {
        return store.perks.filter(perk => perk.slot == 'slider')
      });
    },
  }
};
</script>