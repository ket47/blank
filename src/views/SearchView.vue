<style scoped>
.product_list_widget_grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
<template>
  <base-layout page-title="Поиск товаров" pageDefaultBackLink="/search">
    <ion-searchbar class="search-container" v-model="query" @input="delayedListGet()" placeholder="начните искать"></ion-searchbar>
    <div v-if="found" style="background-color:var(--ion-color-light-tint);padding:10px">
      <ion-title>Найденные товары</ion-title>
      <ion-list v-for="store in found.product_matches" :key="store.store_id" style="border-radius:10px;margin-top:30px;">
          <ion-item detail button @click="$router.push(`/search/store-${store.store_id}`)" lines="full">
            <ion-thumbnail slot="start">
              <ion-img style="border-radius:10px" :src="`${$heap.state.hostname}image/get.php/${store.image_hash}.150.150.webp`"/>
            </ion-thumbnail>
            <p style="font-size:1.1em">{{store?.store_name}}</p>
            <ion-note slot="helper">{{store.store_description}}</ion-note>
          </ion-item>
          <div>
            <store-opened-indicator :storeItem="store"/>
          </div>
          <div style="margin:10px;display:grid;grid-template-columns:repeat(auto-fit, 160px)">
            <div v-for="productItem in store.matches" :key="productItem.product_id">                
              <product-item :productItem="productItem" :storeName="store.store_name"/>
            </div>
          </div>
      </ion-list>
    </div>
    <div v-else>
      <ion-card color="light">
        <ion-card-header>
          <ion-card-title>Ничего не найдено.</ion-card-title>
        </ion-card-header>
        <ion-card-content>Возможно у нас нет того что вы ищите или вы находитель слишком далеко</ion-card-content>
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
  IonList,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
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
  IonList,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  ProductItem
  },
  data(){
    return {
      query:this.$route.query.q||'',
      found:null
    }
  },
  ionViewDidEnter(){
    this.delayedListGet()
  },
  created(){
    this.delayedListGet()
    let self=this;
    this.$topic.on('userGet',user=>{
      if(!this.found){
        self.listGet()//repeated loadings
      }
    })
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
        const found=await jQuery.get(this.$heap.state.hostname+'Search/listGet',request)
        this.found=this.storeListCalculate(found)
      }catch{
        this.found=null
      }
    },
    storeListCalculate(found){
      if( !found.product_matches?.length ){
        return null
      }
      for(let i in found.product_matches){
        found.product_matches[i].deliveryTime=Utils.deliveryTimeCalculate(found.product_matches[i].distance,found.product_matches[i].store_time_preparation)
      }
      return found
    },
    locMainGet(){
      return this.$heap.state.user.location_main?this.$heap.state.user.location_main.location_id:null
    },
    delayedListGet(){
      clearTimeout(this.clock)
      const self=this;
      this.clock=setTimeout(()=>{self.listGet()},200)
    },
  }
}
</script>