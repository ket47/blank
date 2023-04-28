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
  display: block ruby;
}
.groups-container ion-segment-button {
  min-height: 45px;
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
  min-height: 75vh;
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



.desktop-main-container .group-fixed-block{
  left: 0px;
  top: 300px;
  width: 250px;
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
              <ion-item lines="none" v-if="storeItem.store_company_name">
                <ion-text><b>{{storeItem.store_company_name}}</b></ion-text>
              </ion-item>
              <ion-item lines="none" v-if="storeItem.store_tax_num">
                <ion-label color="medium">ИНН</ion-label>
                <ion-text color="dark">{{storeItem.store_tax_num}}</ion-text>
              </ion-item>
              <ion-item lines="none" v-if="storeItem.store_phone&&0">
                <ion-label color="medium">Телефон</ion-label>
                <ion-text color="dark">{{storeItem.store_phone}}</ion-text>
              </ion-item>
              <ion-item lines="none" v-if="storeItem.locations?.length>0">
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
        </ion-grid> 
      </ion-list>

        <div style="scrollbar-width: none; overflow-x: scroll;display: flex;">
          <div class="delivery-variant" v-if="storeItem.delivery_cost > 0">
            <div>
                <ion-label>Доставит {{$heap.getters.settings.app_title}}</ion-label><br/>
                <ion-text v-if="storeItem?.deliveryTime?.timeMin">{{storeItem.deliveryTime.timeMin}}-{{storeItem.deliveryTime.timeMax}}мин</ion-text>
            </div>
            <div>
              <ion-text v-if="storeItem.delivery_cost > 0"><b>{{storeItem.delivery_cost}}₽</b></ion-text>
            </div>
          </div>
          <div class="delivery-variant" v-if="storeItem.store_delivery_allow==1">
            <div>
              <ion-label>Доставит {{storeItem.member_of_groups.group_names}}</ion-label><br/>
            </div>
            <div>
              <ion-text v-if="storeItem.delivery_cost > 0"><b>{{storeItem.store_delivery_cost}}₽</b></ion-text>
            </div>
          </div>
          <div class="delivery-variant" v-if="storeItem.store_pickup_allow==1">
            <div>
              <ion-label>Самовывоз</ion-label><br/>
            </div>
            <div>
              <ion-text><b>0₽</b></ion-text>
            </div>
          </div>
        </div>
    </div>

    <div v-if="storeGroupsFiltered" ref="groupFixedBlock" class="group-fixed-block hidden-block">
      <ion-segment v-model="groupSelectedParentId" scrollable style="scrollbar-width: none;" class="groups-container">
        <ion-segment-button
          v-for="group_item in storeGroupsFiltered"
          :key="group_item.group_id"
          :value="group_item.group_id"
          @click="groupSelectParent(group_item.group_id,1)"
          :ref="'group-tab-' + group_item.group_id"
        >
          <ion-label>{{ group_item.group_name }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>

    <ion-searchbar class="search-container" v-model="searchQuery" placeholder="Поиск у этого продавца"/>

    <div v-if="storeGroupsFiltered">
      <h4 style="margin: 8px 16px;"><b>Категории</b></h4>
      <group-list :groupList="storeGroupsFiltered" :onClick="(group_id) => {groupSelectParent(group_id,true) }"></group-list>

      <swiper
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
        ref="productListSlider"
      >
        <swiper-slide v-for="parent_group_item in storeGroupsFiltered" :key="parent_group_item.group_id">
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
                <product-list :productList="storeProductsFiltered[group_item.group_id]"></product-list>
              </ion-col>
            </ion-row>
          </ion-grid>
        </swiper-slide>
      </swiper>
    </div>
    <ion-label v-else-if="searchQuery">
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
    <ion-label v-else-if="productListIsEmpty">
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
  Autoplay
}                         from 'swiper';
import { 
  Swiper,
  SwiperSlide 
 }                        from 'swiper/vue';
import 'swiper/css';
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
    ImageSliderComp,
    StoreOpenedIndicator,
    Swiper,
    SwiperSlide,
    GroupList,
    ProductList,
    IonSkeletonText,
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
      searchQuery: null,
      storeItem: [],

      productList:null,
      storeGroups: null,
      groupSelectedParentId: -1,
      sliderMaxHeight: 500,
      offsetModificator: 150,
      can_reload_at:0
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
        let store=await Utils.prePost(`${heap.state.hostname}Store/itemGet`,request )
        if(store){
          this.storeItem = this.itemPrepare(store);
          secondRenderTimeout=300
        }
        store=await Utils.post(`${heap.state.hostname}Store/itemGet`,request )
        setTimeout(()=>{
          this.storeItem = this.itemPrepare(store);
        },secondRenderTimeout)
        heap.commit('setCurrentStore',this.storeItem);
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
      if (storeItem.avatar.length > 0) {
        storeItem.avatarImage = storeItem.avatar[0].image_hash;
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
        const product_id=await jQuery.post(`${heap.state.hostname}Product/itemCreate`,request)
        if(group_id){
          await jQuery.post(`${heap.state.hostname}Product/itemUpdateGroup`,{product_id,group_id,is_joined:1})
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
        limit:200,
        grouptree_include:1
      }
      try{
        let secondRenderTimeout=0
        let response=await Utils.prePost(`${heap.state.hostname}Product/listGet`, request)
        if(response){
          this.productList=response.product_list
          this.groupTreePrepare(response.group_tree)
          secondRenderTimeout=300
        }

        response=await Utils.post(`${heap.state.hostname}Product/listGet`, request)
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
      setTimeout(()=>{this.groupSelect()}, 0)
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
    groupSelect(){//if there is parameter in route then scrollto category
      if(this.groupSelectedParentId>-1){
        return//group was set previously
      }
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
        parent_group_id = this.storeGroups[0]?.group_id
      }
      const selectFirstChip=false;//sub_group_id?false:true
      this.groupSelectParent(parent_group_id,selectFirstChip)
    },
    groupSelectParent(parent_group_id){
      if(this.groupSelectedParentId == parent_group_id){
        return
      }
      this.groupSelectedParentId = parent_group_id;
      if(this.$refs.productListSlider==undefined){//no products prevent error
        return
      }
      const swiper = this.$refs.productListSlider.$el.swiper
      const slide_index =this.storeGroups.findIndex(group=>group.group_id==parent_group_id)
      if(slide_index>=0){
        swiper.slideTo(slide_index,100,false)
        this.groupSliderAdjustHeight()
      }
    },
    groupSliderChanged(event) {
      const slideIndex=event.activeIndex
      const parent_groud_id = this.storeGroups[slideIndex].group_id;
      this.groupSelectParent(parent_groud_id,1)
    },
    groupSliderAdjustHeight(){
        const sliderContentHeight=this.$refs.productListSlider.$el.querySelector('.swiper-slide-active')?.scrollHeight
        if(sliderContentHeight>0){
          this.$refs.productListSlider.$el.style.maxHeight=sliderContentHeight+'px'
        } else {
          this.$refs.productListSlider.$el.style.maxHeight=''
        }
    },
    onScroll(event) {
      if(!this.$refs.productListSlider || !this.$refs.groupFixedBlock){
        return
      }
      const offsetTop=this.$refs.productListSlider.$el?.offsetTop;
      const offsetHeight=this.$refs.groupFixedBlock.offsetHeight;
      if (offsetTop - offsetHeight - 100 < event.detail.scrollTop ) {
        this.$refs.groupFixedBlock.classList.remove("hidden-block");
      } else {
        this.$refs.groupFixedBlock.classList.add("hidden-block");
      }
    },
  },
  async mounted(){
    this.query = this.$route.query
    this.itemGet()
    this.productListGet()
  },
  async ionViewDidEnter() {
    this.query = this.$route.query;
    this.itemGet()
    this.productListGet()
  },
  watch: {
    $route(currentRoute) {
      this.storeId = currentRoute.params.id;
    },
  },
}
</script>