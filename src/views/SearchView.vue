<style scoped>
.search-list-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
}
.search-item{
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  border: 3px solid transparent;
  cursor: pointer;
}
.search-item-container{
  position: relative;
  height: 100%;
  border: 3px solid transparent;
}
.search-list-grid .search-store-item .crop-to-fit{
  position: relative;
}
.search-list-grid .search-store-item .crop-to-fit:before{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #00000087, transparent);
}
.search-list-grid .search-store-item ion-card{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
  box-shadow: none;
  background: transparent;
}
.search-list-grid .store-indicators{
  color: white;
}
.search-list-grid .search-store-item ion-card-header{
  color: white;
}
.search-list-grid .search-product-item ion-card{
  position: relative;
  margin: 0;
  box-shadow: none;
}

.item-width-1{
  flex: 25% 0 1;
}
.item-width-2{
  flex: 50% 0 1;
}

.crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 10px;
  height: 100%;
  max-height: 370px;
}

.item-width-1 .crop-to-fit {
  height: 250px;
}

.crop-to-fit img{
  min-width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-category-grid{
  display: grid;
  align-items: end;
  grid-template-columns: calc(25% - 5px) calc(25% - 5px) calc(25% - 5px) calc(25% - 5px);
  grid-gap: 10px;
  padding: 10px;
}

.search-category-item{
  background: white;
  box-shadow: 0px 0px 0px 1px #eee;
  display: grid;
  border-radius: 10px;
  overflow: hidden;
  height: 150px;
  width: 100%;
  position: relative;
}
.search-category-item .desc-section{
  padding: 5px;
}
.search-category-item .img-section{
  justify-self: end;
  text-align: right;
  /*position: absolute;*/
  bottom: 0;
  right: 0;
}
.search-category-item .img-section img{
  vertical-align: bottom;
}
.search-category-item h5{
  margin: 5px;
  font-size: 13px;
  font-weight: bold;
}
@media screen and (max-width: 740px) {
  .item-width-1{
    flex: 50% 0 1;
  }
  .item-width-2{
    flex: 100%;
  }
  .search-category-item{
    height: 120px;
  }
  .search-category-item .img-section{
    width: 70%;
  }
  .search-category-grid{
    grid-template-columns: calc(50% - 5px) calc(50% - 5px);
  }
}
</style>
<template>
  <base-layout page-title="Поиск" hideBackLink="true">
    <user-address-widget/>
    
    <search-bar :value="query"  @on-search="(val)=>{query = val; listGet()}" @on-focus-change="(val)=>{isActiveSearch = val}" debounce="100"/>
    
    <div v-if="activeView == 'search' && !isActiveSearch && !isLoading">
      <div v-if="found?.length>0">
        <h2 class="ion-padding">{{ query }}:</h2>
        <div class="search-list-grid">
          <div v-for="item in found" :key="item.href" :class="`search-item item-width-${item.width}`">
              <product-item-new v-if="item.type == 'product'" :productItem="item"></product-item-new> 
              <div class="search-item-container search-store-item" v-else-if="item.type == 'store'" @click="$go(`/catalog/store-${item.store_id}`)">
                <div class="crop-to-fit">
                  <img :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.1000.1000.webp`"/>
                </div>
                <ion-card>
                  <ion-card-content>
                    <ion-grid class="store-indicators">
                      <ion-row class="ion-justify-content-between">
                        <ion-col size="9">
                          <div  style="cursor:pointer"  class="">
                            <h4 lines="none" class="store-title " style=" font-size: 15px;">
                                <b>{{item.store_name}}</b>
                            </h4>
                          </div>
                        </ion-col>
                      </ion-row>
                      <ion-row class="ion-justify-content-between " style="font-size: 12px">
                        <ion-col size="auto" class="indicator-label">
                          <div v-if="item.is_opened==1">
                              <label><ion-text color="success"> ◉ </ion-text> <ion-text class="indicator-label-text">открыт до {{ item.store_time_closes }}:00</ion-text></label>
                          </div>
                          <div v-else>
                              <label v-if="item.is_working==0"><ion-text class="indicator-label-text"> ◉ </ion-text><ion-text>не работает</ion-text></label>
                              <label v-else-if="item.store_opens_tomorrow"><ion-text class="indicator-label-text" color="warning"> ◉ </ion-text><ion-text>Доставим завтра</ion-text></label>
                              <label v-else-if="item.store_next_time_opens>0"><ion-text class="indicator-label-text"> ◉ </ion-text><ion-text>закрыт до {{ item.store_next_time_opens }}:00</ion-text></label>
                              <label v-else><ion-text color="danger"> ◉ </ion-text><ion-text class="indicator-label-text">закрыт</ion-text></label>
                          </div>
                        </ion-col>
                        <ion-col size="auto"  class="indicator-label">
                          <div v-if="item.deliveryTime.timeMin && item.is_opened==1" lines="none">
                            <ion-text class="indicator-label-text">{{item.deliveryTime.timeMin}}-{{item.deliveryTime.timeMax}}мин</ion-text>
                          </div>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </ion-card-content>
                </ion-card>
              </div>   
          </div>
        </div>
      </div>
      <div v-else class="ion-padding">
          <h2>Ничего не нашлось по запросу "{{query}}".</h2>
          <p>Возможно у нас нет того что вы ищите или вы находитель за пределами зоны доставки</p>
      </div>
    </div>

    <div class="search-category-grid"  v-else-if="activeView == 'category' && !isActiveSearch && !isLoading">
      <div class="search-category-item" v-for="(category, k) in categories" @click="query = category.group_name; listGet()" :key="k">
        <div class="desc-section">
          <h5> {{ category.group_name }}</h5>
        </div>
        <div v-if="category.image_hash" class="img-section">
          <img :src="`${$heap.state.hostname +'image/get.php/' +category.image_hash +'.180.180.png'}`"/>
        </div>
      </div>
    </div>
    
    <div v-else-if="isLoading && !isActiveSearch">
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
  </base-layout>
</template>

<script>
import {
  IonItem,
  IonCard,
  IonCardContent,
  IonSkeletonText,
  IonChip,
  IonRow,
  IonCol,
  IonText,
  IonGrid
}                       from '@ionic/vue'
import Utils            from '@/scripts/Utils.js'
import ProductItemNew   from '@/components/ProductItemNew.vue'
import SearchBar        from '@/components/SearchBar.vue'
import UserAddressWidget    from "@/components/UserAddressWidget";

export default  {
  components:{
    IonItem,
    IonCard,
    IonCardContent,
    IonSkeletonText,
    IonChip, 
    ProductItemNew,
    SearchBar,
    UserAddressWidget,
    IonRow,
    IonCol,
    IonText,
    IonGrid
  },
  data(){
    return {
      isActiveSearch: false,
      query:this.$route.query.q||'',
      suggestions: [],
      found:null,
      isLoading: false,
      categories: [],
      activeView: 'category'
    }
  },
  created(){
    this.categoryListGet()
    this.$topic.on('userMainLocationSet',user=>this.categoryListGet())
    location.hash = ''
    window.onhashchange = () => {
      if(location.hash !== ''){
        this.activeView = 'search'
      } else {
        this.activeView = 'category'
        this.query = ''
      }
    }
  },
  ionViewDidEnter(){
    location.hash = ''
    this.activeView = 'category'
  },
  methods:{
    async listGet(){
      this.isLoading = true;
      const request={
        query:this.query,
        in_products:1,
        in_stores:0,
        location_id:this.locMainGet()
      }
      if(this.query == ""){
        this.found = null
        this.isLoading = false;
        return
      }
      if(!request.location_id){
        this.isLoading = false;
        return
      }
      try{
        let response=await Utils.prePost(`${this.$heap.state.hostname}Search/listGet`,request)
        if( response ){
          this.found=this.storeListCalculate(response)
        }
        response=await Utils.post(`${this.$heap.state.hostname}Search/listGet`,request)
        this.found=this.storeListCalculate(response)
        this.isLoading = false;
      }catch(err){
        console.log(err)
        this.found=null
        this.isLoading = false;
      }
    },
    storeListCalculate(response){
      if( !response.product_matches?.length ){
        return []
      }
      let result = []
      for(let i in response.product_matches){
          let store = response.product_matches[i]
          store.type = 'store';
          store.width = 2;
          store.deliveryTime=Utils.deliveryTimeCalculate(store.distance, store.store_time_preparation)
          result.push(store);
          for(let g in response.product_matches[i].matches ){
            var product = store.matches[g];
            product.type = 'product';
            product.width = 1;
            product.store = store;
            result.push(product);
          }
      }  
      return result
    },
    
    async categoryListGet(parent_id = 0){
      this.isLoading = true;
      const request={
        parent_id: parent_id
      }
      try{
        let response=await Utils.prePost(`${this.$heap.state.hostname}Search/categoryListGet`,request)
        if( response ){
          this.categories=response
        }
        response=await Utils.post(`${this.$heap.state.hostname}Search/categoryListGet`,request)
        this.categories=response
        this.isLoading = false;
      }catch(err){
        console.log(err)
        this.isLoading = false;
      }
    },
    locMainGet(){
      return this.$heap.state.user.location_main?this.$heap.state.user.location_main.location_id:null
    }
  },
  watch:{
      'found'(){
          if(!this.found){
            location.hash = ''
          } else {
            location.hash = '#search'
          }
          console.log(this.activeView)
      },
      'isLoading'(){
          if(this.isLoading){
            //this.activeView = 'loading'
          } 
      },
  }
}
</script>