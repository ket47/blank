<style scoped>
.store-list .crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 150px;
}

.store-list .crop-to-fit ion-img {
  flex-shrink:0;
  min-width:100%;
  min-height:100%
}
.store-list ion-card{
  border-radius: 10px;
}
.store-list .closed ion-img{
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
/* .perk-slider .perk-label {
  font-size: 16px;
  background-color: var(--ion-color-primary);
  color:white;
  border-radius: 20px;
  width:40px;
  height:40px;
  display: flex;
  align-items: center;
  justify-content: center;
} */

/*
 @media screen and (min-width: 740px) {
  .store-list {
    display: grid;

  }
}
@media screen and (min-width: 1080px) {
  .store-list > ion-card{
    width: 31%;
    float: right;
    margin: 1%;
  }
} */


 @media screen and (min-width: 740px) {
  .store-list .store-list{
      display: grid;
      grid-template-columns: auto  auto;
    }
 }
</style>

<template>
  <ion-header >
      <ion-toolbar  :style="`--background: ${modalColor};`">
        <ion-item lines="none"  :style="`--background: ${modalColor}; color: white`">
          <ion-title>{{ modalTitle }}</ion-title>
          <ion-icon slot="end" @click="closeModal();" :icon="closeOutline" size="large" color="light"></ion-icon>            
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>
      <ion-list class="store-list">
        <ion-card style="position:relative;height:fit-content" v-for="(store_item, store_index) in filteredStoreList"  :key="store_item.store_id"  :class="store_item.is_opened==0?'closed':''">
          <div @click="$go(`/catalog/store-${store_item.store_id}`)" class="crop-to-fit" style="height: 180px;cursor:pointer">
              <ion-img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.500.500.webp'"/>
          </div>
          <div 
            v-if="store_perks[store_index].length > 0" 
            class="perk-row" 
            :style="`width:${store_perks[store_index].length*50}px`">
            <span v-for="perk in store_perks[store_index]" :key="perk.image_hash" class="perk" >
              <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +perk.image_hash +'.80.80.png'}`"/>
              <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
            </span>
          </div>
            
          <div @click="$go(`/catalog/store-${store_item.store_id}`)" style="cursor:pointer">
            <ion-item lines="none" class="store-title">
                <b>{{store_item.store_name}}</b>
            </ion-item>
            <ion-grid>
              <ion-row class="ion-justify-content-between">
                <ion-col size="auto">
                  <store-opened-indicator :storeItem="store_item"/>
                  </ion-col>
                <ion-col size="auto">
                  <ion-chip v-if="store_item.deliveryTime.timeMin" color="medium"  background="transparent">
                    <ion-icon :icon="timeOutline" ></ion-icon> 
                    <label>{{store_item.deliveryTime.timeMin}}-{{store_item.deliveryTime.timeMax}}мин</label>
                  </ion-chip>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
        </ion-card>
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
  IonChip,
  IonItem,
  IonCol,
  IonRow,
  IonGrid,
  IonCard,
  IonList
}  from "@ionic/vue";

import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';

export default{
  props: ['filteredStoreList', 'modalTitle', 'modalColor'],
  components:{
    IonIcon,
    StoreOpenedIndicator,
    IonToolbar,
    IonHeader,
    IonImg,
    IonContent,
    IonTitle,
    IonChip,
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