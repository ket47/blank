<style scoped>
.store-info {
  box-shadow: 0px 0px 15px -5px #0000005e;
  background-color: var(--ion-background);
  position: relative;
}

.groups-container ion-chip {
  border-radius: 10px;
  background-color: white;
  border: 1px solid #e6e6e6;
  font-weight: 500;
  padding: 10px 15px;
  height: 35px;
}

.groups-container ion-chip.active-chip {
  background-color: var(--ion-color-primary);
  border: none;
}

.groups-container ion-chip.active-chip ion-label {
  color: white;
}
.store-page .search-container {
  visibility: visible;
  margin: 1em 0;
  color: black;
  --border-radius: 10px;
}
.store-page .stacked-search-container {
  visibility: visible;
  padding: 0;
  color: #535151;
}
.store-page .product-list {
  margin-top: 1em;
  min-height: 80vh;
}








.store-page .product-item {
  visibility: visible;
  user-select: none;
}
.store-page .product-item ion-card-header {
  border: 1px solid transparent;
}
.store-page .product-item.product-item-selected ion-card-header {
  border: 1px solid var(--ion-color-primary);
  border-radius: 15px;
}
.store-page .product-list ion-card {
  text-align: center;
}
.store-page .product-list .link {
  text-decoration: none;
  color: var(--ion-text-main);
}
.store-page .product-list ion-card-header {
  padding: 10px 0px;
  text-align: center;
}
.store-page .product-list ion-card-content {
  padding: 10px 0px;
  text-align: center;
}









.product-list-slider{
  background-color: white;
}
.product-list-slider.swiper-container {
  min-height: 100vh;

}
.product-list-slider.swiper-container .swiper-wrapper {
  min-height: 350px;
}
.store-page .store-block .swiper-wrapper {
  max-height: 250px;
}
.group-title {
  text-align: left;
}
.group-fixed-block {
  position: fixed;
  top: 56px;
  z-index: 10000;
  width: 100%;
  background-color: white;
  box-shadow: 1px 1px 5px #00000040;
}
.group-fixed-block.hidden-block {
  display: none;
}
ion-segment {
  --background: var(--ion-background-primary-dark);
  border-radius: 0;
}
ion-segment-button {
  --color-checked: var(--ion-color-secondary);
  --indicator-color: orange;
}

ion-segment ion-label {
  color: white;
}
ion-chip .active-chip {
  background-color: var(--ion-color-secondary);
  color: white;
  border: none;
}



.desktop-main-container .group-fixed-block{
  top: 10%;
  width: calc(1366px*0.24);
  left: calc((100% - 1366px)/2);
}
.desktop-main-container .group-fixed-block ion-segment{
  display: grid;
  grid-template-columns: 100%;
  --background: white;
}
.desktop-main-container .group-fixed-block ion-segment ion-segment-button{
  width: 100%;
  display: block;
  text-align: left;
  border-bottom: 1px solid lightgray;
}
.desktop-main-container .group-fixed-block ion-segment ion-label {
  color: var(--ion-text-main);
  text-transform: capitalize;
  align-self: baseline;
}
.desktop-main-container .group-fixed-block .groups-container {
  display: none;
}

@media only screen and (max-width: 1366px) {
  .desktop-main-container .group-fixed-block{
    left: 0;
    width: 24%;
  }
}
</style>

<template>
  <base-layout pageDefaultBackLink="/catalog" page-class="store-page" :contentOnScroll="onScroll" :page-title="this.storeItem.store_name??'Магазин'">
  <div style="background-color:var(--ion-background-shade)">
    <div class="store-info">
      <image-slider :imageList="storeItem.images" :imgHeight="200"></image-slider>
        <ion-list>
        <ion-item lines="none">
          <ion-text color="primary" style="font-size:1.2em;">{{ storeItem.store_name }}</ion-text>
          <router-link slot="end" :to="'/catalog/store-edit-' + storeItem.store_id" v-if="storeItem.is_writable==1">
            <ion-icon :icon="settingsOutline" style="font-size:24px"></ion-icon>
          </router-link>
        </ion-item>
        <ion-item lines="none">
          <ion-text style="font-size:0.9em;text-align:justify" color="medium">{{storeItem.store_description}}</ion-text>
        </ion-item>
        <ion-item lines="none"></ion-item>

        <ion-item lines="none" style="font-size:0.8em">
          <ion-text>{{ storeItem.store_group_names }}</ion-text>
          <store-opened-indicator :storeItem="storeItem"/>
        </ion-item>
        <ion-item lines="none" style="font-size:0.8em">
          <ion-text>Доставит <b style="color:var(--ion-color-primary)">{{$heap.getters.settings.app_title}}</b></ion-text>
          <ion-chip slot="end" v-if="storeItem.deliveryTime" color="primary">
            {{storeItem.deliveryTime.timeMin}}-{{storeItem.deliveryTime.timeMax}}мин
          </ion-chip>
        </ion-item>
        <ion-item lines="none" style="font-size:0.8em" v-if="storeItem.deliveryTime">
          <ion-text slot="start">доставка <ion-text color="secondary">{{$heap.getters.settings.delivery.fee}}₽</ion-text></ion-text>
          <ion-text slot="end">заказ от <ion-text color="secondary">{{storeItem.store_minimal_order}}₽</ion-text></ion-text>
        </ion-item>
      </ion-list>




      <ion-accordion-group style="width:100%">
        <ion-accordion>
          <ion-item slot="header">
            <ion-label slot="end" color="medium">Еще</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none">
              <ion-text><b>{{storeItem.store_company_name}}</b></ion-text>
            </ion-item>
            <ion-item lines="none">
              <ion-label color="medium">ИНН</ion-label>
              <ion-label color="medium">{{storeItem.store_tax_num}}</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label color="medium">Телефон</ion-label>
              <ion-label color="medium">{{storeItem.store_phone}}</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-text color="medium">{{storeItem.locations?.[0].location_address}}</ion-text>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>
    </div>

    <div v-if="storeGroups" class="group-fixed-block hidden-block">
      <ion-segment v-model="groupSelectedParentId" scrollable>
        <ion-segment-button
          v-for="group_item in storeGroups"
          :key="group_item.group_id"
          :value="group_item.group_id"
          @click="groupSelectParent(group_item.group_id,1)"
          :ref="'group-tab-' + group_item.group_id"
        >
          <ion-label>{{ group_item.group_name }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div v-if="storeGroups[groupSelectedParentId]" class="groups-container">
        <ion-chip
          color="primary"
          v-show="1||storeProducts[group_item.group_id]"
          v-for="group_item in storeGroups[groupSelectedParentId].children"
          :key="group_item.group_id"
          :ref="`group-chip-${group_item.group_id}`"
          @click="groupSelectSub(group_item.group_id)"
        >
          <ion-label color="primary">{{ group_item.group_name }}</ion-label>
        </ion-chip>
      </div>
    </div>

    <ion-searchbar class="search-container" v-model="searchRequest" placeholder="Поиск в этом предприятии"
      @input="
        productListGet({
          name_query: $event.target.value,
          name_query_fields: 'product_name,product_code',
        })
      "/>

    <group-list v-if="storeGroups" :groupList="storeGroups" :onClick="(group_id) => {groupSelectParent(group_id,true) }"></group-list>

    <swiper v-if="storeGroups" pager="true" :options="slideOpts" class="product-list-slider" @slideChange="groupSliderChanged($event)">
      
      {{storeGroups}}
      <swiper-slide v-for="parent_group_item in storeGroups" :key="parent_group_item.group_id">

        <ion-grid class="product-list">
          <ion-row
            v-for="group_item in parent_group_item.children"
            :key="group_item.group_id"
            :ref="'group-' + group_item.group_id"
            :data-group_id="group_item.group_id"
          >
            <ion-col class="group-title" size="12" style="padding:25px 0px 25px 0px">
              <h4>{{ group_item.group_name }}</h4>
            </ion-col>
            <ion-col  size="12">
              <product-list :productList="storeProducts[group_item.group_id]"></product-list>
            </ion-col>
          </ion-row>
        </ion-grid>

      </swiper-slide>
    </swiper>
    
    </div>
  </base-layout>
</template>

<script>
import {
  IonText,
  IonCol,
  IonIcon,
  IonRow,
  IonGrid,
  IonLabel,
  IonSegmentButton,
  IonSegment,
  IonChip,
  IonSearchbar,
  IonAccordion,
  IonAccordionGroup,
  IonList,
  IonItem
}                         from "@ionic/vue";
import { 
  Autoplay
}                         from 'swiper';
import { 
  Swiper,
  SwiperSlide 
 }                        from 'swiper/vue';
import { 
  search,
  settingsOutline,
  rocketOutline,
  compassOutline,
}                         from "ionicons/icons";
import ImageSlider        from "@/components/ImageSlider";
import GroupList          from "@/components/GroupList.vue";
import ProductList        from '@/components/ProductList.vue';
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';
import jQuery             from "jquery";
import heap               from "@/heap";
import Utils              from "@/scripts/Utils.js";



const slideOpts = {
  slidesPerView: 1,
  pagination: false,
  centeredSlides: false,
  initialSlide: 0,
  speed: 400,
  watchSlidesProgress: false,
  grabCursor: true,
  touchStartForcePreventDefault: true,
};

export default{
  components: {
    IonText,
    IonCol,
    IonIcon,
    IonRow,
    IonGrid,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    IonChip,
    IonSearchbar,
    IonAccordion,
    IonAccordionGroup,
    IonList,
    IonItem,
    ImageSlider,
    StoreOpenedIndicator,
    Swiper,
    SwiperSlide,
    GroupList,
    ProductList
  },
  setup() {
    return {
      search,
      settingsOutline,
      rocketOutline,
      compassOutline,
      slideOpts,
      slideModules:[Autoplay]
    };
  },
  data() {
    return {
      storeId: this.$route.params.id,
      query:this.$route.query,
      searchRequest: "",
      storeItem: [],
      storeProducts: {},
      storeGroups: null,
      groupSelectedParentId: 0,
      offsetModificator: 150,
      itemGetInProgress:false
    };
  },
  methods: {
    async itemGet() {
      if(this.itemGetInProgress){
        return
      }
      try{
        this.itemGetInProgress=true
        const store=await jQuery.post(`${heap.state.hostname}Store/itemGet`, {store_id: this.storeId,distance_include:1})
        this.storeItem = this.itemPrepare(store);
        this.storeId = store.store_id;
        this.groupTreeGet({ store_id: this.storeId });
        heap.commit('setCurrentStore',this.storeItem);
        this.itemGetInProgress=false
      } catch(err){
        //console.log(err)
      }
    },
   itemPrepare(storeItem) {
      if (storeItem.member_of_groups.group_names) {
        storeItem.store_group_names = storeItem.member_of_groups.group_names;
      }
      try{
        storeItem.deliveryTime=Utils.deliveryTimeCalculate(storeItem.locations[0].distance,storeItem.store_time_preparation)
      }catch{/** */}
      return storeItem;
    },
    async productListGet(filter = {}) {
      filter.store_id = this.storeId;
      filter.is_active = 1;
      if(this.storeItem.is_writable==1){
        filter.is_disabled=1
        filter.is_deleted=1
      }
      if (filter.name_query && filter.name_query == "") {
        this.groupTreeGet({ store_id: this.storeId });
        return;
      }
      filter.limit=200;
      let response={};
      try{
        response=await jQuery.post(heap.state.hostname + "Product/listGet", filter)
      }catch(err){/** */}

      this.productListPrepare(response.product_list);
      this.groupOtherAdd()
      let self=this
      setTimeout(()=>{
        self.groupSelect();
      }, 0)
    },
    productListPrepare(product_list) {
      this.storeProducts = {};
      for (var product of product_list) {
        if (this.storeGroups){
          if (!this.storeProducts[product.group_id??0]) {
            this.storeProducts[product.group_id??0] = [];
          }
        }
        this.storeProducts[product.group_id??0].push(product);
      }
    },
    async productItemCreate(){
      try{
        const request={
          store_id:this.storeId,
          product_name:"Новый товар",
          product_price:1000,
          product_promo_price:1000
        }
        const product_id=await jQuery.post(`${heap.state.hostname}Product/itemCreate`,request)
        this.$router.push(`product-edit-${product_id}`)
        this.$flash("Добавлен 'Новый товар' в категорию 'Другое'")
      }catch{
        this.$flash("Не удалось создать товар")
      }
    },




    async groupTreeGet(filter) {
      try{
        this.storeGroups=await jQuery.get(`${heap.state.hostname}Product/groupTreeGet`, {store_id: filter.store_id})
        this.productListGet();
      }catch(err){/** */}
    },
    groupOtherAdd(){
      if(this.storeProducts[0]){
        this.storeGroups[0]={
          group_id:'other',
          group_name:"Другое",
          image_hash:"",
          children:{
            '0':{
              group_id:0,
              group_name:"другое",
              group_parent_id:0,
              group_path:"",
              image_hash:""
            }
          }
        }
      }
    },
    groupSelect(){
      let parent_group_id=this.query.parent_group_id
      let sub_group_id=this.query.sub_group_id
      if( sub_group_id ){
        parentloop:for(let parent in this.storeGroups){
          for(let sub in this.storeGroups[parent].children){
            if(sub==sub_group_id){
              parent_group_id=parent
              break parentloop
            }
          }
        }
      }
      if( !parent_group_id ){
        parent_group_id = Object.keys(this.storeGroups)[0]
      }
      
      const selectFirstChip=false;//sub_group_id?false:true
      this.groupSelectParent(parent_group_id,selectFirstChip)
      if(sub_group_id){
        const self=this
        setTimeout(()=>{
          self.groupSelectSub(sub_group_id)
        },0)
      }
    },
    groupSelectParent(parent_group_id,selectFirstChip=false){
      if(this.groupSelectedParentId == parent_group_id){
        return
      }
      this.groupSelectedParentId = parent_group_id;
      const swiper = document.querySelector('.product-list-slider').swiper;
      const slide_index = Object.keys(this.storeGroups).indexOf(this.groupSelectedParentId);
      swiper.slideTo(slide_index,100,false);

      try{
        if(selectFirstChip){
          const first_sub_group_id=Object.keys(this.storeGroups[parent_group_id].children)[0];
          const self=this
          setTimeout(()=>{
            self.groupSelectSub(first_sub_group_id)
          },0)
        }
      } catch(err){/** */}
      
    },
    groupSelectSub(sub_group_id){
      if(this.groupSelectedSubId == sub_group_id){
        //return
      }

      this.groupSelectedSubId = sub_group_id
      document.querySelectorAll(".groups-container ion-chip").forEach(chip=>{
        chip.classList.remove("active-chip");
      });
      try{
        this.$refs[`group-chip-${sub_group_id}`][0].$el.classList.add("active-chip");
      }catch(err){ 
        /** */
      }
      this.scrollTo(sub_group_id);
    },
    groupSliderChanged(event) {
      const slideIndex=event.activeIndex
      const parent_groud_id = Object.keys(this.storeGroups)[slideIndex];
      //const sub_group_id =  Object.keys(this.storeGroups[parent_groud_id].children)[0];
      this.groupSelectParent(parent_groud_id,1);
      //this.groupSelectSub(sub_group_id);
    },




    scrollTo(sub_group_id) {
      if (!this.$refs["group-" + sub_group_id]?.[0] ) {
        return;
      }
      const offset=document.querySelector("ion-content.store-page").shadowRoot.querySelector("main").scrollTop;
      const anchor=this.$refs["group-" + sub_group_id][0].$el.getBoundingClientRect().top;
      var elementPosition = offset + anchor - this.offsetModificator - (window.innerHeight/4);
      var first_group_id = Object.keys(this.storeGroups[this.groupSelectedParentId].children)[0];
      if(first_group_id == sub_group_id){
        elementPosition = offset+anchor - this.offsetModificator;
      }
      document
        .querySelector("ion-content.store-page")
        .shadowRoot.querySelector("main")
        .scrollTo({ top: elementPosition, behavior: "smooth" });
    },
    
    onScroll(event) {
      const offsetTop=document.querySelector(".product-list-slider")?.offsetTop;
      const offsetHeight=document.querySelector(".group-fixed-block")?.offsetHeight;
      if (offsetTop - offsetHeight - 100 < event.detail.scrollTop ) {
        document.querySelector(".group-fixed-block") && (document.querySelector(".group-fixed-block").className = "group-fixed-block");
      } else {
        document.querySelector(".group-fixed-block") && (document.querySelector(".group-fixed-block").className = "group-fixed-block hidden-block");
      }
      var productGroupElementList = document.querySelectorAll(".swiper-slide-active .product-list ion-row");
      for (var row of productGroupElementList) {
        if (
          row.getBoundingClientRect().top - this.offsetModificator <= (window.innerHeight - window.innerHeight/4) &&
          row.getBoundingClientRect().bottom + this.offsetModificator >= (window.innerHeight - window.innerHeight/4) &&
          row.dataset.group_id
        ) {
          break;
        }
      }
    },
  },
  ionViewDidEnter() {
    this.query = this.$route.query;
    this.itemGet();
  },
  ionViewDidLeave(){
    this.storeItem=[];
  },
  watch: {
    $route(currentRoute) {
      this.storeId = currentRoute.params.id;
    },
  },
}
</script>