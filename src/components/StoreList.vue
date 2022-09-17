<style scoped>
.crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 180px;
}

.crop-to-fit ion-img {
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
</style>

<template>
  <ion-card color="warning">
    <ion-card-header>
      <ion-card-title>Присоединяйтесь к команде</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p>Многие продавцы еще на стадии модерации.
      Поэтому доступных магазинов и ресторанов в вашем районе может быть не так много.</p>
      Позвоните нам по телефону <a href="tel:+79785451935">+7 (978) 54-51-935</a> и мы поможем оформить ваше предприятие в нашем сервисе.
      <ion-button onclick="location.href='tel:+79785451935'" expand="block" color="success">Позвонить</ion-button>
      <ion-button href="/page/supplier-guide" expand="block">Как стать продавцом</ion-button>
    </ion-card-content>
  </ion-card>

  <ion-list v-if="!storeList" class="store-list" >
    <ion-card button v-for="store_item in [1,1]" :key="store_item">
        <div class="crop-to-fit" style="background-color:var(--ion-color-light)">

        </div>
        <ion-chip color="success"><ion-skeleton-text style="width:130px;" animated></ion-skeleton-text></ion-chip>

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
    <ion-card-content style="font-family:Roboto">
      К сожалению, не найдено подходящих магазинов и ресторанов. <br/>Возможно вы находитесь вне радиуса доставки.
    </ion-card-content>
  </ion-card>

  <ion-list v-if="storeList && storeList.length>0" class="store-list"  style="box-shadow: 0px 0px 15px #0004;">
    <ion-card button v-for="store_item in storeList" :key="store_item.store_id" @click="$router.push(`/catalog/store-${store_item.store_id}`)"  :class="store_item.is_opened==0?'closed':''">
      <router-link :to="`/catalog/store-${store_item.store_id}`">
        <div class="crop-to-fit">
            <ion-img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.300.300.webp'"/>
        </div>
      </router-link>
        <store-opened-indicator :storeItem="store_item"/>

        <ion-chip v-if="store_item.deliveryTime.timeMin" color="primary">{{store_item.deliveryTime.timeMin}}-{{store_item.deliveryTime.timeMax}}мин</ion-chip>
        <ion-item lines="none">
            <h3>{{store_item.store_name}}</h3>
        </ion-item>

    </ion-card>
  </ion-list>

</template>

<script>
import {
  IonList,
  IonImg,
  IonChip,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
  IonButton
}                   from "@ionic/vue";
import jQuery       from "jquery";
import heap         from "@/heap";
import Utils        from '@/scripts/Utils.js'
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';

export default {
  components: {
    IonList,
    IonImg,
    IonChip,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSkeletonText,
    IonButton,
    StoreOpenedIndicator,
  },
  data() {
    return {
      storeList: null,
    };
  },
  methods: {
    async listGet() {
      var main_address = heap.state.user.location_main;
      if (!main_address) {
        return;
      }
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
      this.listGet();
    })
    this.listGet();
  }
};
</script>

