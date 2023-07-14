<style scoped>
.store-slider-container{
  background-size: auto;
  background-repeat: no-repeat;
  background-position-y: center;
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
}

.store-slider{
  display: flex;
}
.scroll-left-animation{
  animation: scrollLeft  1s ease;
}
@keyframes scrollLeft{
  0% {
    padding-left: 100vw;
  }
  50% {
    padding-left: 100vw;
  }
  100% {
    padding-left: 0vw;
  }
}
.store-pair{
  display: grid;/* To equalize the gaps */
}
.store-slider .store-item{
  width: 330px;
}
.store-slider ion-card::before{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0) 80%);
  pointer-events: none;
  z-index: 99;
}
.store-slider .crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 150px;
}

.store-slider .crop-to-fit ion-img {
  flex-shrink:0;
  min-width:100%;
  min-height:100%
}
ion-card{
  border-radius: 10px;
}
.closed ion-img{
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
.store-indicators{
  position:absolute;
  bottom:10px;
  left: 0;
  width: 100%;
  z-index: 100;
}
.store-indicators ion-chip{
  font-size: 12px;
}

@media screen and (max-width: 740px) {
  .scroller-navigation{
    display: none;
  }
}
</style>

<template>
  <div class="store-slider-container ion-margin-top ion-padding-vertical" v-if="list_filtered && list_filtered.length > 0" :style="`background-image: url(${backgroundImage})`">
    <ion-row class="scroller-navigation ion-justify-content-between ion-align-items-center">
      <ion-col class="ion-text-start">
        <ion-button @click="scrollSlider('prev')" shape="round" color="light"><ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon></ion-button>
      </ion-col>
      <ion-col class="ion-text-end">
        <ion-button @click="scrollSlider('next')" shape="round" color="light"><ion-icon slot="icon-only" :icon="chevronForwardOutline"></ion-icon></ion-button>
      </ion-col>
    </ion-row>
    <ion-item class="ion-justify-content-between" lines="none"  style="--background: transparent;">
          <h5 slot="start" class="section-title"><span class="fake-label" :style="`background-color: ${sliderTitleColor}`">#{{ sliderTitle }}</span></h5>
          <a slot="end"  @click="storeListModal(storeList, sliderTitle, sliderTitleColor)">
            <ion-item lines="none" :style="`color: ${sliderTitleColor}`" >
              Показать все
              <ion-icon :icon="chevronForwardOutline" :color="sliderTitleColor"></ion-icon>
            </ion-item>
          </a>
    </ion-item>
    <div class="horizontalScroller scroll-left-animation store-slider" ref="storeSlider">
      <div v-for="(store_pair, store_pair_index) in list_filtered"  :key="store_pair_index" class="store-pair">
        <div v-for="(store_item, store_index) in store_pair"  :key="store_item.store_id" class="store-item">
          <ion-card style="position:relative;height:fit-content" :class="store_item.is_opened==0?'closed':''">
            <div @click="$go(`/catalog/store-${store_item.store_id}`)" class="crop-to-fit" style="height: 180px;cursor:pointer">
                <ion-img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.500.500.webp'"/>
            </div>
            <div 
              v-if="store_perks[store_pair_index][store_index].length > 0" class="perk-row" 
              :style="`width:${store_perks[store_pair_index][store_index].length*50}px`">
              <span v-for="perk in store_perks[store_pair_index][store_index]" :key="perk.image_hash" class="perk" >
                <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +perk.image_hash +'.80.80.png'}`"/>
                <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
              </span>
            </div>
            <ion-grid class="store-indicators">
              <ion-row class="ion-justify-content-between">
                <ion-col size="auto">
                  <store-opened-indicator :storeItem="store_item"/>
                  </ion-col>
                <ion-col size="auto">
                  <ion-chip v-if="store_item.deliveryTime.timeMin" color="light" style="background: rgba(0,0,0,0.5);" >
                    <ion-icon :icon="timeOutline" ></ion-icon> 
                    <label>{{store_item.deliveryTime.timeMin}}-{{store_item.deliveryTime.timeMax}}мин</label>
                  </ion-chip>
                </ion-col>
              </ion-row>
              <ion-row class="ion-justify-content-between">
                <ion-col size="auto">
                  <div @click="$go(`/catalog/store-${store_item.store_id}`)" style="cursor:pointer"  class="ion-padding-horizontal">
                    <ion-label lines="none" class="store-title" style="--background: transparent; color: white;">
                        <b>{{store_item.store_name}}</b>
                    </ion-label>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>  
          </ion-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  IonImg,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonLabel,
  IonItem,
  IonButton,
  modalController
}                   from "@ionic/vue";
import {  
  timeOutline, 
  chevronBackOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'
 
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';
import HomeStoreListModal   from '@/components/HomeStoreListModal.vue'
import Topic                    from '@/scripts/Topic.js'

export default {
  components: {
    StoreOpenedIndicator,
    IonImg,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonLabel,
    IonIcon,
    IonItem,
    IonButton
  },
  setup(){
      return {
        timeOutline,
        chevronBackOutline,
        chevronForwardOutline
      }
  },
  props: ['storeList', 'filter', 'sliderTitle', 'sliderTitleColor', 'backgroundImage'],
  data() {
    return {
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
      let result = storeList.filter( (item)=> {
        for (let key in this.filter) {
          if (item[key] === undefined ) return false;
          let outOfFilter = true
          if(this.filter[key].type == 'equals' && item[key] != this.filter[key].value) outOfFilter = false;
          if(this.filter[key].type == 'includes' && !item[key].includes(this.filter[key].value)) outOfFilter = false;
          if(!outOfFilter) return false
        }
        return true;
      })
      return result;
    },
    filterGroup(listFiltered){
      if(listFiltered.length <= 2) return [listFiltered]
      let store_pairs = listFiltered.reduce(function(result, value, index, array) {
        if (index % 2 === 0)
          result.push(array.slice(index, index + 2));
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

