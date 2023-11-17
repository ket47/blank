<style scoped>
.product_list_widget_grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
<template>
  <base-layout page-title="Поиск" hideBackLink="true">
    <ion-searchbar class="search-container" v-model="query" debounce="400" @ionInput="listGet()" @ionClear="listGet()" placeholder="начните искать"></ion-searchbar>
    <div v-if="found?.product_matches?.length>0">
      <h2 class="ion-padding">Результат поиска</h2>
      <div v-for="store in found.product_matches" :key="store.store_id" class="ion-padding-top">
          <ion-item detail button @click="$go(`/search/store-${store.store_id}`)" lines="none" color="light">
            <ion-thumbnail slot="start">
              <ion-img style="border-radius:10px" :src="`${$heap.state.hostname}image/get.php/${store.image_hash}.150.150.webp`"/>
            </ion-thumbnail>
            <p style="font-size:1.1em">{{store?.store_name}}</p>
            <ion-note slot="helperText">{{store.store_description}}</ion-note>
          </ion-item>
          <ion-item lines="none">
              <div class="horizontalScroller" style="padding:6px">
                <store-opened-indicator :storeItem="store"/>
                <ion-chip color="medium">
                {{store.deliveryTime.timeMin}}-{{store.deliveryTime.timeMax}}мин
                </ion-chip>
                <ion-note v-if="store.is_foodstore"> #магазин</ion-note>
                <ion-note v-if="store.is_halal"> #элял</ion-note>
                <ion-note v-if="store.is_fastfood"> #фастфуд</ion-note>
                <ion-note v-if="store.is_restaurant"> #ресторан</ion-note>
            </div>
          </ion-item>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, 160px);padding:10px;gap:10px">
            <div v-for="productItem in store.matches" :key="productItem.product_id">                
              <product-item :productItem="productItem" :storeName="store.store_name"/>
            </div>
          </div>
      </div>

    </div>
    <div v-else-if="found==null">
      <h2 class="ion-padding">Результат поиска</h2>
      <ion-item detail lines="full" color="light">
        <ion-thumbnail slot="start">
          <ion-skeleton-text style="width:50px;height:50px;border-radius:10px;margin-top:3px;" animated></ion-skeleton-text>
        </ion-thumbnail>
        <ion-skeleton-text style="width:300px;height:30px;border-radius:10px" animated></ion-skeleton-text>
        <ion-note slot="helperText"><ion-skeleton-text style="width:300px"></ion-skeleton-text></ion-note>
      </ion-item>
      <ion-item lines="none">
        <div class="horizontalScroller" style="padding:6px">
          <ion-chip color="medium">
            <ion-skeleton-text style="width:100px"></ion-skeleton-text>
          </ion-chip>
          <ion-chip color="medium">
            <ion-skeleton-text style="width:100px"></ion-skeleton-text>
          </ion-chip>
        </div>
      </ion-item>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, 160px);padding:10px;gap:10px">
        <div v-for="i in [1,2,3,4]" :key="i">                
          <ion-skeleton-text style="width:150px;height:150px;border-radius:10px" animated></ion-skeleton-text>
          <ion-skeleton-text style="width:150px;height:30px;border-radius:10px" animated></ion-skeleton-text>
        </div>
      </div>          

    </div>
    <div v-else>
      <ion-card color="light">
        <ion-card-header>
          <ion-card-title>Ничего не найдено.</ion-card-title>
        </ion-card-header>
        <ion-card-content>Возможно у нас нет того что вы ищите или вы находитель за пределами зоны доставки</ion-card-content>
      </ion-card>
    </div>
  </base-layout>
</template>

<script>
import {
  IonSearchbar,
  IonTitle,
  IonImg,
  IonThumbnail,
  IonNote,
  IonItem,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonSkeletonText,
  IonChip,
}                       from '@ionic/vue'
import jQuery           from 'jquery'
import Utils            from '@/scripts/Utils.js'
import ProductItem      from '@/components/ProductItem.vue'
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';

export default  {
  components:{
  StoreOpenedIndicator,
  IonSearchbar,
  IonTitle,
  IonImg,
  IonThumbnail,
  IonNote,
  IonItem,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonSkeletonText,
  IonChip,
  ProductItem
  },
  data(){
    return {
      query:this.$route.query.q||'',
      found:null
    }
  },
  created(){
    this.listGet()
    this.$topic.on('userMainLocationSet',user=>this.listGet())
  },
  methods:{
    async listGet(){
      const request={
        query:this.query,
        in_products:1,
        in_stores:0,
        location_id:this.locMainGet()
      }
      if(!request.location_id){
        return
      }
      try{
        let found=await Utils.prePost(`${this.$heap.state.hostname}Search/listGet`,request)
        if( found ){
          this.found=this.storeListCalculate(found)
        }
        found=await Utils.post(`${this.$heap.state.hostname}Search/listGet`,request)
        this.found=this.storeListCalculate(found)
      }catch(err){
        this.found=null
      }
    },
    storeListCalculate(found){
      if( !found.product_matches?.length ){
        return []
      }
      for(let i in found.product_matches){
        found.product_matches[i].deliveryTime=Utils.deliveryTimeCalculate(found.product_matches[i].distance,found.product_matches[i].store_time_preparation)
        let groups=found.product_matches[i].member_of_groups.split(',')
        for(let g of groups ){
          found.product_matches[i][`is_${g}`]=1
        }
      }
      return found
    },
    locMainGet(){
      return this.$heap.state.user.location_main?this.$heap.state.user.location_main.location_id:null
    },
    delayedListGet(){
      clearTimeout(this.clock)
      const self=this;
      this.clock=setTimeout(()=>{self.listGet()},400)
    },
  }
}
</script>