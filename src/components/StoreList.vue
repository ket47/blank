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
  position:absolute;top:0px;right:20px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(auto-fit,  minmax(10px, max-content)) ;
}
.perk{
  background-position: center ;
  background-size: 70px auto;
  background-color:#fff;
  border-radius:35px;
  border:5px solid #fff;

  height:70px;
  width:70px;
  display: flex;
  justify-content: start;
  align-items: start;

  color:var(--ion-color-primary);
  font-size:1.3em;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  text-shadow: 1px 1px 1px #fff;
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
  <ion-list v-if="storeList && storeList.length>0" class="store-list" >
    <ion-card style="position:relative" button v-for="store_item in storeList" :key="store_item.store_id" @click="$router.push(`/catalog/store-${store_item.store_id}`)"  :class="store_item.is_opened==0?'closed':''">
      <router-link :to="`/catalog/store-${store_item.store_id}`">
        <div class="crop-to-fit">
            <ion-img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.500.500.webp'"/>
        </div>
      </router-link>


        <div class="perk-row" :style="`width:${store_item.perks.length*50}px`">
            <div v-for="perk in store_item.perks" :key="perk.image_hash" class="perk" :style="`background-image:url(${$heap.state.hostname +'/image/get.php/' +perk.image_hash +'.80.80.png'})`">
              {{perk.perk_label}}
            </div>
        </div>








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
    StoreOpenedIndicator,
  },
  setup(){
      return {
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

