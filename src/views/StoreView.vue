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
  <base-layout
    page-default-back-link="/home"
    page-class="store-page"
    :contentOnScroll="onScroll"
    :page-title="pageTitle"
  >
  <div style="background-color:var(--ion-background-shade)">
    <div class="store-info">
      <image-slider :imageList="storeItem.images" :imgHeight="400"></image-slider>
      <ion-grid style="margin:15px 5px 5px 5px;"> 
        <ion-row>
          <ion-col>
            <ion-text color="primary" style="font-size:20px">{{ storeItem.store_name }}</ion-text>
          </ion-col>
          <ion-col style="text-align:right">
            <router-link :to="'/store-edit-' + storeItem.store_id" v-if="storeItem.is_writable==1">
              <ion-icon :icon="settingsOutline" style="font-size:24px"></ion-icon>
            </router-link>
          </ion-col>
        </ion-row>
        <ion-row v-if="storeItem.is_writable==1">
          <ion-col>
          <ion-button @click="productItemCreate()" color="light" expand="full">Добавить товар</ion-button>
          </ion-col>
        </ion-row> 
        <ion-row style="font-size:12px">
          <ion-col>
            {{ storeItem.store_group_names }}
          </ion-col>
          <ion-col v-show="storeItem.willBeClosedAt" style="text-align:right">
            закроется в {{ storeItem.willBeClosedAt }}:00
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-note>{{storeItem.store_description}}</ion-note>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <div style="border-bottom:1px solid var(--ion-color-primary-tint)"></div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col style="font-size:12px">
            <div style="display:grid;grid-template-columns:30px 1fr;gap:5px">
              <div style="grid-row:1 / 2;align-items: flex-start;">
                <ion-icon src="./assets/icon/box-delivery.svg" style="font-size:26px;color:var(--ion-color-primary)"></ion-icon> 
              </div>
              <div style="grid-column:2 / span 3;display: flex;align-items: center;">
                <span> Доставит <b style="color:var(--ion-color-primary)">{{$heap.state.app_title}}</b></span>
              </div>
            </div>
            <div style="display:flex; justify-content: space-between;">
              <div v-if="storeItem.delivery" style="text-align:left">
                {{storeItem.delivery.timeMin}}-{{storeItem.delivery.timeMax}} мин
              </div>
              <div>доставка {{$heap.state.deliverySettings.fee}}₽</div>
              <div v-if="storeItem.store_minimal_order" style="text-align:right">
                заказ от {{storeItem.store_minimal_order}}₽
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>




    <div v-if="storeGroups" class="group-fixed-block hidden-block">
      <ion-segment v-model="activeParentGroupId" scrollable>
        <ion-segment-button
          v-for="group_item in storeGroups"
          :key="group_item.group_id"
          :value="group_item.group_id"
          @click="setActiveParentGroup(group_item.group_id)"
          :ref="'group-tab-' + group_item.group_id"
        >
          <ion-label>{{ group_item.group_name }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-row v-if="storeGroups[activeParentGroupId]" class="groups-container">
        <ion-chip
          color="primary"
          v-show="storeProducts[group_item.group_id]"
          v-for="group_item in storeGroups[activeParentGroupId].children"
          :key="group_item.group_id"
          :ref="'group-chip-' + group_item.group_id"
          @click="scrollTo(group_item.group_id)"
        >
          <ion-label color="primary">{{ group_item.group_name }}</ion-label>
        </ion-chip>
      </ion-row>
    </div>













    <ion-searchbar class="search-container" :value="searchRequest" placeholder="Поиск в этом предприятии"
      @input="
        getStoreProducts({
          name_query: $event.target.value,
          name_query_fields: 'product_name,product_code',
        });
        searchRequest = $event.target.value;
      "/>

    <group-list v-if="storeGroups" :groupList="storeGroups" :onClick="(group_id) => {setActiveParentGroup(group_id) }"></group-list>

    <swiper
      v-if="storeGroups"
      pager="true"
      :options="slideOpts"
      class="product-list-slider"
      @slideChange="slideChanged($event)"
    >
      <swiper-slide v-for="parent_group_item in storeGroups" :key="parent_group_item.group_id">

        <ion-grid class="product-list">
          <ion-row
            v-for="group_item in parent_group_item.children"
            :key="group_item.group_id"
            :ref="'group-' + group_item.group_id"
            :data-group_id="group_item.group_id"
          >
            <ion-col class="group-title" size="12">
              <label><b>{{ group_item.group_name }}</b></label>
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
  IonNote,
  IonGrid,
  IonLabel,
  IonSegmentButton,
  IonSegment,
  IonChip,
  IonSearchbar,
  IonButton,
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
  settingsOutline
}                         from "ionicons/icons";
import ImageSlider        from "@/components/ImageSlider";
import GroupList          from "@/components/GroupList.vue";
import ProductList        from '@/components/ProductList.vue';
import jQuery             from "jquery";
import heap               from "@/heap";
import Utils              from "@/scripts/Utils.js";
import { defineComponent } from "@vue/runtime-core";



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

export default defineComponent({
  components: {
    IonText,
    IonCol,
    IonIcon,
    IonRow,
    IonNote,
    IonGrid,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    IonChip,
    IonSearchbar,
    IonButton,
    ImageSlider,
    Swiper,
    SwiperSlide,
    GroupList,
    ProductList
  },
  setup() {
    return {
      search,
      settingsOutline,
      slideOpts,
      slideModules:[Autoplay]
    };
  },
  data() {
    return {
      storeId: this.$route.params.id,
      searchRequest: "",
      pageTitle:'Магазин',
      error: "",
      storeItem: [],
      storeProducts: {},
      storeGroups: null,
      activeGroup: { children: [] },
      activeParentGroupId: 0,
      offsetModificator: 150
    };
  },
  computed: {
    isSignedIn() {
      return heap.state.user.user_id && heap.state.user.user_id > -1;
    },
  },
  methods: {
    setActiveParentGroup(parent_group_id) {
      this.activeParentGroupId = parent_group_id;
      const first_group_id =  Object.keys(this.storeGroups[this.activeParentGroupId].children)[0];
      const self = this;
      setTimeout(function(){
        self.scrollTo(first_group_id);
        self.setSubgroupActive(first_group_id);
      }, 200);
      const swiper = document.querySelector('.product-list-slider').swiper;
      const slide_index = Object.keys(this.storeGroups).indexOf(this.activeParentGroupId);
      swiper.slideTo(slide_index,100,false);
    },
    slideChanged(event) {
      const slideIndex=event.activeIndex
      const groud_id = Object.keys(this.storeGroups)[slideIndex];
      const first_group_id =  Object.keys(this.storeGroups[groud_id].children)[0];
      const self=this
      this.setActiveParentGroup(groud_id);
      setTimeout(function(){
        self.scrollTo(first_group_id);
        self.setSubgroupActive(first_group_id);
      }, 200);
    },
    async getStore() {
      try{
        const store=await jQuery.post(`${heap.state.hostname}Store/itemGet`, {store_id: this.storeId,distance_include:1})
        this.storeItem = this.prepareStore(store);
        this.storeId = store.store_id;
        this.pageTitle=store.store_name
        this.getStoreGroupTree({ store_id: this.storeId });
        heap.commit('setCurrentStore',this.storeItem);
      } catch(err){
        //console.log(err)
      }
    },
    prepareStore(storeItem) {
      if (storeItem.member_of_groups.group_names) {
        storeItem.store_group_names = storeItem.member_of_groups.group_names;
      }
      var date = new Date();
      storeItem.willBeClosedAt = storeItem["store_time_closes_" + date.getDay()];
      storeItem.delivery=Utils.deliveryCalculate(storeItem);
      return storeItem;
    },
    async getStoreGroupTree(filter) {
      try{
        this.storeGroups=await jQuery.get(`${heap.state.hostname}Product/groupTreeGet`, {store_id: filter.store_id})
        const first_group_id = Object.keys(this.storeGroups)[0];
        this.activeParentGroupId = first_group_id;
        this.getStoreProducts();
      }catch(err){
        //console.log(err);
      }
    },
    async getStoreProducts(filter = {}) {
      filter.store_id = this.storeId;
      filter.is_active = 1;
      if(this.storeItem.is_writable==1){
        filter.is_disabled=1
        filter.is_deleted=1
      }
      if (filter.name_query && filter.name_query == "") {
        this.getStoreGroupTree({ store_id: this.storeId });
        return;
      }
      try{
        const response=await jQuery.post(heap.state.hostname + "Product/listGet", filter)
        this.prepareProductList(response.product_list);
        this.addOtherGroup()
        var first_group_id = Object.keys(
          this.storeGroups[this.activeParentGroupId].children
        )[0];
        this.setSubgroupActive(first_group_id);
      }catch{/** */}
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
      }catch{
        this.$flash("Не удалось создать товар")
      }
    },
    addOtherGroup(){
      if(this.storeProducts[0]){
        this.storeGroups['other']={
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
    prepareProductList(product_list) {
      this.storeProducts = {};
      for (var product of product_list) {
        if (this.storeGroups){
          if (!this.storeProducts[product.group_id]) {
            this.storeProducts[product.group_id??0] = [];
          }
        }
        this.storeProducts[product.group_id??0].push(product);
      }
    },
    setSubgroupActive(groupId) {
      var chipList = document.querySelectorAll(".groups-container ion-chip");
      for (var chip of chipList) {
        chip.classList.remove("active-chip");
      }
      if (
        this.$refs["group-chip-" + groupId] &&
        this.$refs["group-chip-" + groupId][0] &&
        this.$refs["group-chip-" + groupId][0].classList
      ) {
        this.$refs["group-chip-" + groupId][0].classList.add("active-chip");
      }
    },
    scrollTo(groupId) {
      if (!this.$refs["group-" + groupId][0]) {
        return;
      }
      const offset=document.querySelector("ion-content").shadowRoot.querySelector("main").scrollTop;
      const anchor=this.$refs["group-" + groupId][0].$el.getBoundingClientRect().top;
      var elementPosition = offset+anchor - this.offsetModificator - (window.innerHeight/4);
      var first_group_id = Object.keys(this.storeGroups[this.activeParentGroupId].children)[0];
      if(first_group_id == groupId){
        elementPosition = offset+anchor - this.offsetModificator;
      }
      document
        .querySelector("ion-content")
        .shadowRoot.querySelector("main")
        .scrollTo({ top: elementPosition, behavior: "smooth" });
      var self = this;  
      setTimeout(function(){
        self.setSubgroupActive(groupId);
      }, 500);  
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
          this.setSubgroupActive(row.dataset.group_id);
          break;
        }
      }
    },
  },
  ionViewDidEnter() {
    this.getStore();
  },
  mounted() {
    this.getStore();
  },
  watch: {
    $route(currentRoute) {
      this.storeId = currentRoute.params.id;
    },
  },
})
</script>