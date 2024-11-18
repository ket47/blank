<style scoped>
.store-slider-container{
  position: relative;
}
.store-slider-container .scroller-navigation{
  position: absolute;
  width: 100%;
  height: 100%;
}
.store-slider-container .scroller-navigation ion-button{
  position: relative;
  z-index: 100;
  --padding-start: 8px;
  --padding-end: 8px;
}
.store-slider{
  display: flex;
}
.store-pair{
  display: grid;/* To equalize the gaps */
}
.store-slider .store-item{
  width: 330px;
}
.store-slider .crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.store-slider .crop-to-fit img{
  width: 100%;
  min-height: 190px !important;
  object-fit: cover;
}

.closed img{
  filter: grayscale(1);
}
.section-title{
  margin: 0;
  color: white;
}
.perk-row{
  margin:2px;
  position:absolute;
  top:10px;
  right:10px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(auto-fit,  minmax(10px, max-content)) ;
  z-index: 100;
}
.fake-label{
  border-radius: 5px;
  padding: 5px;
}
.store-indicators ion-chip{
  font-size: 12px;
}
.indicator-label{
  background: #ffffffb2;
  border-radius: 10px;
}
.indicator-label .indicator-label-text{
  color: #000000b2;
}


@media screen and (max-width: 740px) {
  .scroller-navigation{
    display: none;
  }
}
</style>

<template>
  <div class="store-slider-container ion-padding-vertical" v-if="list_filtered && list_filtered[0]">
    <ion-row v-if="!isMobile" class="scroller-navigation ion-justify-content-between ion-align-items-center">
      <ion-col class="ion-text-start">
        <ion-button @click="scrollSlider('prev')" shape="round" color="light"><ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon></ion-button>
      </ion-col>
      <ion-col class="ion-text-end">
        <ion-button @click="scrollSlider('next')" shape="round" color="light"><ion-icon slot="icon-only" :icon="chevronForwardOutline"></ion-icon></ion-button>
      </ion-col>
    </ion-row>
    <ion-item class="ion-justify-content-between" lines="none"  style="--background: transparent;--padding-start: 10px;">
          <h5 slot="start" class="section-title"><span class="fake-label" :style="`background-color: ${sliderTitleColor}`">#{{ sliderTitle }}</span></h5>
          <a slot="end"  @click="storeListModal(storeList, sliderTitle, sliderTitleColor)">
            <ion-item lines="none" :style="`color: ${sliderTitleColor}; cursor: pointer;`" >
              Показать все
              <ion-icon :icon="chevronForwardOutline" :color="sliderTitleColor"></ion-icon>
            </ion-item>
          </a>
    </ion-item>
    <div class="horizontalScroller store-slider" ref="storeSlider">
      <div v-for="(store_pair, store_pair_index) in list_filtered"  :key="store_pair_index" class="store-pair">
        <div v-for="(store_item, store_index) in store_pair"  :key="store_item.store_id" class="store-item">
          <ion-card style="position:relative;height:fit-content" :class="store_item.is_opened==0?'closed':''">
            <div @click="$go(`/catalog/store-${store_item.store_id}`)" class="crop-to-fit" style="height: 180px;cursor:pointer">
                <img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.700.700.webp'"/>
            </div>
            <div v-if="store_perks[store_pair_index][store_index].length > 0" class="perk-row" 
              :style="`width:${store_perks[store_pair_index][store_index].length*50}px`">
              <span v-for="perk in store_perks[store_pair_index][store_index]" :key="perk.image_hash" class="perk" >
                <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +perk.image_hash +'.80.80.png'}`"/>
                <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
              </span>
            </div>
          </ion-card>
          <ion-grid class="store-indicators">
            <ion-row class="ion-justify-content-between">
              <ion-col size="auto">
                <div @click="$go(`/catalog/store-${store_item.store_id}`)" style="cursor:pointer"  class="">
                  <ion-label lines="none" class="store-title" style=" font-size: 15px;">
                      <b>{{store_item.store_name}}</b>
                  </ion-label>
                </div>
              </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-between ion-padding-bottom" style="font-size: 12px">
              <ion-col size="auto" class="indicator-label">
                <div v-if="store_item.is_opened==1">
                    <label><ion-text color="success"> ◉ </ion-text> <ion-text class="indicator-label-text" color="medium">открыт до {{ store_item.store_time_closes }}:00</ion-text></label>
                </div>
                <div v-else>
                    <label v-if="store_item.is_working==0"><ion-text class="indicator-label-text"> ◉ </ion-text><ion-text color="medium">временно не работает</ion-text></label>
                    <label v-else-if="store_item.store_next_time_opens>0"><ion-text class="indicator-label-text"> ◉ </ion-text><ion-text color="medium">закрыт до {{ store_item.store_next_time_opens }}:00</ion-text></label>
                    <label v-else><ion-text color="danger"> ◉ </ion-text><ion-text class="indicator-label-text">закрыт</ion-text></label>
                </div>
              </ion-col>
              <ion-col size="auto"  class="indicator-label">
                <div v-if="store_item.deliveryTime.timeMin" lines="none">
                  <ion-text class="indicator-label-text">{{store_item.deliveryTime.timeMin}}-{{store_item.deliveryTime.timeMax}}мин</ion-text>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonLabel,
  IonText,
  IonItem,
  IonButton,
  modalController
}                   from "@ionic/vue";
import {  
  chevronBackOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'
 
import HomeStoreListModal   from '@/components/HomeStoreListModal.vue'
import Topic                    from '@/scripts/Topic.js'

export default {
  components: {
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonLabel,
    IonText,
    IonIcon,
    IonItem,
    IonButton
  },
  setup(){
      return {
        chevronBackOutline,
        chevronForwardOutline
      }
  },
  props: ['storeList', 'filter', 'sliderTitle', 'sliderTitleColor', 'backgroundImage'],
  data() {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
    };
  },
  computed: {
    list_filtered () {
      let list_filtered = this.filterSubstract(this.storeList);
      return this.filterGroup(list_filtered);
    },
    store_perks () {
      return this.list_filtered.map(function(store_pair) {
        return store_pair.map(function(store) {
          return store.perks.filter(perk => perk.slot == 'perk')
        });
      });
    }
  },
  methods: {
    filterSubstract(storeList){
      let result = storeList.filter( (store)=> {
        for (let key in this.filter) {
          if(this.filter[key].type == 'equals' && store[key] == this.filter[key].value){
            return true
          }
          if(this.filter[key].type == 'includes' && store[key]?.includes(this.filter[key].value)){
            return true
          }
        }
        return false;
      })
      return result;
    },
    filterGroup(listFiltered){
      if(!listFiltered.length){
        return []
      }
      if(listFiltered.length <= 2){
        return [listFiltered]
      }
      let store_pairs = listFiltered.reduce(function(result, value, index, array) {
        if (index % 2 === 0){
          result.push(array.slice(index, index + 2));
        }
        return result;
      }, []);
      return store_pairs;
    },
    async storeListModal( storeList, modalTitle, modalColor ){
      const filteredStoreList = this.filterSubstract(storeList)
      const modal = await modalController.create({
          component: HomeStoreListModal,
          componentProps:{filteredStoreList, modalTitle, modalColor},
          initialBreakpoint: 1,
          breakpoints: [1, 1]
          });
        const dismissFn=function(){
        modal.dismiss();
      };
      Topic.on('dismissModal',dismissFn);
      return modal.present();
    },
    scrollSlider (direction){
      let stepWidth = 330
      let scrollLeft
      if(direction == 'prev') scrollLeft = this.$refs.storeSlider.scrollLeft - stepWidth;
      if(direction == 'next') scrollLeft = this.$refs.storeSlider.scrollLeft + stepWidth;
      this.$refs.storeSlider.scrollTo({
        top: 0,
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }
};
</script>

