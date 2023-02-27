<style scoped>
.crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 150px;
}

.crop-to-fit ion-img {
  flex-shrink:0;
  min-width:100%;
  min-height:100%
}
ion-card{
  border-radius: 10px;
}
ion-card .store-title{
  --min-height: auto;
  padding-top: 10px;
}
.closed ion-img{
  filter: grayscale(1);
}
.section-title{
  margin: 0;
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
}
.perk-slider{
  --swiper-navigation-size: 20px;
}
.perk-slider ion-grid{
  padding: 5px 30px;
  border-top: 1px solid #eee;
}
.perk-slider .perk-image {

}
.perk-slider .perk-title {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
}
.perk-slider .perk-label {
  font-size: 16px;
  color: var(--ion-color-primary);
}
</style>

<template>
  <ion-list v-if="!storeList" class="store-list" >
    <ion-card button v-for="store_item in [1,1,1,1]" :key="store_item">
        <div class="crop-to-fit" style="background-color:var(--ion-color-light)"></div>
        <ion-chip color="medium"><ion-skeleton-text style="width:130px;" animated></ion-skeleton-text></ion-chip>
        <ion-chip color="primary"><ion-skeleton-text style="width:100px;" animated></ion-skeleton-text></ion-chip>
        <ion-item lines="none">
            <ion-skeleton-text style="width:70%;height:1.5em" animated></ion-skeleton-text>
        </ion-item>
    </ion-card>
  </ion-list>

  <ion-card v-else-if="storeList.length==0" color="warning">
    <ion-card-header>
      <ion-card-title>Вне зоны обслуживания</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      Поблизости к адресу <b>{{ $heap.state.user.location_main.location_address??'доставки заказа' }}</b>, который вы выбрали, пока нет нет подходящих ресторанов и магазинов. Попробуйте другой адрес.
    </ion-card-content>
  </ion-card>
  
  <ion-grid  v-if="storeList && storeList.length>0" class="ion-justify-content-between ion-align-items-center" style="padding: 0 16px;">
    <ion-row>
      <ion-col size="10">
        <h5 class="section-title">Магазины и рестораны</h5>
      </ion-col>
      <ion-col  size="2" class="ion-align-self-end">
        <ion-icon style="font-size: 20px;" :icon="searchOutline"/>
      </ion-col>
    </ion-row>
  </ion-grid>
  <ion-list v-if="storeList && storeList.length > 0" class="store-list">
    <ion-card style="position:relative" v-for="(store_item, store_index) in storeList"  :key="store_item.store_id"  :class="store_item.is_opened==0?'closed':''">
      <router-link :to="`/catalog/store-${store_item.store_id}`">
        <div class="crop-to-fit">
            <ion-img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.500.500.webp'"/>
        </div>
      </router-link>
      <div 
        v-if="store_perks[store_index].length > 0" 
        class="perk-row" 
         :style="`width:${store_perks[store_index].length*50}px`">
        <span v-for="perk in store_perks[store_index]" :key="perk.image_hash" class="perk" >
          <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +perk.image_hash +'.80.80.png'}`"/>
          <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
        </span>
      </div>
        
      <router-link :to="`/catalog/store-${store_item.store_id}`" style="text-decoration: none">
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
      </router-link>

        <swiper class="perk-slider" v-if="store_perks_slider[store_index].length > 0" 
          :modules="modules" 
          :speed="400"
          :slidesPerView="1"
          :navigation="true"
        >
          <swiper-slide v-for="(productPerk, productPerkIndex) in store_perks_slider[store_index]" :key="productPerkIndex">
            <ion-grid>
              <ion-row class="ion-justify-content-around ion-align-items-center">
                <ion-col size="3">
                    <ion-img class="perk-image" v-if="productPerk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +productPerk.image_hash +'.100.10                -0.webp'}`"/>
                </ion-col>
                <ion-col size="7">
                  <b class="perk-title">{{ productPerk.perk_title }}</b>
                </ion-col>
                <ion-col size="2">
                  <b class="perk-label">{{ productPerk.perk_label }}</b>
                </ion-col>
              </ion-row>
            </ion-grid>
          </swiper-slide>
        </swiper>
    </ion-card>
  </ion-list>

</template>

<script>
import {
  IonList,
  IonImg,
  IonChip,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
}                   from "@ionic/vue";
import {  
  timeOutline, 
  searchOutline
 }                  from 'ionicons/icons'
 
import { 
  Navigation, 
  Autoplay 
}                   from 'swiper';
import { 
  Swiper,
  SwiperSlide 
 }                  from 'swiper/vue';
import jQuery       from "jquery";
import heap         from "@/heap";
import Utils        from '@/scripts/Utils.js'
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';

export default {
  components: {
    IonList,
    IonImg,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonCard,
    IonIcon,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSkeletonText,
    Swiper,
    SwiperSlide,
    StoreOpenedIndicator,
  },
  setup(){
      return {
        modules: [Autoplay,Navigation],
        timeOutline,
        searchOutline
      }
  },
  data() {
    return {
      storeList: null,
      can_reload_at:0,
    };
  },
  computed: {
    
    store_perks () {
      return this.storeList.map(function(store) {
        return store.perks.filter(perk => perk.slot == 'perk')
      });
    },
    store_perks_slider () {
      return this.storeList.map(function(store) {
        return store.perks.filter(perk => perk.slot == 'slider')
      });
    }
  },
  methods: {
    async listGet() {
      var main_address = heap.state.user.location_main;
      if (!main_address) {
        return;
      }
      const now=Date.now()
      if(this.can_reload_at>now){
        return
      }
      this.can_reload_at=now+2000

      try{
        const found=await jQuery.post(heap.state.hostname + "Store/listNearGet", {location_id: main_address.location_id,})
        this.storeList=this.storeListCalculate(found)
      }catch{/** */}
    },
    storeListCalculate(found){
      for(let i in found){
        found[i].deliveryTime=Utils.deliveryTimeCalculate(found[i].distance,found[i].store_time_preparation)
      }
      return found
    },
  },
  mounted(){
    this.$topic.on('userGet',()=>{
      this.listGet();
    }) 
    this.$topic.on('userMainLocationSet',mainloc=>{
      this.can_reload_at=0
      this.listGet();
    })
    this.listGet();
  }
};
</script>

