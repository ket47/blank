<style scoped>

.avatar-container{
  width: 100px;
}
.avatar{
  position: absolute;
  width: 100px;
  height: 100px;
  bottom: 0px;
  border-radius: 100%;
  overflow: hidden;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.avatar img{
  pointer-events: none;
}

@media only screen and (max-width: 740px) {
  .avatar-container{
    width: 80px;
  }
  .avatar{
    width: 80px;
    height: 80px;
  }
}
@media only screen and (max-width: 370px) {
  .avatar-container{
    width: 50px;
  }
  .avatar{
    width: 50px;
    height: 50px;
  }
}
.store-info {
  margin-top: -20px;
  position: relative;
  z-index: 100;
  border-top-left-radius: var(--ion-border-radius, 15px);
  border-top-right-radius: var(--ion-border-radius, 15px);
  padding-top: 20px;
  contain: initial;
}
.store-info ion-item{
  overflow: visible;
}
ion-accordion-group .accordion-collapsed .store-description,
ion-accordion-group .accordion-collapsing .store-description{
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  position: relative;
  transition: all 300ms cubic-bezier(0.25, 0.8, 0.5, 1) 0s;
  line-height: 1.4;
}
ion-accordion-group .accordion-expanded .store-description,
ion-accordion-group .accordion-expanding .store-description{
  display: inline-block;
  line-height: 1.4;
}


.delivery-variant{
  background: var(--ion-color-success);
  padding: 0;
  border-radius: 10px;
  margin: 8px 16px;
  font-size: 14px;
  display: grid;
  grid-template-columns: auto 50px;
  min-width:250px;
  height: 55px;
  color:white;
}
.delivery-variant div{
  padding: 10px;
}
.delivery-variant div:last-of-type{
  background: var(--ion-color-success-shade);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  align-items: center;
  font-size: 18px;
}





/* .delivery-variant-slider .swiper-slide{
  width: 300px;
} 
.delivery-variant{
  background: var(--ion-color-success-shade);
  padding: 0;
  border-radius: 10px;
  margin: 8px 16px;
  font-size: 14px;
}
.delivery-variant ion-row{
  display: grid;
  grid-template-columns: 65% 35%;
  min-height: 50px;
}
.delivery-variant .delivery-variant-description{
  background: var(--ion-color-success);
  padding: 10px;
  border-radius: 10px 0 0 10px;
  color: white;
  height: 100%;
}
.delivery-variant .delivery-variant-description label{ 
  display: block; 
  margin-bottom: 5px;
}
.delivery-variant .delivery-variant-cost{
  padding: 10px;
  color: white;
  font-size: 18px;
} */






.groups-container{
  border-bottom: 1px solid lightgray;
  display: block ruby;
}
.groups-container ion-segment-button {
  font-weight: bold;
  margin: 0 5px;
  text-transform: initial;
  min-height: 35px;
}

.sub-groups-container {
  display: block ruby;
}
.sub-groups-container span ion-label {
  margin: 0;
}
.sub-groups-container span.segment-button-checked ion-label {
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
  border-bottom: 2px solid var(--ion-color-secondary);
  margin-bottom: 1em;
  width: 80% !important;
}
.group-fixed-block {
  position: fixed;
  top: 56px;
  z-index: 10000;
  width: 100vw;
  background-color: white;
  border-bottom: 1px solid lightgray;
}
.group-fixed-block.hidden-block {
  display: none;
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
.desktop-main-container .group-fixed-block ion-segment span{
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
.desktop-main-container .group-fixed-block .sub-groups-container {
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
  <div>
    <div class="store-info-container">
      <image-slider-comp :imageList="storeItem.images" :imgHeight="300" :mode="'crop-to-fit'"></image-slider-comp>
      <ion-list  class="store-info">
        <ion-item lines="none">
          <div v-if="storeItem.avatarImage" slot="start" class="avatar-container">
            <div class="avatar">
              <img :src="$heap.state.hostname+'image/get.php/'+storeItem.avatarImage+'.200.200.webp'" />
            </div>
          </div>
          <ion-text style="font-size:1.2em;"><b>{{ storeItem.store_name }}</b></ion-text>
          <ion-icon slot="end" color="primary" @click="$router.push(`/catalog/store-edit-${storeItem.store_id}`)" :icon="settingsOutline" style="font-size:24px"></ion-icon>
        </ion-item>
        <ion-accordion-group style="width:100%">
          <ion-accordion>
            <ion-item  slot="header" lines="none">
              <ion-text v-if="storeItem.store_description" class="store-description" color="medium">{{storeItem.store_description}}</ion-text>
              <ion-text v-else color="medium">подробнее</ion-text>
            </ion-item>
            <ion-list slot="content">
              <ion-item lines="none" v-if="storeItem.store_company_name">
                <ion-text><b>{{storeItem.store_company_name}}</b></ion-text>
              </ion-item>
              <ion-item lines="none" v-if="storeItem.store_tax_num">
                <ion-label color="medium">ИНН</ion-label>
                <ion-text color="dark">{{storeItem.store_tax_num}}</ion-text>
              </ion-item>
              <ion-item lines="none" v-if="storeItem.store_phone">
                <ion-label color="medium">Телефон</ion-label>
                <ion-text color="dark">{{storeItem.store_phone}}</ion-text>
              </ion-item>
              <ion-item lines="none" v-if="storeItem.locations">
                <ion-text color="dark">{{storeItem.locations?.[0].location_address}}</ion-text>
              </ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
        <ion-grid>
          <ion-row class="ion-justify-content-between">
            <ion-col size="auto">
              <store-opened-indicator :storeItem="storeItem"/>
            </ion-col>
            <ion-col size="auto">
              <ion-chip v-if="storeItem.store_group_names" color="medium"  background="transparent">
                <label>{{ storeItem.store_group_names }}</label>
              </ion-chip>
            </ion-col>
          </ion-row>
          <!-- <ion-row>
            <ion-col size="auto" style="overflow-y: scroll;white-space: nowrap;">

              <ion-chip color="medium">
                <ion-icon color="primary" :src="`/img/icons/favicon.svg`"/>
                Доставит {{$heap.getters.settings.app_title}} 
                <span v-if="storeItem?.deliveryTime?.timeMin">&nbsp;за {{storeItem.deliveryTime.timeMin}}-{{storeItem.deliveryTime.timeMax}}мин</span>&nbsp;
                <ion-badge>90₽</ion-badge>
              </ion-chip>

              <ion-chip color="medium" v-if="storeItem.store_delivery_allow">
                Доставит {{storeItem.member_of_groups.group_names}}&nbsp;
                <ion-badge>{{storeItem.store_delivery_cost}}₽</ion-badge>
              </ion-chip>

              <ion-chip color="medium" v-if="storeItem.store_pickup_allow">
                Самовывоз&nbsp;
                <ion-badge>0₽</ion-badge>
              </ion-chip>

            </ion-col>
          </ion-row>-->
        </ion-grid> 
      </ion-list>

        <div style="scrollbar-width: none; overflow-x: scroll;display: flex;">
          <div class="delivery-variant">
            <div>
                <ion-label>Доставит {{$heap.getters.settings.app_title}}</ion-label><br/>
                <ion-text v-if="storeItem?.deliveryTime?.timeMin">{{storeItem.deliveryTime.timeMin}}-{{storeItem.deliveryTime.timeMax}}мин</ion-text>
            </div>
            <div>
              <ion-text v-if="storeItem.delivery_cost > 0"><b>{{storeItem.delivery_cost}}₽</b></ion-text>
            </div>
          </div>
          <div class="delivery-variant" v-if="storeItem.store_delivery_allow">
            <div>
              <ion-label>Доставит {{storeItem.member_of_groups.group_names}}</ion-label><br/>
            </div>
            <div>
              <ion-text v-if="storeItem.delivery_cost > 0"><b>{{storeItem.store_delivery_cost}}₽</b></ion-text>
            </div>
          </div>
          <div class="delivery-variant" v-if="storeItem.store_pickup_allow">
            <div>
              <ion-label>Самовывоз</ion-label><br/>
            </div>
            <div>
              <ion-text><b>0₽</b></ion-text>
            </div>
          </div>
        </div>
    </div>

    <div v-if="storeGroups" class="group-fixed-block hidden-block">
      <ion-segment v-model="groupSelectedParentId" scrollable  class="groups-container">
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
      <ion-segment color="light"   v-if="storeGroups[groupSelectedParentId]" scrollable class="sub-groups-container">
        <span
          v-show="storeProducts[group_item.group_id]"
          v-for="group_item in storeGroups[groupSelectedParentId].children"
          :key="group_item.group_id"
          :ref="`group-chip-${group_item.group_id}`"
          @click="groupSelectSub(group_item.group_id)"
        >
          <ion-chip :outline="true" color="primary">{{group_item.group_name}}</ion-chip>

        </span>
      </ion-segment>
    </div>

    <ion-searchbar class="search-container" v-model="searchRequest" placeholder="Поиск у этого продавца"
      @input="
        productListGet({
          name_query: $event.target.value,
          name_query_fields: 'product_name,product_code',
        })
      "/>

    <h4 style="margin: 8px 16px;"><b>Категории</b></h4>
    <group-list v-if="storeGroups" :groupList="storeGroups" :onClick="(group_id) => {groupSelectParent(group_id,true) }"></group-list>

    <h4 style="margin: 8px 16px;"><b>Товары</b></h4>
    <swiper v-if="storeGroups" 
      pager="true" 
      :initialSlide="0"
      :speed="400"
      :watchSlidesProgress="false"
      :grabCursor="true"
      :touchStartForcePreventDefault="true"
      :slidesPerView="1.1"
      :pagination="false"
      :centeredSlides="false" 
      class="product-list-slider" 
      @slideChange="groupSliderChanged($event)" 
      :style="`max-height: ${sliderMaxHeight}`"
    >
      {{storeGroups}}
      <swiper-slide v-for="parent_group_item in storeGroups" :key="parent_group_item.group_id">
        <ion-grid class="product-list">
          <ion-row
            v-for="group_item in parent_group_item.children"
            :key="group_item.group_id"
            :ref="'group-' + group_item.group_id"
            :data-group_id="group_item.group_id"
          >
            <ion-col class="group-title" size="12">
              <h5 style="margin: 0;">
                {{ group_item.group_name }} 
                <ion-chip v-if="storeItem.is_writable==1" @click="productItemCreate(group_item.group_id)">
                  <ion-icon :src="addOutline"/>добавить
                </ion-chip>
              </h5>
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
  IonItem,
  IonBadge,
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
  addOutline,
}                         from "ionicons/icons";
import ImageSliderComp    from "@/components/ImageSliderComp";
import GroupList          from "@/components/GroupList.vue";
import ProductList        from '@/components/ProductList.vue';
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';
import jQuery             from "jquery";
import heap               from "@/heap";
import Utils              from "@/scripts/Utils.js";


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
    IonBadge,
    ImageSliderComp,
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
      addOutline,
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
      groupSelectedParentId: -1,
      sliderMaxHeight: 500,
      offsetModificator: 150,
      can_reload_at:0
    };
  },
  methods: {
    async itemGet() {
      const now=Date.now()
      if(this.can_reload_at>now){
        return
      }
      this.can_reload_at=now+10000
      try{
        const store=await jQuery.post(`${heap.state.hostname}Store/itemGet`, {store_id: this.storeId,distance_include:1})
        this.storeItem = this.itemPrepare(store); 
        this.storeId = store.store_id;
        this.groupTreeGet({ store_id: this.storeId });
        heap.commit('setCurrentStore',this.storeItem);
      } catch(err){
        const exception_code=err?.responseJSON?.messages?.error;
        switch(exception_code){
            case 'notfound':
                this.$flash("Продавец не найден")
                this.$router.push("/catalog")
                break;
        }
        return false
      }
   },
   itemPrepare(storeItem) {
      if (storeItem.member_of_groups.group_names) {
        storeItem.store_group_names = storeItem.member_of_groups.group_names;
      }
      storeItem.deliveryTime={};
      if(storeItem.locations[0]?.distance){
        storeItem.deliveryTime=Utils.deliveryTimeCalculate(storeItem.locations[0].distance,storeItem.store_time_preparation)
      }
      storeItem.avatarImage = '';
      if (storeItem.avatar.length > 0) {
        storeItem.avatarImage = storeItem.avatar[0].image_hash;
      }
      return storeItem;
    },
    async productListGet(filter = {}) {
      filter.store_id = this.storeId;
      filter.is_active = 1;
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
    async productItemCreate( group_id ){
      try{
        const request={
          store_id:this.storeId,
          product_name:"Новый товар",
          product_price:1000,
          product_promo_price:1000
        }
        const product_id=await jQuery.post(`${heap.state.hostname}Product/itemCreate`,request)
        if(group_id){
          await jQuery.post(`${heap.state.hostname}Product/itemUpdateGroup`,{product_id,group_id,is_joined:1})
        }
        this.$router.push(`/catalog/product-edit-${product_id}`)
        this.$flash("Добавлен 'Новый товар'")
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
      if(this.groupSelectedParentId == parent_group_id || !document.querySelector('.product-list-slider')){
        return
      }
      this.groupSelectedParentId = parent_group_id;
      const swiper = document.querySelector('.product-list-slider').swiper;
      const slide_index = Object.keys(this.storeGroups).indexOf(this.groupSelectedParentId);
      swiper.slideTo(slide_index,100,false);
      // try{
      //   if(selectFirstChip){
      //     const first_sub_group_id=Object.keys(this.storeGroups[parent_group_id].children)[0];
      //     const self=this
      //     setTimeout(()=>{
      //       self.groupSelectSub(first_sub_group_id)
      //     },0)
      //   }
      // } catch(err){/** */}
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
      var first_group_id = Object.keys(this.storeGroups[this.groupSelectedParentId]?.children)[0] || 0;
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
  mounted(){
    this.query = this.$route.query;
    this.itemGet();
  },
  // ionViewDidEnter() {//unnecessary  loadings when return from productView
  //   this.query = this.$route.query;
  //   this.itemGet();
  // },
  // ionViewDidLeave(){
  //   this.storeItem=[];
  // },
  watch: {
    $route(currentRoute) {
      this.storeId = currentRoute.params.id;
    },
    groupSelectedParentId(){
      try{
        this.sliderMaxHeight = document.querySelector('.product-list-slider.swiper').style.maxHeight = document.querySelector('.product-list-slider .swiper-slide.swiper-slide-active').scrollHeight+'px'
      }catch{
        this.sliderMaxHeight = 1000
      }
    }
  },
}
</script>