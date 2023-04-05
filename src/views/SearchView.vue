<style scoped>
.product_list_widget_grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
<template>
  <base-layout page-title="Поиск товаров" hideBackLink="true">
    <ion-searchbar class="search-container" v-model="query" @input="delayedListGet()" @ionClear="delayedListGet()" placeholder="начните искать"></ion-searchbar>
    <div v-if="found">
      <ion-title>Найденные товары</ion-title>
      <ion-card v-for="store in found.product_matches" :key="store.store_id">
        <ion-card-header>
          <ion-item detail button @click="$go(`/search/store-${store.store_id}`)" lines="full">
            <ion-thumbnail slot="start">
              <ion-img style="border-radius:10px" :src="`${$heap.state.hostname}image/get.php/${store.image_hash}.150.150.webp`"/>
            </ion-thumbnail>
            <p style="font-size:1.1em">{{store?.store_name}}</p>
            <ion-note slot="helper">{{store.store_description}}</ion-note>
          </ion-item>
        </ion-card-header>
        <ion-card-content>
          <div>
            <store-opened-indicator :storeItem="store"/>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, 150px)">
            <div v-for="productItem in store.matches" :key="productItem.product_id">                
              <product-item :productItem="productItem" :storeName="store.store_name"/>
            </div>
          </div>
        </ion-card-content>
      </ion-card>
    </div>
    <div v-else-if="found==null">
      <ion-title>Найденные товары</ion-title>
      <ion-card>
        <ion-card-header>
          <ion-item detail lines="full">
            <ion-thumbnail slot="start">
              <ion-skeleton-text style="width:50px;height:50px" animated></ion-skeleton-text>
            </ion-thumbnail>
            <ion-skeleton-text style="width:300px;height:30px" animated></ion-skeleton-text>
            <ion-note slot="helper"><ion-skeleton-text style="width:300px"></ion-skeleton-text></ion-note>
          </ion-item>
        </ion-card-header>
        <ion-card-content>
          <ion-chip>
            <ion-skeleton-text style="width:100px"></ion-skeleton-text>
          </ion-chip>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, 150px)">
            <div v-for="i in [1,2,3,4]" :key="i">                
              <ion-skeleton-text style="width:120px;height:120px" animated></ion-skeleton-text>
              <ion-skeleton-text style="width:120px;height:30px" animated></ion-skeleton-text>
            </div>
          </div>          
        </ion-card-content>
      </ion-card>
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