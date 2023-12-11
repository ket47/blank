<style>

.store-menu-page ion-toolbar{
  position: absolute;
  --ion-toolbar-background: transparent;
  background: linear-gradient(to bottom , #0000007a, #0000);
  z-index: 1000;
}
.store-menu-page ion-toolbar ion-icon{
  height: 35px;
  margin: 5px auto;
  filter: drop-shadow(1px 1px 4px #00000045);
}
.store-menu-page .avatar-container{
  width: 100px;
}
.store-menu-page .avatar{
  margin: -90px auto 0;
  position: relative;
  z-index: 100;
  width: 100px;
  height: 100px;
  bottom: 0px;
  border-radius: 100%;
  overflow: hidden;
  border: 4px solid white;
}
.store-menu-page .avatar img{
  pointer-events: none;
}

.store-menu-page .store-info {
  position: relative;
  padding-bottom: 20px;
  contain: initial;
}
.store-menu-page .store-info ion-item{  
  overflow: visible;
}
.store-menu-page .store-info-container{
  background: linear-gradient(to top, #1480c1 , var(--ion-color-primary) 30%);
  color: white;
  font-weight: bold;
  text-align: center;
}
.store-menu-page .store-image-slider-container{
  position: relative;
}
.store-menu-page .store-image-slider-container:before{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #0000002e, #0000);
  z-index: 10;
}
.store-menu-page .store-image-slider-container .overlay{
  height: 100%;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background-position-x: center;
  background-position-y: bottom;
  background-repeat: no-repeat;
  background-size: auto;
}


@media screen and (max-width: 768px) {
  .store-menu-page .store-image-slider-container .overlay{
    background-size: 1700px;
  }
}
@media screen and (max-width: 450px) {
  .store-menu-page .store-image-slider-container .overlay{
    background-size: 1000px;
  }
}
.store-menu-page .groups-container{
  border-bottom: 1px solid lightgray;
  display: block ruby;
}
.store-menu-page .groups-container ion-segment-button {
  font-weight: bold;
  margin: 0 5px;
  text-transform: initial;
  min-height: 35px;
  color: var(--ion-color-primary)
}
.store-menu-page .product-list {
  margin-top: 1em;
  min-height: 80vh;
}
.store-menu-page .product-container{
  z-index: 100;
  contain: content;
  position: relative;
}
.store-menu-page .product-item {
  visibility: visible;
  user-select: none;
  padding: 10px;
  border-radius: 15px;
  margin: 15px 0;
  position: relative;
}

.store-menu-page .product-title{
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 0;
}
.store-menu-page .product-item .product-data{
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0 20px;
}
.store-menu-page .product-item .product-description{
  color: #ddd;
  font-size: 0.75em;
  font-weight: normal;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.store-menu-page .product-price{
  padding: 10px 10px 5px;
  color: #fdc203;
  width: 100%;
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
}
.store-menu-page .product-item ion-card-header {
  border: 1px solid transparent;
}
.store-menu-page .product-item.product-item-selected ion-card-header {
  border: 1px solid var(--ion-color-primary);
  border-radius: 15px;
}
.store-menu-page .product-list ion-card {
  text-align: center;
}
.store-menu-page .product-list .link {
  text-decoration: none;
  color: var(--ion-text-main);
}
.store-menu-page .product-list ion-card-header {
  padding: 10px 0px;
  text-align: center;
}
.store-menu-page .product-list ion-card-content {
  padding: 10px 0px;
  text-align: center;
}
.store-menu-page .product-list-slider.swiper-container {
  min-height: 100vh;

}
.store-menu-page .product-list-slider.swiper-container .swiper-wrapper {
  min-height: 350px;
}
.store-menu-page .store-block .swiper-wrapper {
  max-height: 250px;
}
.store-menu-page .group-title {
  text-align: left;
  color: white;
}
.store-menu-page .group-fixed-block {
  position: fixed;
  top: 0;
  z-index: 10000;
  width: 100vw;
  background-color: white;
  border-bottom: 1px solid lightgray;
}
.store-menu-page .group-fixed-block.hidden-block {
  display: none;
}
.store-menu-page .product_list_widget_grid {
    font-size: 0.8em;
}

.store-menu-page .product-item{
  display: grid;
  grid-template-columns: 100px 55%;
  grid-column-gap: 5%;
}
.store-menu-page .product-item .product_list_item_img{
    border-radius: 10px;
    width: 100px;
    height: 100px;
    overflow:hidden;
    align-items: center;
    justify-content: center;
    display:flex;
    position: relative;
}
.store-menu-page .product-item .product_list_item_img .blur-image{
    height: 100%;
    position: absolute;
    z-index: -1;
    filter: blur(2px);
}
.store-menu-page .product-item.disabled,.store-menu-page .product-item.deleted{
    filter:grayscale(1);
    opacity: 0.7;
}
.store-menu-page ion-footer{
  display: block !important;
  text-align: center;
  padding: 2em;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-top: -30px;
  position: relative;
  z-index: 205;
}
.absent{
  filter:grayscale(1);
}

#product-modal {
  --height: fit-content;
}
#product-modal::part(content) {
  background: none;
  box-shadow: none;
}
#product-modal::part(backdrop) {
  --backdrop-opacity: 0.5;
}

</style>

<template>
  
  <ion-page>
    <ion-content  :class="'store-menu-page'" :scrollEvents="true" @ionScroll="onScroll"> 
      <ion-toolbar>
        <ion-icon  v-if="mainLogo" class="toolbar_svg_logo" style="color: white"  :icon="mainLogo"/>
      </ion-toolbar>
      <div style="background-color: #1380c1; padding-bottom: 15px;"> 
        <div class="store-info-container">
          <div class="store-image-slider-container">
            <image-slider-comp :imageList="storeItem.images" :imgHeight="250" :mode="'crop-to-fit'"></image-slider-comp>
            <div class="overlay" style="background-image: url(/img/store_menu_background_full.png); "></div>
          </div>
          <div class="avatar" v-if="storeItem.avatarImage">
            <img :alt="storeItem.store_name" :src="$heap.state.hostname+'image/get.php/'+storeItem.avatarImage+'.200.200.webp'" />
          </div>
          <div v-else>
            <h2>{{storeItem.store_name}}</h2>
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
          </div>
          <h4 style="margin: 16px 16px 20px;"><b>Онлайн меню</b></h4>
          <group-list v-if="storeGroups" :groupList="storeGroups" :onClick="(group_id) => {groupSelectParent(group_id,true) }"></group-list>
        </div>

        <div class="product-container">
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
          ref="productListSlider"
          class="product-list-slider" @slideChange="groupSliderChanged($event)" :style="`max-height: ${sliderMaxHeight}`">
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
                    <h5 style="margin: 0;">{{ group_item.group_name }}</h5>
                  </ion-col>
                  <ion-col  size="12">
                    <div class="product_list_widget_grid">
                      <div v-for="productItem in storeProducts[group_item.group_id]" :key="productItem.product_id" @click="showProductModal(productItem)">
                        <div :class="productItem.item_class + ' product-item'" :id="`product_list_item${productItem.product_id}`">
                            <div class="product_list_item_img">
                                <img class="blur-image" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.200.200.webp`"/>
                                <ion-img :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.200.200.webp`"/>
                            </div>
                            <div class="product-data">
                                <h4 class="product-title">{{ productItem.product_name }}</h4>
                                <p class="product-description">{{productItem.product_description}}</p>
                                <div v-if="productItem.options">
                                  <ion-chip v-for="option in productItem.options" :key="option.product_id" color="primary">
                                    <ion-label>{{option.product_option}}</ion-label>&nbsp;<ion-label v-if="option.product_final_price>0">{{option.product_final_price}}{{$heap.state.currencySign}}</ion-label>
                                  </ion-chip>
                                </div>
                                <div class="product-price">
                                  <span>
                                      <b v-if="productItem.product_net_price>0" style="font-weight: bold; margin: 5px; font-size: 1.8em">{{productItem.product_net_price}}</b>
                                      <b v-else style="font-weight: bold; margin: 5px; font-size: 1.8em">{{productItem.product_final_price}}</b>
                                      <b style="font-weight: bold; margin: 0; font-size: 1.5em">{{$heap.state.currencySign}}</b>
                                  </span>
                                  
                                  <span v-if="productItem.product_unit=='порция'" style="color:var(--ion-color-light)">
                                      /{{productItem.weight_in_gramms}}г
                                  </span>
                                  <span v-else style="color:var(--ion-color-light)">
                                    /
                                    <span v-if="productItem.product_unit=='порция'" >{{productItem.weight_in_gramms}}г</span>
                                    <span v-else-if="productItem.product_unit=='порция мл'" >{{productItem.weight_in_gramms}}мл</span>
                                    <span v-else-if="productItem.product_unit=='кг' && productItem.product_quantity_min<1" >{{productItem.unit_in_gramms}}г</span>
                                    <span v-else>{{productItem.product_unit}}</span>
                                  </span>
                            </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </swiper-slide>
          </swiper>
        </div> 
        </div>
      <ion-footer style="background-image: url(/img/bg3.ce15f59d.png)">
        <div>
          <h6>НУЖНА ДОСТАВКА?</h6> 
          <h4>ВЫБИРАЙ TEZKEL</h4>
        </div>
        <div>
          <router-link :to="`/catalog/store-${storeId}`">
            <ion-button>Перейти в приложение</ion-button>
          </router-link>
        </div>
      </ion-footer>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonToolbar,
  IonContent,
  IonFooter,
  IonCol,
  IonImg,
  IonIcon,
  IonRow,
  IonGrid,
  IonLabel,
  IonSegmentButton,
  IonSegment,
  IonButton,
  IonChip,
  modalController
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
import mainLogo           from "@/assets/icons/tezkel_logo.svg";
import ImageSliderComp        from "@/components/ImageSliderComp";
import GroupList          from "@/components/GroupList.vue";
import jQuery             from "jquery";
import heap               from "@/heap";
import Utils              from "@/scripts/Utils.js";
import ProductItemModal   from '@/components/ProductItemModal.vue'




export default{
  components: {
    IonPage,
    IonToolbar,
    IonContent,
    IonFooter,
    IonCol,
    IonIcon,
    IonImg,
    IonRow,
    IonGrid,
    ImageSliderComp,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    IonButton,
    Swiper,
    SwiperSlide,
    GroupList,
    IonChip,
  },
  setup() {
    return {
      mainLogo,
      search,
      settingsOutline,
      rocketOutline,
      compassOutline,
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
      offsetModificator: 80,
      sliderMaxHeight: 500,
      can_reload_at:0
    };
  },
  
  computed:{
      weight_in_gramms(){
          return this.productItem.product_weight*1000
      },
      unit_in_gramms(){
          return Math.round(this.productItem.product_quantity_min*1000)
      },
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
                  this.$go("/catalog")
                  break;
          }
          return false
        }
   },
   itemPrepare(storeItem) {
      if (storeItem.member_of_groups.group_names) {
        storeItem.store_group_names = storeItem.member_of_groups.group_names;
      }
      try{
        storeItem.deliveryTime=Utils.deliveryTimeCalculate(storeItem.locations[0].distance,storeItem.store_time_preparation)
      }catch{/** */}
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
        product.item_class = '';
        if(product.deleted_at){
            product.item_class = 'deleted'
        }
        if(product.is_disabled==1){
          product.item_class = 'disabled'
        }
        if(product.is_counted==1 && !( (product.product_quantity-product.product_quantity_reserved) > 0 ) ){
          product.item_class = 'absent'
        }
        product.weight_in_gramms = product.product_weight*1000
        product.unit_in_gramms = Math.round(product.product_quantity_min*1000)

        this.storeProducts[product.group_id??0].push(product);
      }
    },


    async groupTreeGet(filter) {
      try{
        const storeGroupsUnordered=await jQuery.get(`${heap.state.hostname}Product/groupTreeGet`, {store_id: filter.store_id})
        let storeGroupsOrdered=[]
        for( let group_id in storeGroupsUnordered){
          storeGroupsOrdered[storeGroupsUnordered[group_id].order]=storeGroupsUnordered[group_id]
        }
        this.storeGroups=storeGroupsOrdered

        this.productListGet();
      }catch(err){/** */}
    },
    groupOtherAdd(){
      if(this.storeProducts[0]){
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
      const offsetTop=document.querySelector("#hcat_widget_grid")?.getBoundingClientRect().top;
      if (offsetTop < 0 ) {
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
    async showProductModal(productItem){
      const modal = await modalController.create({
          component: ProductItemModal,
          id: 'product-modal',
          componentProps:{productItem},
          handleBehavior:"cycle",
          canDissmiss:true,
      });
      modal.present()
      this.$topic.on('dismissModal',()=>modal.dismiss())
      const target=await modal.onDidDismiss()
      this.$emit('react',target.data)
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
  },
}
</script>