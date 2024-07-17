<style scoped>
.crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 150px;
  border-radius: 10px;
}
.crop-to-fit img{
  min-width: 100%;
  height: 100%;
  object-fit: cover;
}
ion-card{
  border-radius: 10px;
  contain: initial;
  overflow: visible;
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
  left:10px;
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
  border-radius:10px;
}
.perk-slider .perk-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
}
@media screen and (min-width: 740px) {
  .store-list{
    display: grid;
    grid-template-columns: 33% 33% 33%;
  }
}
.rating{
  font-family: Roboto;
}
.rating span{
  margin-left: 5px;
  font-size: 15px;
}
.ribbon-container{
  position: absolute;
  right: 0;
  height: 100%;
  top: 0;
  display: grid;
  align-content: baseline;
}
.ribbon-container .ribbon{
  padding: 5px 10px 5px 0px;
  color: white;
  position: relative;
  height: 22px;
  font-size: 11px;
  margin-right: -8px;
  margin-top: 10px;
  filter: drop-shadow(-2px 3px 2px #00000052);
  text-transform: uppercase;
  text-align: center;
  border-top-right-radius: 3px;
}
.ribbon-container .ribbon::before {
  height: 0;
  width: 0;
  right: 100%;
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 11px;
  top: 0;
}
.ribbon-container .ribbon::after {
  height: 0;
  width: 0;
  right: 0;
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 8px 8px 8px 0px;
  top: 100%;
}
.ribbon-container .ribbon.ribbon-orange{
  background: linear-gradient(to right, #ff7800, #fb4319);
}
.ribbon-container .ribbon.ribbon-orange::before {
  border-color: #ff7800 #ff7800 #ff7800 transparent;
}
.ribbon-container .ribbon.ribbon-orange::after {
  border-color: #a02d13 transparent transparent;
}
.ribbon-container .ribbon.ribbon-blue{
  background: linear-gradient(to right, #1ea0eb, #036eac);
}
.ribbon-container .ribbon.ribbon-blue::before {
  border-color: #1ea0eb #1ea0eb #1ea0eb transparent;
}
.ribbon-container .ribbon.ribbon-blue::after {
  border-color: #064274 transparent transparent;
}
</style>

<template>
  <home-store-category-tiles :storeGroups="storeGroups" @on-group-selected="(val)=>{filter.store_group = val}" :is-blocked="filterBlock"/>
  <home-product-category-tiles :productGroups="productGroupsFiltered" @on-product-group-selected="(val)=>{filter.product_groups = val}" :is-blocked="filterBlock" :storeGroup="filter.store_group"/>
  <!-- STORES ARE LOADING -->

  <ion-list lines="none">
    <ion-item :button="true" detail="false"  @click="popoverOpen = 1">
      <ion-icon :icon="swapVerticalOutline" slot="start"></ion-icon>
      <ion-label>
        <ion-text>Показывать сначала: </ion-text><br />
        <ion-note color="medium" class="ion-text-wrap">{{ sortBy.title }}</ion-note>
      </ion-label>
    </ion-item>
  </ion-list>
  <ion-popover :is-open="popoverOpen" @didDismiss="popoverOpen = false">
    <ion-content>
      <ion-list lines="none">
          <ion-item :button="true" :detail="false" v-for="(sort, sortIndex) in sorts" :key="sortIndex" @click="sortBy = sort; popoverOpen = false"  
              :color="(sort.code == sortBy.code) ? `primary` : ''">
              <ion-label>{{ sort.title }}</ion-label>
              <ion-icon v-if="sort.code == sortBy.code" :icon="checkmarkCircleOutline" slot="end"></ion-icon>
              
          </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
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
  <!-- STORE ARE NOT FOUND -->
  <div v-else-if="storeList.length==0">
    <ion-grid>
      <ion-row>
        <ion-col size-xs="12" size-sm="6">
          <img src="/img/404_store.png"/>
        </ion-col>
        <ion-col size-xs="12" size-sm="6">
          <h2>Вне зоны обслуживания</h2>
          <p style="color:#333">Поблизости к адресу <b style="color:var(--ion-color-primary)">{{ showndelivery_address??'доставки заказа' }}</b>, который вы выбрали, пока нет подходящих ресторанов и магазинов.</p>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
  <!-- STORES ARE FOUND -->
  <div v-else-if="storeListFiltered && storeListFiltered.length>0">
    <ion-list class="store-list">
      <div  v-for="(store_item, store_index) in storeListFiltered"  :key="store_item.store_id"  >
        <ion-card style="position:relative;height:fit-content" :class="store_item.is_opened==0?'closed':''">
            <div @click="$go(`/catalog/store-${store_item.store_id}`)" class="crop-to-fit" style="height: 180px;cursor:pointer">
                <img v-if="store_item.image_hash" :src="$heap.state.hostname +'image/get.php/' +store_item.image_hash +'.700.700.webp'"/>
            </div>
            <div v-if="store_perks[store_index].length > 0" class="perk-row" :style="`width:${store_perks[store_index].length*50}px`">
              <span v-for="perk in store_perks[store_index]" :key="perk.image_hash" class="perk" >
                <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'image/get.php/' +perk.image_hash +'.80.80.png'}`"/>
                <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
              </span>
            </div>
            <div class="ribbon-container">
              <div :class="`ribbon ribbon-${ribbon.color}`" v-for="(ribbon, ribbon_index) in store_item.ribbons" :key="ribbon_index" >
                <span>{{ ribbon.label }}</span>
              </div>
            </div>
          </ion-card>
          <ion-grid class="store-indicators">
            <ion-row class="ion-justify-content-between">
              <ion-col size="auto">
                <div @click="$go(`/catalog/store-${store_item.store_id}`)" style="cursor:pointer"  class="">
                  <ion-label lines="none" class="store-title" style="font-family: Roboto; font-size: 15px;">
                      <b>{{store_item.store_name}}</b>
                  </ion-label>
                </div>
              </ion-col>
              <ion-col size="auto" v-if="store_item.rating">
                <div class="rating">
                  <ion-icon :icon="star" style="font-size: 15px" color="warning"></ion-icon>
                  <span> {{ store_item.rating ?? 0 }}</span>
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
                    <label v-else-if="store_item.store_opens_tomorrow"><ion-text class="indicator-label-text" color="warning"> ◉ </ion-text><ion-text color="medium">Доставим завтра</ion-text></label>
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
    </ion-list>
  </div>
</template>

<script>
import {
  IonList,
  IonLabel,
  IonImg,
  IonChip,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonSkeletonText,
  IonText,
  IonNote,
  IonPopover,
  IonContent
}                   from "@ionic/vue";
import {  
  timeOutline, 
  searchOutline,
  star,
  swapVerticalOutline,
  checkmarkCircleOutline
 }                  from 'ionicons/icons'
 
import heap         from "@/heap";
import Utils        from '@/scripts/Utils.js'
import HomeStoreCategoryTiles     from "@/components/HomeStoreCategoryTiles";
import HomeProductCategoryTiles     from "@/components/HomeProductCategoryTiles";

export default {
  components: {
    IonLabel,
    IonList,
    IonImg,
    IonChip,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonSkeletonText,
    HomeStoreCategoryTiles,
    HomeProductCategoryTiles,
    IonText,
    IonIcon,
    IonNote,
    IonPopover,
    IonContent
  },
  setup(){
      return {
        timeOutline,
        searchOutline,
        star,
        swapVerticalOutline,
        checkmarkCircleOutline
      }
  },
  data() {
    return {
      storeList: null,
      storeListFiltered: null,
      storeGroups: [],
      productGroups: [],
      productGroupsFiltered: [],
      filter: {store_group: '1', product_groups: []},
      filterBlock: false,
      can_reload_at:0,
      loadedLocation:{},
      out:{},
      storeSuggestion:null,
      suggestFormHidden:0,
      popoverOpen: false,
      sorts: [
        {
          title: 'Быстрые',
          code: 'deliveryTime'
        },
        {
          title: 'Близкие',
          code: 'distance'
        },
        {
          title: 'С высокой оценкой',
          code: 'rating'
        }
      ],
      sortBy: {    
        title: 'Быстрые',
        code: 'deliveryTime'
      },
      customProductGroups: [
        {
          group_id: 'c1',
          group_parent: 'root',
          group_target_key: 'store_delivery_allow',
          group_target_value: '1',
          group_name: "Своя доставка",
          image_url: "/store_delivery_allow.png"
        },
        {
          group_id: 'c2',
          group_parent: 'perks',
          group_target_key: 'perk_type',
          group_target_value: 'product_top',
          group_name: "Хит продаж",
          image_url: "/product_top.png"
        },
        {
          group_id: 'c3',
          group_parent: 'perks',
          group_target_key: 'perk_type',
          group_target_value: 'product_new',
          group_name: "Новинка",
          image_url: "/product_new.png"
        }
      ]
    };
  },
  computed: {
    store_perks () {
      return this.storeListFiltered.map(function(store) {
        return store.perks.filter(perk => perk.perk_type == 'store_halal')
      });
    },
    showndelivery_address(){
      if( this.$heap.state.user.location_main.is_default!=1 ){
        return this.$heap.state.user.location_main.location_address
      }
      return this.$heap.state.user.location_current.location_address
    }
  },
  methods: {
    async listNearGet(loc) {
      try{
        const location={
          location_id:loc.location_id,
          location_latitude:loc.location_latitude,
          location_longitude:loc.location_longitude
        }
        this.$emit('isloading', true)
        let response
        response=await Utils.prePost(`${heap.state.hostname}Store/listNearGet`, location)
        response=await Utils.post(`${heap.state.hostname}Store/listNearGet`, location)
        this.storeList=this.filterSubstract(response.store_list)
        this.storeGroups=response.store_groups
        this.productGroups=this.customProductGroups.concat(response.product_groups);
        this.filterStoreList();
        this.productCategoryRecalc(this.storeListFiltered)
        this.sortStoreList()
        this.$emit('isloading', false)
      }catch{  this.$emit('isloading', false) }
    },
    filterSubstract(storeList){
      for(let i in storeList){
        storeList[i].deliveryTime=Utils.deliveryTimeCalculate(storeList[i].distance, storeList[i].store_time_preparation)
        storeList[i].ribbons=this.compileRibbons(storeList[i].perks)
        storeList[i].rating = this.compileRating(storeList[i].perks)
        storeList[i].cache_groups.product_groups = this.productGroupsPrecompose(storeList[i])
        storeList[i].store_opens_tomorrow = new Date().getHours() > storeList[i].store_time_closes && storeList[i].store_next_time_opens
      }
      return storeList
    },
    compileRibbons(perks){
      var result = []
      const ribbonConf = {
        product_top: {
          color: "orange",
          label: "Хит продаж"
        },
        product_new: {
          color: "blue",
          label: "Новинки"
        }
      }
      for(let i in perks){
        if(ribbonConf[perks[i].perk_type]){
          result.push(ribbonConf[perks[i].perk_type])
        }
      }
      return result
    },
    compileRating(perks){
        for(let i in perks) if(perks[i].perk_type == 'store_rating') return Math.round(perks[i].perk_value * 5 * 10) / 10
        return 0
    },
    filterStoreList(){
      this.storeListFiltered = this.storeList
      if(this.filter.store_group){
        this.storeListFiltered = this.storeList.filter((el) => { return el.cache_groups.store_groups.includes(this.filter.store_group) })
      }
      if(this.filter.product_groups.length > 0){
        this.storeListFiltered = this.storeListFiltered.filter((el) => { return el.cache_groups.product_groups.filter( value => this.filter.product_groups.includes(value)).length == this.filter.product_groups.length });
      } 
    },
    productGroupsPrecompose(storeItem){
      var self = this  
      for(var i in this.customProductGroups){
        if(this.customProductGroups[i].group_parent == 'root' && storeItem[this.customProductGroups[i].group_target_key] == this.customProductGroups[i].group_target_value){
          storeItem.cache_groups.product_groups.push(this.customProductGroups[i].group_id)
        }
        if(this.customProductGroups[i].group_parent == 'perks' && storeItem.perks.find((item) => {return item.perk_type == self.customProductGroups[i].group_target_value})){
          storeItem.cache_groups.product_groups.push(this.customProductGroups[i].group_id)
        }
      }
      return storeItem.cache_groups.product_groups
    },
    productCategoryRecalc(storeList){
      this.productGroupsFiltered = []
      for(var i in this.productGroups){
        for(var k in storeList){
          if(storeList[k].cache_groups.product_groups.includes(this.productGroups[i].group_id)){
            this.productGroupsFiltered.push(this.productGroups[i])
            break;
          }
        }
      }
    },
    sortStoreList(){
      var self = this
      this.storeListFiltered = this.storeListFiltered.sort( ( a, b ) => {
        if(self.sortBy.code == 'deliveryTime'){
          if ( a.deliveryTime.timeMin < b.deliveryTime.timeMin ) return -1; 
          if ( a.deliveryTime.timeMin > b.deliveryTime.timeMin ) return 1;
        }
        if(self.sortBy.code == 'distance'){
          if ( a.distance < b.distance ) return -1; 
          if ( a.distance > b.distance ) return 1;
        }
        if(self.sortBy.code == 'rating'){
          if ( a.rating > b.rating ) return -1; 
          if ( a.rating < b.rating ) return 1;
        }
        return 0;
      });
    }
  },
  mounted () {
    this.$topic.on('userMainLocationSet',loc=>this.listNearGet(loc))
    this.$topic.on('userCurrentLocationSet',loc=>this.listNearGet(loc))
    this.listNearGet(heap.state.user.location_current??heap.state.user.location_main);
  },
  watch:{
    'filter.store_group'(){
      this.filter.product_groups = []
      this.filterStoreList();
      this.productCategoryRecalc(this.storeListFiltered)
      this.sortStoreList()
    },
    'filter.product_groups'(){
      this.filterStoreList();
      this.productCategoryRecalc(this.storeListFiltered)
      this.sortStoreList()
    },
    'sortBy'(){
      this.sortStoreList()
    }
  }
};
</script>

