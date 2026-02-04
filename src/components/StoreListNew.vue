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
  margin: 15px 10px 5px;
}
ion-card .store-title{
  --min-height: auto;
  padding-top: 10px;
}
.closed img{
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
.perk-row ion-img{
  filter: drop-shadow(0px 1px 2px #000);
  width: 40px;
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
  pointer-events: none;
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
  min-width: 90px;
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
.ribbon-container .ribbon.ribbon-purple{
  background: linear-gradient(to right, #eb1e5c, #a0123c);
}
.ribbon-container .ribbon.ribbon-purple::before {
  border-color: #eb1e5c #eb1e5c #eb1e5c transparent;
}
.ribbon-container .ribbon.ribbon-purple::after {
  border-color: #740c2b transparent transparent;
}
.bottom-ribbon-chip-container{
  position: absolute;
  bottom: 8px;
  left: 0px;
  z-index: 100;
}
.bottom-ribbon-chip-container > div{
  width: fit-content;
  margin: 5px 0;
}
.bottom-ribbon-chip{
  border-top-right-radius: 50px; 
  border-bottom-right-radius: 50px;
  background: linear-gradient(to right, #1bb046, #25ca7d);
  display: flex;
  align-items: center;
  padding: 4px;
  box-shadow: 1px 3px 2px #00000096;
}
.bottom-ribbon-chip ion-label{
  font-size: 12px; 
  color: white;
  margin-left: 5px;
  text-shadow: 0px 1px 2px black;
}
.bottom-ribbon-chip .avatar{
  margin-left: 5px;
  border-radius: 100%;
  background: #0f4b68a8;
  padding: 3px;
  box-shadow: inset 0px 2px 3px #00000087;
}

.bottom-ribbon-chip .avatar ion-img{
  width: 16px;
  filter: brightness(1);
  animation: blinkCrystal 0.5s cubic-bezier(.95,.05,.8,.04)  infinite alternate;
}
.bottom-ribbon-chip.challenge-chip{
  background: linear-gradient(to right, #ff4f0a, #ffb403);
}
.bottom-ribbon-chip.challenge-chip .avatar{
  background: #684c0fa8;
}
.suggest-card ion-card{
  background:  var(--ion-color-light);
  border-radius: 15px;
  color: #909090;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  text-align: center;
}
.suggest-card .add-icon{
  font-size: 50px;
}
@keyframes blinkCrystal {
    0%{
        filter: brightness(1);
    }
    100%{
        filter: brightness(2);
    }
}

</style>

<template>
  <home-store-category-tiles :storeGroups="storeGroups" @on-group-selected="(val)=>{filter.store_group = val}"/>
  <home-product-category-tiles :productGroups="productGroupsFiltered" @on-product-group-selected="(val)=>{filter.product_groups = val}" :storeGroup="filter.store_group"/>
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
  <div v-else-if="storeListRendered && storeListRendered.length>0">
    <ion-list class="store-list">
      <div  v-for="(store_item, store_index) in storeListRendered"  :key="store_item.store_id"  >
        <div v-if="!store_item.not_found">
        <ion-card style="position:relative;height:fit-content" :class="store_item.is_opened==0?'closed':''">
            <div @click="$go(`/catalog/store-${store_item.store_id}`)" class="crop-to-fit" style="height: 180px;cursor:pointer">
                <img v-if="store_item.image_hash" :src="$heap.state.hostname +'image/get.php/' +store_item.image_hash +'.700.700.webp'"/>
            </div>

            <div v-if="store_perks[store_index].length > 0" class="perk-row">
              <span v-for="perk in store_perks[store_index]" :key="perk.image_hash" class="perk" >
                <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'image/get.php/' +perk.image_hash +'.80.80.png'}`" style="margin: 10px;"/>
                <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
              </span>
            </div>
            <div class="bottom-ribbon-chip-container">
              <div v-if="store_challenge[store_index]" >
                  <div class="bottom-ribbon-chip challenge-chip">
                      <ion-label><b>Розыгрыш</b></ion-label>
                      <span class="avatar">
                        <ion-img width="25px;" src="/img/crown.png"/>
                      </span>
                  </div>
              </div>
              <div v-if="store_crystal[store_index]">
                  <div class="bottom-ribbon-chip">
                      <ion-label><b>Бонусы</b></ion-label>
                      <span class="avatar">
                        <ion-img width="25px;" src="/img/crystal.png"/>
                      </span>
                  </div>
              </div>
            </div>
            <div class="ribbon-container">
              <div :class="`ribbon ribbon-${ribbon.color}`" v-for="(ribbon, ribbon_index) in store_item.ribbons" :key="ribbon_index" >
                <span>{{ ribbon.label }}</span>
              </div>
            </div>
          </ion-card>
          <ion-grid class="store-indicators">
            <ion-row class="ion-justify-content-between">
              <ion-col size="9">
                <div @click="$go(`/catalog/store-${store_item.store_id}`)" style="cursor:pointer"  class="">
                  <ion-label lines="none" class="store-title " style=" font-size: 15px;">
                      <b>{{store_item.store_name}}</b>
                  </ion-label>
                </div>
              </ion-col>
              <ion-col size="3" v-if="store_item.rating">
                <div class="rating" style="text-align: right;">
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
                    <label v-if="store_item.is_working==0"><ion-text class="indicator-label-text"> ◉ </ion-text><ion-text color="medium">не работает</ion-text></label>
                    <label v-else-if="store_item.store_opens_tomorrow"><ion-text class="indicator-label-text" color="warning"> ◉ </ion-text><ion-text color="medium">Доставим завтра</ion-text></label>
                    <label v-else-if="store_item.store_next_time_opens>0"><ion-text class="indicator-label-text"> ◉ </ion-text><ion-text color="medium">закрыт до {{ store_item.store_next_time_opens }}:00</ion-text></label>
                    <label v-else><ion-text color="danger"> ◉ </ion-text><ion-text class="indicator-label-text">закрыт</ion-text></label>
                </div>
              </ion-col>
              <ion-col size="auto"  class="indicator-label">
                <div v-if="store_item.deliveryTime.timeMin && store_item.is_opened==1" lines="none">
                  <ion-text class="indicator-label-text">{{store_item.deliveryTime.timeMin}}-{{store_item.deliveryTime.timeMax}}мин</ion-text>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div v-else class="suggest-card" >
          <div v-if="suggestFormState === 0">
            <ion-card style="position:relative;" @click="suggestFormState = 1">
              <div class="add-icon">+</div>
            </ion-card>
            <ion-grid class="store-indicators">
              <ion-row class="ion-justify-content-between"> 
                <ion-col size="12">
                  <div style="cursor:pointer"  class="">
                    <ion-label lines="none" class="store-title " style=" font-size: 15px;">
                        <b>Не нашли то, что искали?</b>
                    </ion-label>
                  </div>
                </ion-col>
                <ion-col size="12">
                  <label  style="font-size: 12px"><ion-text color="medium">Что вы хотите здесь увидеть?</ion-text></label>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
          <div v-else-if="suggestFormState === 1">
            <ion-card style="position:relative;">
              <div>
                <ion-input v-model="storeSuggestion" label="" helperText="Маркет, магазин, кафе, ресторан, аптека" placeholder="ваше предложение"/>
                <ion-button color="primary" @click="suggestFormSend()" >отправить</ion-button>
              </div>
            </ion-card>
            <ion-grid class="store-indicators">
              <ion-row class="ion-justify-content-between"> 
                <ion-col size="12">
                  <div style="cursor:pointer"  class="">
                    <ion-label lines="none" class="store-title " style=" font-size: 15px;">
                        <b>Введите название</b>
                    </ion-label>
                  </div>
                </ion-col>
                <ion-col size="12">
                  <label  style="font-size: 12px"><ion-text color="medium">И оно обязательно появится</ion-text></label>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
          <div v-else>
            <ion-card style="position:relative;">
              <div>
                <h4>Спасибо за Ваше предложение</h4>
              </div>
            </ion-card>
            <ion-grid class="store-indicators">
              <ion-row class="ion-justify-content-between"> 
                <ion-col size="12">
                  <div style="cursor:pointer"  class="">
                    <ion-label lines="none" class="store-title " style=" font-size: 15px;">
                        <b>Мы исправимся</b>
                    </ion-label>
                  </div>
                </ion-col>
                <ion-col size="12">
                  <label  style="font-size: 12px"><ion-text color="medium">С учётом Ваших пожеланий</ion-text></label>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
        </div>
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
  IonButton,
  IonSkeletonText,
  IonText,
  IonNote,
  IonPopover,
  IonContent,
  IonInput
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
    IonButton,
    IonCard,
    IonSkeletonText,
    HomeStoreCategoryTiles,
    HomeProductCategoryTiles,
    IonText,
    IonIcon,
    IonNote,
    IonPopover,
    IonInput,
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
      loadedLocation:{},
      storeSuggestion: "",
      suggestFormState: 0,
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
        title: 'Близкие',
        code: 'distance'
      },
      customProductGroups: [
        {
          group_id: 'c1',
          group_parent: 'root',
          group_target_key: 'store_delivery_allow',
          group_target_value: '1',
          group_name: "Доставка продавца",
          image_url: "store_delivery_allow.png"
        },
        {
          group_id: 'c2',
          group_parent: 'perks',
          group_target_key: 'perk_type',
          group_target_value: 'product_top',
          group_name: "Хит продаж",
          image_url: "product_top.png"
        },
        {
          group_id: 'c3',
          group_parent: 'perks',
          group_target_key: 'perk_type',
          group_target_value: 'product_new',
          group_name: "Новинка",
          image_url: "product_new.png"
        },
        {
          group_id: 'c4',
          group_parent: 'perks',
          group_target_key: 'perk_type',
          group_target_value: 'product_promo',
          group_name: "Акция",
          image_url: "promo.png"
        }
      ]
    };
  },
  computed: {
    store_perks () {
      return this.storeListFiltered.map(function(store) {
        return (store.perks) ? store.perks.filter(perk =>['store_halal'].includes(perk.perk_type)) : false
      });
    },
    store_crystal () {
      return this.storeListFiltered.map(function(store) {
        return (store.perks) ? store.perks.find(perk => perk.perk_type ==  'cashback') : false
      });
    },
    store_challenge () {
      return this.storeListFiltered.map(function(store) {
        return (store.perks) ? store.perks.find(perk => perk.perk_type ==  'store_challenge') : false
      });
    },
    showndelivery_address(){
      if( this.$heap.state.user.location_main?.is_default!=1 ){
        return this.$heap.state.user.location_main?.location_address
      }
      return this.$heap.state.user.location_current?.location_address
    },
    storeListRendered(){
      var result = this.storeListFiltered
      result.push({not_found: true})
      return result
    }
  },
  methods: {
    async listNearGet(loc) {
      if( !loc ){
        return
      }
      try{
        const location={
          location_id:loc?.location_id,
          location_latitude:loc?.location_latitude,
          location_longitude:loc?.location_longitude
        }
        this.$emit('isloading', true)
        let response
        response=await Utils.prePost(`${this.$heap.state.hostname}Store/listNearGet`, location)
        if(response && response?.store_list?.length>0 ){
          this.render(response)
        }
        response=await Utils.post(`${this.$heap.state.hostname}Store/listNearGet`, location)
        this.render(response)
        this.$emit('isloading', false)
      }catch(err){
        this.$emit('isloading', false)
        this.storeList=[]//if not found
        console.log(err)
      }
    },
    render(response){
      this.storeList=this.filterSubstract(response.store_list)
      this.storeGroups=this.storeGroupsPrecompose(response.store_groups||[])
      this.productGroups=this.customProductGroups.concat(response.product_groups);
      this.filterStoreList();
      this.productCategoryRecalc(this.storeListFiltered)
      this.sortStoreList()
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
          label: "Новинка"
        },
        product_promo: {
          color: "purple",
          label: "Акция"
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
        this.storeListFiltered = this.storeList.filter((el) => { return el.cache_groups?.store_groups.includes(this.filter.store_group) })
      }
      if(this.filter.product_groups.length > 0){
        this.storeListFiltered = this.storeListFiltered.filter((el) => { return el.cache_groups.product_groups.filter( value => this.filter.product_groups.includes(value)).length == this.filter.product_groups.length });
      } 
    },
    storeGroupsPrecompose(storeGroups){
      for(var i in storeGroups){
        storeGroups[i].store_count = this.storeList.filter((el) => { return el.cache_groups.store_groups.includes(storeGroups[i].group_id)})
      }
      return storeGroups.sort( ( a, b ) => {
        if ( a.store_count > b.store_count ) return -1; 
        if ( a.store_count < b.store_count ) return 1;
      });
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
      if( !this.storeListFiltered ){
        return false
      }
      this.storeListFiltered
      .sort( ( a, b ) => {
        if(self.sortBy.code == 'deliveryTime'){
          if ( a.deliveryTime.timeMin < b.deliveryTime?.timeMin ) return -1; 
          if ( a.deliveryTime.timeMin > b.deliveryTime?.timeMin ) return 1;
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
      })
      .sort( ( a, b ) => {
        if(a.is_opened < b.is_opened )return 1
        if(a.is_opened > b.is_opened )return -1
        return 0
      })
    },
    openModal(){
      this.$refs.modal.$el.present()
    },
    closeModal(){
      this.$refs.modal.$el.dismiss()
    },
    async suggestFormSend(){
      if(!this.storeSuggestion){
        this.$flash("Напишите что нам стоило бы добавить")
        return 
      }
      try{
        const request={
          type:'suggest_new_store',
          user_id:this.$heap.state.user?.user_id,
          from:this.$heap.state.user?.user_phone,
          subject:this.showndelivery_address,
          body:this.storeSuggestion
        }
        await Utils.post(`${this.$heap.state.hostname}Talk/inquiryCreate`, request)
        this.suggestFormState = 2
        this.$flash("Ваше предложение отправлено")
      }catch{/** */}
    },
  },
  mounted () {
    this.$topic.on('userMainLocationSet',loc=>this.listNearGet(loc))
    this.$topic.on('userCurrentLocationSet',loc=>this.listNearGet(loc))
    this.listNearGet(this.$heap.state.user.location_current??this.$heap.state.user.location_main);
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
    },
    '$route.path'(to,from){
      if(to=='/catalog'){
        this.listNearGet(this.$heap.state.user.location_current??this.$heap.state.user.location_main);
      }
    }
  }
};
</script>

