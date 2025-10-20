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
  margin: 10px;
  font-size: 14px;
  display: grid;
  grid-template-columns: minmax(auto,200px) 60px;
  min-width:260px;
  height: 55px;
  color:white;
}
.delivery-variant div{
  padding: 10px;
  white-space: break-spaces;
}
.delivery-variant div:last-of-type{
  background: var(--ion-color-success-shade);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.groups-container{
  display: grid;/** for webview */
  grid-template-columns: repeat(30,min-content);
}
.ios .groups-container ion-segment-button ion-label{
  padding:10px;
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
.group-title {
  border-bottom: 2px solid var(--ion-color-secondary);
  margin-bottom: 1em;
  width: 80% !important;
}
.group-fixed-block {
  position: fixed;
  top: 56px;
  z-index: 10000;
  width: 100%;
  background-color: white;
}
.ios .group-fixed-block {
  position: sticky;
  top: 0px;
  z-index: 10000;
  width: 100%;
  background-color: white;
}
.md .group-fixed-block{
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
@media only screen and (max-width: 1000px) {
  .desktop-main-container .group-fixed-block{
    top:0px;
  }
}

@media only screen and (min-width: 1000px) {
  .desktop-main-container .group-fixed-block{
    left: 0px;
    top: 320px;
    width: 250px;
  }
  .desktop-main-container .group-fixed-block ion-segment{
    display: grid;
    grid-template-columns: 100%;
    --background: white;
  }
  .desktop-main-container .group-fixed-block ion-segment ion-segment-button{
    grid-row:unset;
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
}
  ion-skeleton-text {
    --border-radius: 10px;
    --background: #ddd
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
          <ion-icon v-if="storeItem.is_writable" slot="end" color="primary" @click="$go(`/catalog/store-edit-${storeItem.store_id}`)" :icon="settingsOutline" style="font-size:24px"></ion-icon>
        </ion-item>
        <ion-accordion-group style="width:100%">
          <ion-accordion>
            <ion-item  slot="header" lines="none">
              <ion-text v-if="storeItem.store_description" class="store-description" color="medium">{{storeItem.store_description}}</ion-text>
              <ion-text v-else color="medium">подробнее</ion-text>
            </ion-item>
            <ion-list slot="content">
              <ion-item lines="none" v-if="storeItem.store_phone">
                <ion-label color="medium">Телефон</ion-label>
                <ion-text><a :href="`tel:${storeItem.store_phone}`">{{storeItem.store_phone}}</a></ion-text>
              </ion-item>
              <div  v-if="$heap.state.settings?.other?.chameleonMode!='on'">
                <ion-item lines="none" v-if="storeItem.locations?.length>0">
                  <ion-text color="dark">{{storeItem.locations?.[0].location_address}}</ion-text>
                </ion-item>
                <ion-item lines="none" v-if="storeItem.store_company_name">
                  <ion-text><b>{{storeItem.store_company_name}}</b></ion-text>
                </ion-item>
                <ion-item lines="none" v-if="storeItem.store_tax_num">
                  <ion-label color="medium">ИНН</ion-label>
                  <ion-text color="dark">{{storeItem.store_tax_num}}</ion-text>
                </ion-item>
              </div>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
        <ion-item v-if="storeItem.store_group_names" lines="none">
          <ion-text v-for="cat in storeItem.store_group_names.split(',')" :key="cat" color="medium" style="font-size:0.9em">#{{cat}}&nbsp;</ion-text>
        </ion-item>
      </ion-list>

        <div class="horizontalScroller" style="padding:6px">
          <reaction-thumbs @react="itemGet()" :reactionSummary="storeItem?.reactionSummary" :targetType="'store'" :targetId="storeId"/>
          <reaction-share :targetUrl="`catalog/store-${storeId}`" :targetTitle="storeItem.store_name" :targetText="storeItem.store_description"/>
          <store-opened-indicator :storeItem="storeItem"/>
        </div>
        <reaction-comment  @react="itemGet()" :reactionSummary="storeItem?.reactionSummary" :targetType="'store'" :targetId="storeId"/>


        <div class="horizontalScroller" style="display:flex">
          <div class="delivery-variant" v-if="storeItem.delivery_cost > 0">
            <div>
                <ion-text>Доставит {{$heap.getters.settings.app_title}}</ion-text><br/>
                <ion-text v-if="storeItem?.deliveryTime?.timeMin">{{storeItem.deliveryTime.timeMin}}-{{storeItem.deliveryTime.timeMax}}мин</ion-text>
            </div>
            <div>
              <ion-text v-if="storeItem.delivery_cost > 0">{{storeItem.delivery_cost}}₽</ion-text>
              <ion-text v-else>0₽</ion-text>
            </div>
          </div>
          <div class="delivery-variant" v-if="storeItem.store_delivery_allow==1" @click="$go(`/modal/store-dmethods-${storeId}`)">
            <div>
              <ion-text>
                Доставит {{storeItem.store_name}}
                <b style="font-size:10px">Условия доставки </b>
              </ion-text>
            </div>
            <div style="padding-left: 15px;"><ion-icon :icon="openOutline"></ion-icon></div>
          </div>
          <div class="delivery-variant" v-if="storeItem.store_pickup_allow==1">
            <div>
              <ion-text>Самовывоз</ion-text><br/>
            </div>
            <div>
              <ion-text>0₽</ion-text>
            </div>
          </div>
        </div>
    </div>

    <div v-if="storeItem.store_id">
      <!-- load after store is done-->
      <home-slider :holderId="storeItem.store_id" :is-editable="storeItem.is_writable"/>
      <stories-slider :holderId="storeItem.store_id" group-by="post_id" :is-editable="storeItem.is_writable"/>
    </div>


    <ion-searchbar class="search-container" v-model="searchQuery" placeholder="Поиск у этого продавца"/>

    <div v-if="storeGroupsFiltered">
      <h4 style="margin: 8px 16px;"><b>Категории</b></h4>
      <group-list :groupList="storeGroupsFiltered" :activeIndex="productCategoryActive" :storeId="storeItem.store_id" :onClick="(evt) => selectProductCategory(evt)"></group-list>
      <div v-for="(parent_group_item, index) in storeGroupsFiltered" :key="parent_group_item.group_id" :id="`group-${index}-${storeItem.store_id}`">
        <h5 style="padding: 0 10px; margin: 0px">{{ parent_group_item.group_name }} </h5>
        <ion-grid class="product-list">
          <ion-row
            v-for="group_item in parent_group_item.children"
            :key="group_item.group_id"
            :ref="'group-' + group_item.group_id"
            :data-group_id="group_item.group_id"
          >
            <ion-col class="group-title" size="12">
              <h6 style="margin: 0; color: var(--ion-color-medium)" >
                {{ group_item.group_name }} 
                <ion-chip v-if="storeItem.is_writable==1" @click="productItemCreate(group_item.group_id)">
                  Добавить товар
                </ion-chip>
              </h6>
            </ion-col>
            <ion-col  size="12">
              <product-list :productList="storeProductsFiltered[group_item.group_id]"></product-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>
    <ion-label v-else-if="searchQuery" style="padding:15px">
      К сожалению, в <b>{{storeItem.store_name}}</b> по запросу <b>"{{searchQuery}}"</b> ничего не найдено. <ion-chip @click="this.searchQuery=null">Сбросить фильтр</ion-chip>
    </ion-label>
    <div v-else-if="!productList">
      <h4 style="margin: 8px 16px;"><b><ion-skeleton-text style="height:30px;width:150px"></ion-skeleton-text></b></h4>
      <div>
        <div v-for="i in [1,2,3,4]" :key="i" style="display:inline-block;margin:10px">
          <ion-skeleton-text style="height:70px;width:70px" animated></ion-skeleton-text>
        </div>
      </div>

      <ion-grid class="product-list">
        <ion-row>
          <ion-col class="group-title" size="12">
            <h5 style="margin: 0;">
              <ion-skeleton-text style="height:20px;width:120px"></ion-skeleton-text>
            </h5>
          </ion-col>
          <ion-col  size="12">
            <div v-for="i in [1,2,3,4]" :key="i" style="display:inline-block;margin:10px">
              <ion-skeleton-text style="height:120px;width:120px" animated></ion-skeleton-text>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
    <ion-label v-else-if="productListIsEmpty" style="padding:15px">
      К сожалению, в <b>{{storeItem.store_name}}</b> пока нет доступных товаров.
    </ion-label>    
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
  IonSkeletonText,
}                         from "@ionic/vue";
import { 
  search,
  settingsOutline,
  rocketOutline,
  compassOutline,
  addOutline,
  arrowRedoOutline,
  openOutline,
}                         from "ionicons/icons";
import ImageSliderComp    from "@/components/ImageSliderComp";
import GroupList          from "@/components/GroupList.vue";
import ProductList        from '@/components/ProductList.vue';
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';
import jQuery             from "jquery";
import Utils              from "@/scripts/Utils.js";

import ReactionThumbs     from '@/components/ReactionThumbs.vue'
import ReactionComment    from '@/components/ReactionComment.vue'
import ReactionShare      from '@/components/ReactionShare.vue'
import StoriesSlider      from "@/components/PostStoriesSlider";
import HomeSlider         from "@/components/HomeSlider";

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
    ImageSliderComp,
    StoreOpenedIndicator,
    GroupList,
    ProductList,
    IonSkeletonText,
    ReactionThumbs,
    ReactionComment,
    ReactionShare,
    StoriesSlider,
    HomeSlider
  },
  setup() {
    return {
      search,
      settingsOutline,
      rocketOutline,
      compassOutline,
      addOutline,
      arrowRedoOutline,
      openOutline,
    };
  },
  data() {
    return {
      storeId: this.$route.params.id,
      query:this.$route.query,
      searchQuery: null,
      storeItem: [],
      productList:null,
      storeGroups: null,
      can_reload_at:0,
      stickyMenuState: false,
      stickyMenuAnimating: false,
      productCategoryActive: -1
    };
  },
  computed:{
    storeGroupsFiltered(){
      if(!this.storeProductsFiltered || !this.storeGroups){
        return null
      }
      const notEmptyGroupIds=Object.keys(this.storeProductsFiltered)
      let storeGroupsFiltered=null
      for(let i in this.storeGroups){
        for(let group_id in this.storeGroups[i].children){
          const group=this.storeGroups[i].children[group_id]
          if(notEmptyGroupIds.includes(group_id)){
            if(!storeGroupsFiltered){
              storeGroupsFiltered={}
            }
            if(!storeGroupsFiltered[i]){
              storeGroupsFiltered[i]={
                group_id:this.storeGroups[i].group_id,
                group_name:this.storeGroups[i].group_name,
                image_hash:this.storeGroups[i].image_hash,
                children:[],
              }
            }
            storeGroupsFiltered[i].children.push(group)
          }
        }
      }
      return storeGroupsFiltered
    },
    storeProductsFiltered() {
      if(!this.productList){
        return null
      }
      let category_order=1
      let storeProductsFiltered = {}
      for (let product of this.productList) {
        if( this.searchQuery ){
          try{
            const regexp=new RegExp(this.searchQuery.replace(/^[\w\d\s]/,'').replace(/\s/g,'.*'),'im')
            if(    !product.product_name?.match( regexp )
                && !product.product_code?.match( regexp )
                && !product.product_description?.match( regexp )
              ){// 
              continue
            }
          } catch{/** */}
        }
        const group_id=product.group_id??0
        if (this.storeGroups){
          if (!storeProductsFiltered[group_id]) {
            storeProductsFiltered[group_id] = []
            storeProductsFiltered[group_id].category_order=category_order++
          }
        }
        storeProductsFiltered[group_id].push(product)
      }
      return storeProductsFiltered
    },
    productListIsEmpty(){
      return this.productList?.length>0?0:1
    }
  },
  methods: {
    async itemGet() {
      try{
        const request={
          store_id: this.storeId,
          distance_include:1,
          products_include:1,
        }
        let secondRenderTimeout=0
        let store=await Utils.prePost(`${this.$heap.state.hostname}Store/itemGet`,request )
        if(store){
          this.storeItem = this.itemPrepare(store);
          secondRenderTimeout=300
        }
        store=await Utils.post(`${this.$heap.state.hostname}Store/itemGet`,request )
        setTimeout(()=>{
          this.storeItem = this.itemPrepare(store);
        },secondRenderTimeout)
        this.$heap.commit('setCurrentStore',this.storeItem);
      } catch(err){
        const exception_code=err?.responseJSON?.messages?.error;
        switch(exception_code){
            case 'notfound':
                this.$flash("Продавец не найден")
                this.$router.replace("/catalog")
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
      if(storeItem.avatar.length > 0) {
        storeItem.avatarImage = storeItem.avatar[0].image_hash;
      }
      if(storeItem.images.length > 0){
        document.querySelector('meta[property="og:image"]').setAttribute("content", `${this.$heap.state.hostname}image/get.php/${storeItem.images[0].image_hash}.600.600.jpg`)
      }
      return storeItem;
    },
    async productItemCreate( group_id ){
      try{
        const request={
          store_id:this.storeId,
          product_name:"Новый товар",
          product_price:1000
        }
        const product_id=await jQuery.post(`${this.$heap.state.hostname}Product/itemCreate`,request)
        if(group_id){
          await jQuery.post(`${this.$heap.state.hostname}Product/itemUpdateGroup`,{product_id,group_id,is_joined:1})
        }
        this.$go(`/catalog/product-edit-${product_id}`)
        this.$flash("Добавлен 'Новый товар'")
      }catch{
        this.$flash("Не удалось создать товар")
      }
    },
    async productListGet() {
      const request={
        store_id:this.storeId,
        is_active:1,
        limit:500,
        grouptree_include:1
      }
      try{
        let secondRenderTimeout=0
        let response=await Utils.prePost(`${this.$heap.state.hostname}Product/listGet`, request)
        if(response){
          this.productList=response.product_list
          this.groupTreePrepare(response.group_tree)
          secondRenderTimeout=300
        }

        response=await Utils.post(`${this.$heap.state.hostname}Product/listGet`, request)
        setTimeout(()=>{//
          this.productList=response.product_list
          this.groupTreePrepare(response.group_tree)
        },secondRenderTimeout)
      }catch(err){/** */}
    },
    async groupTreePrepare(storeGroupsUnordered) {
      let storeGroupsOrdered=[]
      for( let group_id in storeGroupsUnordered){
        storeGroupsOrdered[storeGroupsUnordered[group_id].order]=storeGroupsUnordered[group_id]
      }
      this.storeGroups=storeGroupsOrdered
      this.groupOtherAdd()
    },
    groupOtherAdd(){
      if(this.storeProductsFiltered[0]){
        const has_other_group=this.storeGroups.filter(group=>group.group_id=='other')
        if(has_other_group.length>0){
          return
        }
        this.storeGroups.push({
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
        })
      }
    },
    onScroll(event) {
      this.checkSticky()
      this.checkActiveCategory(event)
    },
    checkSticky(){
      var sticky = document.querySelector(`#productCategories${this.storeItem.store_id}`);
      if(this.stickyMenuAnimating || !sticky) return
      this.stickyMenuAnimating = true
      setTimeout(() => {
        if (!this.stickyMenuState && (this.getAnchorOffset() < 0)) {
            sticky.classList.add("is-sticky");
            this.stickyMenuState = true;
        } else if (this.stickyMenuState && (this.getAnchorOffset() >=0 )) {
            sticky.classList.remove("is-sticky");
            this.stickyMenuState = false;
        }
        this.stickyMenuAnimating = false
      },100)
    },
    getAnchorOffset() {
      var sticky = document.querySelector(`#productCategories${this.storeItem.store_id}`);
      if(!sticky) return 0
      var stickyAnchor = sticky.parentNode;
      return stickyAnchor.getBoundingClientRect().top;
    },
    checkActiveCategory(event){
      const menuLinks = document.querySelectorAll(`#productCategories${this.storeItem.store_id} a`);
      const sections = Array.from(menuLinks).map(link => document.querySelector(link.getAttribute("data-target")));
      this.productCategoryActive = -1;
      if(!event) return false;
      let scrollPosition = event.detail.currentY + window.innerHeight / 2;
      sections.forEach((section, index) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < bottom) {
          this.productCategoryActive = index
        }
      });
    },
    selectProductCategory(index) {
      document.querySelector(`#group-${index}-${this.storeItem.store_id}`).scrollIntoView()
    }
  },
  async mounted(){
    this.query = this.$route.query
    this.itemGet()
    this.productListGet()
    this.checkActiveCategory()
  },
  async ionViewDidEnter() {
    this.query = this.$route.query;
    this.itemGet()
    this.productListGet()
  },
  // watch: {
  //   $route(currentRoute) {
  //     this.storeId = currentRoute.params.id;
  //   },
  // },
}
</script>