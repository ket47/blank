<style scoped>
.crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 150px;
}

.crop-to-fit ion-img {
  flex-shrink:0;
  min-width:100%;
  min-height:100%
}
ion-card{
  border-radius: 10px;
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
  right:10px;
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
/* .perk-slider .perk-label {
  font-size: 16px;
  background-color: var(--ion-color-primary);
  color:white;
  border-radius: 20px;
  width:40px;
  height:40px;
  display: flex;
  align-items: center;
  justify-content: center;
} */

/*
 @media screen and (min-width: 740px) {
  .store-list {
    display: grid;

  }
}
@media screen and (min-width: 1080px) {
  .store-list > ion-card{
    width: 31%;
    float: right;
    margin: 1%;
  }
} */


 @media screen and (min-width: 740px) {
    .store-list{
      display: grid;
      grid-template-columns: auto  auto;
    }
 }
</style>

<template>
  <!-- STORES ARE LOADING -->
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

    <ion-card v-if="!outofrangeFormHidden">
      <ion-card-header>
        <ion-card-subtitle> Заполните форму и мы уведомим вас, когда появится ресторан или магазин поблизости.</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>

        <ion-input v-if="!$heap.state.user?.user_phone" v-model="out.phone" label="Номер телефона" label-placement="floating" :value="$heap.state.user?.user_phone"/>
        <ion-input v-if="!showndelivery_address" v-model="out.address" label="Желаемый адрес"  label-placement="floating"  :value="showndelivery_address"/>
        <ion-input v-model="out.comment" label="Ваш комментарий"  label-placement="floating"/>

        <ion-button expand="block" @click="outFormSend()">отправить заявку</ion-button>
      </ion-card-content>
    </ion-card>

    <ion-item button detail @click="$go('/page/supplier-guide')">
      Хотите стать продавцом здесь? Узнайте о преимуществах.
    </ion-item>
  </div>
  <!-- STORES ARE FOUND -->
  <div v-else-if="storeList && storeList.length>0">
    <ion-grid class="ion-justify-content-between ion-align-items-center" style="padding: 0 16px;">
      <ion-row>
        <ion-col size="10">
          <h5 class="section-title">Магазины и рестораны</h5>
        </ion-col>
        <ion-col  size="2" class="ion-align-self-end" @click="$router.push('/search')">
          <ion-icon style="font-size: 20px;" :icon="searchOutline"/>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-list class="store-list">
      <ion-card style="position:relative;height:fit-content" v-for="(store_item, store_index) in storeList"  :key="store_item.store_id"  :class="store_item.is_opened==0?'closed':''">
        <div @click="$go(`/catalog/store-${store_item.store_id}`)" class="crop-to-fit" style="height: 180px;cursor:pointer">
            <ion-img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.500.500.webp'"/>
        </div>
        <div 
          v-if="store_perks[store_index].length > 0" 
          class="perk-row" 
          :style="`width:${store_perks[store_index].length*50}px`">
          <span v-for="perk in store_perks[store_index]" :key="perk.image_hash" class="perk" >
            <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +perk.image_hash +'.80.80.png'}`"/>
            <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
          </span>
        </div>
          
        <div @click="$go(`/catalog/store-${store_item.store_id}`)" style="cursor:pointer">
          <ion-item lines="none" class="store-title">
              <b>{{store_item.store_name}}</b>
          </ion-item>
          <ion-grid>
            <ion-row class="ion-justify-content-between">
              <ion-col size="auto">
                <store-opened-indicator :storeItem="store_item"/>
                </ion-col>
              <ion-col size="auto">
                <ion-chip v-if="store_item.deliveryTime.timeMin" color="medium"  background="transparent">
                  <ion-icon :icon="timeOutline" ></ion-icon> 
                  <label>{{store_item.deliveryTime.timeMin}}-{{store_item.deliveryTime.timeMax}}мин</label>
                </ion-chip>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

          <swiper class="perk-slider" v-if="store_perks_slider[store_index].length > 0" 
            :modules="modules" 
            :speed="1000"
            :slidesPerView="1"
            :navigation="false"
            :autoplay='{delay: 3000, disableOnInteraction: true}'
          >
            <swiper-slide v-for="(productPerk, productPerkIndex) in store_perks_slider[store_index]" :key="productPerkIndex">
              <ion-item @click="$go(`/catalog/product-${productPerk.product_id}`)" button detail="false" lines="none">
                <ion-thumbnail slot="start">
                  <ion-img v-if="productPerk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +productPerk.image_hash +'.100.100.webp'}`" style="border-radius:10px" />
                </ion-thumbnail>
                <ion-text>{{ productPerk.perk_title }}</ion-text>
                <ion-text slot="end"><ion-chip color="success" outline><b>{{ productPerk.perk_label }}</b></ion-chip></ion-text>
              </ion-item>
            </swiper-slide>
          </swiper>
      </ion-card>
    </ion-list>

    <ion-card v-if="!suggestFormHidden">
      <ion-card-header>
        <ion-card-subtitle>Не нашли то, что искали?</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-input v-model="storeSuggestion" label="" helperText="маркет, магазин, кафе, ресторан, аптека" placeholder="ваше предложение"/>
        <ion-button expand="block" @click="suggestFormSend()" color="light">отправить</ion-button>
      </ion-card-content>
    </ion-card>
  </div>
  <ion-item lines="none" v-if="hiddenCount>0" style="margin-top: 30px; color:#ddd">
    <ion-note>
      Количество продавцов, находящихся за пределами радиуса доставки, скрытых из результатов <b>{{hiddenCount}}</b>
    </ion-note>
  </ion-item>
</template>

<script>
import {
  IonList,
  IonImg,
  IonChip,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonSkeletonText,
  IonThumbnail,
  IonText,
  IonInput,
  IonButton,
  IonNote,
}                   from "@ionic/vue";
import {  
  timeOutline, 
  searchOutline
 }                  from 'ionicons/icons'
 
import { 
  Navigation, 
  Autoplay 
}                   from 'swiper';
import { 
  Swiper,
  SwiperSlide 
 }                  from 'swiper/vue';
import heap         from "@/heap";
import Utils        from '@/scripts/Utils.js'
import StoreOpenedIndicator from '@/components/StoreOpenedIndicator.vue';

export default {
  components: {
    Swiper,
    SwiperSlide,
    StoreOpenedIndicator,
    IonList,
    IonImg,
    IonChip,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonSkeletonText,
    IonThumbnail,
    IonText,
    IonInput,
    IonButton,
    IonNote,
  },
  setup(){
      return {
        modules: [Autoplay,Navigation],
        timeOutline,
        searchOutline
      }
  },
  data() {
    return {
      storeList: null,
      can_reload_at:0,
      loadedLocation:{},
      hiddenCount:null,
      out:{},
      outofrangeFormHidden:0,
      storeSuggestion:null,
      suggestFormHidden:0,
    };
  },
  computed: {
    store_perks () {
      return this.storeList.map(function(store) {
        return store.perks.filter(perk => perk.slot == 'perk')
      });
    },
    store_perks_slider () {
      return this.storeList.map(function(store) {
        return store.perks.filter(perk => perk.slot == 'slider')
      });
    },
    showndelivery_address(){
      if( this.$heap.state.user.location_main.is_default!=1 ){
        return this.$heap.state.user.location_main.location_address
      }
      return this.$heap.state.user.location_current?.location_address
    }
  },
  methods: {
    async listNearReload(){
      this.listNearGet(this.$heap.state.user.location_current??this.$heap.state.user.location_main);
    },
    async listNearGet(loc) {
      try{
        const location={
          location_id:loc.location_id,
          location_latitude:loc.location_latitude,
          location_longitude:loc.location_longitude,
          platform:getPlatforms()
        }
        let response
        response=await Utils.prePost(`${this.$heap.state.hostname}Store/listNearGet`, location)
        if(response){
          this.hiddenCount=response.hidden_count
          this.storeList=this.storeListCalculate(response.store_list)
        }
        response=await Utils.post(`${this.$heap.state.hostname}Store/listNearGet`, location)
        this.hiddenCount=response.hidden_count
        this.storeList=this.storeListCalculate(response.store_list)
      }catch{/** */}
    },
    storeListCalculate(found){
      for(let i in found){
        found[i].deliveryTime=Utils.deliveryTimeCalculate(found[i].distance,found[i].store_time_preparation)
      }
      return found
    },
    async outFormSend(){
      this.out.phone??=this.$heap.state.user?.user_phone
      this.out.address??=this.showndelivery_address
      try{
        const request={
          type:'outofrange',
          user_id:this.$heap.state.user?.user_id,
          from:this.out.phone,
          subject:this.out.address,
          body:this.out.comment
        }
        await Utils.post(`${this.$heap.state.hostname}Talk/inquiryCreate`, request)
        this.$flash("Заявка отправлена")
      }catch{/** */}
      this.outofrangeFormHidden=1
    },
    async suggestFormSend(){
      if(!this.storeSuggestion){
        this.$flash("Напишите что нам стоило бы добавить")
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
        this.$flash("Ваше предложение отправлено")
      }catch{/** */}
      this.suggestFormHidden=1
    },
  },
  mounted(){
    this.$topic.on('userMainLocationSet',loc=>this.listNearGet(loc))
    this.$topic.on('userCurrentLocationSet',loc=>this.listNearGet(loc))
    this.listNearGet(this.$heap.state.user.location_current??this.$heap.state.user.location_main);
  }
};
</script>

