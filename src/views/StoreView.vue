<template>
    <base-layout page-title="Магазин" page-default-back-link="/home" page-class="store-page" :cartComponent="CartHeader" :contentOnScroll="onScroll">
      <div class="store-block">
          <image-slider :imageList="storeItem.images" :key="sliderKey"/>
          <div class="store-info">
              <ion-fab v-if="storeItem.owner_id == $store.state.user.user_id" vertical="top" horizontal="end" slot="fixed">
                  <router-link class="section-button" :to="'/store_edit-'+storeItem.store_id">
                      <ion-icon :icon="create" slot="start"></ion-icon>
                  </router-link>
              </ion-fab>
              <ion-row>
                  <h4 class="store-title">{{ storeItem.store_name }}</h4>
              </ion-row>
              <ion-row>
                  <ion-col class="store-description">{{ storeItem.store_description }}</ion-col>
              </ion-row>
              <ion-row  class="store-subinfo">
                  <ion-col>{{ storeItem.store_types }}</ion-col>
                  <ion-col v-show="storeItem.willBeClosedAt">Закроется в {{ storeItem.willBeClosedAt }}:00</ion-col>
              </ion-row>
          </div>
      </div>

      <group-list :groupList="storeGroups" 
          :onClick="(group_id) => { 
              setActiveParentGroup(group_id) 
          }" 
      ></group-list>


    <div class="group-fixed-block hidden-block">
        <ion-segment ref="segment" scrollable>
            <ion-segment-button v-for="group_item in storeGroups" :key="group_item.group_id" :value="group_item.group_id" @click="setActiveParentGroup(group_item.group_id)" :ref="'group-tab-'+group_item.group_id">
                <ion-label>{{ group_item.group_name }}</ion-label>
            </ion-segment-button>
        </ion-segment>
        <ion-row v-if="storeGroups[activeParentGroupId]"  class="groups-container">
            <ion-chip color="primary" v-show="storeProducts[group_item.group_id]" v-for="group_item in storeGroups[activeParentGroupId].children" :key="group_item.group_id" :ref="'group-chip-'+group_item.group_id"
                @click="scrollTo(group_item.group_id);">
                <ion-label color="primary">{{ group_item.group_name }}</ion-label>
            </ion-chip>
        </ion-row>
        <ion-searchbar class="stacked-search-container"
            :value="searchRequest"
            v-show="searchRequest !== ''"
            @input="getStoreProducts({name_query: $event.target.value, name_query_fields: 'product_name,product_code,product_description'}); searchRequest=$event.target.value" 
            placeholder="Поиск товаров..."
        ></ion-searchbar>
    </div>

    <ion-searchbar class="search-container"
        :value="searchRequest"
        @input="getStoreProducts({name_query: $event.target.value, name_query_fields: 'product_name,product_code,product_description'}); searchRequest=$event.target.value" 
        placeholder="Поиск товаров..."
    ></ion-searchbar>

    <ion-slides v-if="storeGroups.length !== 0" pager="true" ref="slides" :options="slideOpts" class="product-list-slider" @ionSlideDidChange="slideChanged($event)">
        <ion-slide v-for="parent_group_item in storeGroups" :key="parent_group_item.group_id">
            <ion-grid class="product-list">
                <ion-row v-show="storeProducts[group_item.group_id]" v-for="group_item in parent_group_item.children" :key="group_item.group_id" :ref="'group-'+group_item.group_id" :data-group_id="group_item.group_id">
                    <ion-col class="group-title" size="12" >
                        <label>{{ group_item.group_name }}</label>
                    </ion-col>
                    <ion-col :class="'product-item product-item-selected'" size="4" v-for="product_item in storeProducts[group_item.group_id]" :key="product_item.product_id">
                        <ion-card-header>
                            <router-link class="link" :to="'product-'+product_item.product_id">
                                <img v-if="product_item.image_hash" :src="$store.state.hostname + '/image/get.php/' + product_item.image_hash + '.100.100.webp'" />
                            </router-link>
                            <product-add-buttons :product-item="product_item" :store-data="storeItem"/>
                        </ion-card-header>
                        <ion-card-content>
                            <router-link class="link" :to="'product-'+product_item.product_id">
                                <ion-card-title class="product-price">{{ product_item.product_final_price }}₽</ion-card-title>
                                <ion-card-subtitle>{{ product_item.product_name }}</ion-card-subtitle>
                                <ion-label v-if="!product_item.product_quantity">Нет в наличии</ion-label>
                            </router-link>
                            <ion-fab v-if="product_item.owner_id == $store.state.user.user_id" vertical="top" horizontal="end" slot="fixed">
                              <router-link class="section-button" :to="'/product_edit-'+product_item.product_id">
                                  <ion-icon :icon="create" slot="start"></ion-icon>
                              </router-link>
                            </ion-fab>
                        </ion-card-content>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-slide>
    </ion-slides>
  </base-layout>
</template>




<script>

import { search, create } from 'ionicons/icons';
import ImageSlider from '../components/imageSlider'
import ProductAddButtons from '../components/ProductAddButtons'
import CartHeader from '../components/CartHeader'
import GroupList from '../components/GroupList'
import { IonSlides, IonSlide } from '@ionic/vue';
import jQuery from "jquery";
import store from '../store';

var storeTypes = {
  'foodstore': 'Продуктовый магазин',
  'restaraunt': 'Ресторан'
};

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

export default  {
  components: { 
    ImageSlider,
    ProductAddButtons,
    IonSlides, 
    IonSlide,
    GroupList
  },
  setup() {
    return {
      search,
      create,
      CartHeader,
      slideOpts 
    }
  },
  data() {
    return { 
      storeId: this.$route.params.id,
      searchRequest: "",
      error: "",
      storeItem: [],
      storeProducts: {},
      storeGroups: [],
      activeGroup: { children: []},
      activeParentGroupId: 0
    };
  },
  computed:{
    isSignedIn(){
      return store.state.user.user_id && store.state.user.user_id > -1;
    }
  },
  methods: {
      setActiveParentGroup(parent_group_id){
        this.activeParentGroupId = parent_group_id;
        this.scrollTo(Object.keys(this.storeGroups[this.activeParentGroupId].children)[0]);
        var slide_index = Object.keys(this.storeGroups).indexOf(this.activeParentGroupId);
        if(this.$refs.slides){
          this.$refs.slides.$el.slideTo(slide_index, false, function(){return false;});
        }
      },
      slideChanged(event){
        var self = this;
        event.target.getActiveIndex()
          .then(function(slideIndex){
            var groud_id = Object.keys(self.storeGroups)[slideIndex];
            self.setActiveParentGroup(groud_id);
            self.$refs.segment.value = self.activeParentGroupId;
            
            self.scrollTo(Object.keys(self.storeGroups[self.activeParentGroupId].children)[0]);
          });
      },
      getStore(){
          var self = this;
          jQuery.post( store.state.hostname + "Store/itemGet", { store_id: self.storeId })
              .done(function(response) {
                  self.storeItem = self.prepareStore(response);
                  self.storeId = response.store_id;
                  self.getStoreGroupTree({store_id: self.storeId});
              })
              .fail(function(err) {
                  self.error = err.responseJSON.messages.error;
              });
      },
      prepareStore(storeItem){
        if(storeItem.member_of_groups.group_types){
          var group_types_array = storeItem.member_of_groups.group_types.split(',');
          for(var i in group_types_array){
            group_types_array[i] = storeTypes[group_types_array[i]];
          }
          storeItem.store_types = group_types_array.join(', ')
        }
        var date = new Date();
        storeItem.willBeClosedAt = storeItem['store_time_closes_'+date.getDay()];
        return storeItem;
      },
      getStoreGroupTree(filter){
          var self = this;
          jQuery.post( store.state.hostname + "Product/groupTreeGet", {store_id: filter.store_id})
              .done(function(response) {
                  self.storeGroups = response;
                  var first_group_id = Object.keys(self.storeGroups)[0];
                  if(self.$refs.segment){
                    self.$refs.segment.value = first_group_id;
                    self.activeParentGroupId = first_group_id;
                  }
                  self.getStoreProducts();
              })
              .fail(function(err) {
                  self.error = err.responseJSON.messages.error;
              });
      },
      getStoreProducts(filter = {}){
          filter.store_id = this.storeId;
          filter.is_active = 1;
          if(filter.name_query && filter.name_query == ""){
              this.getStoreGroupTree({store_id: self.storeId});
              return;
          }
          var self = this;
          jQuery.post(store.state.hostname + "Product/listGet", filter)
              .done(function(response) {
                  self.prepareProductList(response.product_list);
                  var first_group_id = Object.keys(self.storeGroups[self.activeParentGroupId].children)[0];
                  self.setSubgroupActive(first_group_id);
              })
              .fail(function(err) {
                  self.error = err.responseJSON.messages.error;
              });
      },
      prepareProductList(product_list){
        this.storeProducts = {};
        for(var product of product_list){
          if(this.storeGroups)
          if(!this.storeProducts[product.group_id]){
            this.storeProducts[product.group_id] = [];
          }
          this.storeProducts[product.group_id].push(product);
        }
      },
      setSubgroupActive(groupId) {
        var chipList = document.querySelectorAll('.groups-container ion-chip');
        for(var chip of chipList){
          chip.classList.remove('active-chip');
        }
        if(this.$refs['group-chip-'+ groupId]){
          this.$refs['group-chip-'+ groupId].classList.add("active-chip");
        }
      },
      scrollTo(groupId) {
        if(!this.$refs['group-'+ groupId]){
          return;
        }
        var elementPosition = document.querySelector("ion-content").shadowRoot.querySelector('main').scrollTop + this.$refs['group-'+ groupId].getBoundingClientRect().top - 120;
        document.querySelector("ion-content").shadowRoot.querySelector('main').scrollTo({top: elementPosition, behavior: 'smooth'});
      },
      onScroll(event){
        if((document.querySelector(".product-list-slider").offsetTop - document.querySelector(".group-fixed-block").offsetHeight-100) < event.detail.scrollTop){
          document.querySelector(".group-fixed-block").className = "group-fixed-block";
          //document.querySelector(".product-list-slider").style.marginTop = '100px';
        } else {
          document.querySelector(".group-fixed-block").className = "group-fixed-block hidden-block";
          //document.querySelector(".product-list-slider").style.marginTop = '0px';
        }
        var productGroupElementList = document.querySelectorAll('.swiper-slide-active .product-list ion-row');
        for(var row of productGroupElementList){
          if(row.getBoundingClientRect().bottom - 150 >= 0 && row.dataset.group_id){
            this.setSubgroupActive(row.dataset.group_id);
            break;
          }
        }
      }
  },
  mounted(){
      this.getStore();
      
  },
  watch: {
      '$route'(currentRoute) {
          this.storeId = currentRoute.params.id;
      }
  }
}
</script>

<style>
.store-page ion-toolbar {
  /*position: absolute;
  --background: linear-gradient(to top, #0000, #000000a0);*/
}
.store-info{
  box-shadow: 0px 0px 15px -5px #0000005e;
  padding: 10px;
  position: relative;
}
.store-title{

}
.store-description{
  visibility: visible;
  color: #6f6e6e;
  font-size: 15px;
}
.store-subinfo{
  visibility: visible;
  color: #979797;
  font-size: 13px;
  font-weight: bold;
}
.store-block{
  position: relative;
}

.groups-container ion-chip{
  border-radius: 10px;
  background-color: white;
  border: 1px solid #e6e6e6;
  font-weight: 500;
  padding: 10px 15px;
  height: 35px;
}

.groups-container ion-chip.active-chip{
  background-color: #256fe7;
  border: none;
}
.groups-container ion-chip.active-chip ion-label{
  color: white;
}
.store-page .search-container{
  visibility: visible;
  margin: 1em 0;
  color: black;
  --border-radius: 10px;
}
.store-page .stacked-search-container{
  visibility: visible;
  padding: 0;
  color: #535151;
}
.store-page .product-list {
  margin-top: 1em;
}
.store-page .product-item{
  visibility: visible;
  user-select: none;
}
.store-page .product-item ion-card-header{
  border: 1px solid transparent;
}
.store-page .product-item.product-item-selected ion-card-header{
  border: 1px solid var(--ion-color-primary);
  border-radius: 15px;
}
.store-page .product-list ion-card{
  text-align: center;
}
.store-page .product-list .link{
  text-decoration: none;
  color: var(--ion-text-main);
}
.store-page .product-list ion-card-header{
  padding: 10px 0px;
  text-align: center;
}
.store-page .product-list ion-card-content{
  padding: 10px 0px;
  text-align: center;
}
.product-list-slider.swiper-container{
  min-height: 100vh;
}
.product-list-slider.swiper-container .swiper-wrapper{
  min-height: 350px;
}
.store-page .store-block .swiper-wrapper{
    max-height: 250px;
}
.group-title{
  text-align: left;
}
.group-title label{

}

.group-fixed-block{
  position: fixed;
  top: 56px;
  z-index: 10000;
  width: 100%;
  background-color: white;
  box-shadow: 1px 1px 5px #00000040;
}
.group-fixed-block.hidden-block{
  display: none;
}
ion-segment{
  --background: var(--ion-bacground-primary-dark);
}
ion-segment-button{
  --color-checked: #ffc809;
  --indicator-height: 3px;
}
ion-segment ion-label{
  color: white;
}
ion-chip.active-chip{
  background-color: #256fe7;
  color: white;
  border: none;
}


</style>