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

  <div v-else-if="storeList.length==0">
    <ion-card color1="warning">
      <ion-card-header>
        <ion-card-title>Вне зоны обслуживания</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        Поблизости к адресу <b style="color:var(--ion-color-primary)">{{ outofrange_address??'доставки заказа' }}</b>, который вы выбрали, пока нет подходящих ресторанов и магазинов.
        <br/><br/>

        Мы постоянно работаем над увеличением количества продавцов в нашем маркетплейсе.
      </ion-card-content>
    </ion-card>

    <ion-card v-if="!outofrangeFormHidden">
      <ion-card-header>
        <ion-card-subtitle> Заполните форму и мы уведомим вас, когда появится ресторан или магазин поблизости.</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>

        <ion-input v-model="out.phone" label="Номер телефона" label-placement="floating" fill="outline" :value="$heap.state.user?.user_phone"/>
        <br/>
        <ion-input v-model="out.address" label="Желаемый адрес"  label-placement="floating" fill="outline"  :value="outofrange_address"/>
        <br/>
        <ion-input v-model="out.comment" label="Ваш комментарий"  label-placement="floating" fill="outline"/>

        <ion-button expand="block" @click="outFormSend()">отправить заявку</ion-button>
      </ion-card-content>
    </ion-card>

    <ion-item button @click="$go('/page/supplier-guide')">
      Хотите стать продавцом? Узнайте о преимуществах.
    </ion-item>
    


  </div>

  
  <ion-grid  v-if="storeList && storeList.length>0" class="ion-justify-content-between ion-align-items-center" style="padding: 0 16px;">
    <ion-row>
      <ion-col size="10">
        <h5 class="section-title">Магазины и рестораны</h5>
      </ion-col>
      <ion-col  size="2" class="ion-align-self-end" @click="$router.push('/search')">
        <ion-icon style="font-size: 20px;" :icon="searchOutline"/>
      </ion-col>
    </ion-row>
  </ion-grid>
  <ion-list v-if="storeList && storeList.length > 0" class="store-list">
    <ion-card style="position:relative;height:fit-content" v-for="(store_item, store_index) in storeList"  :key="store_item.store_id"  :class="store_item.is_opened==0?'closed':''">
      <router-link :to="`/catalog/store-${store_item.store_id}`">
        <div class="crop-to-fit" style="height: 180px">
            <ion-img v-if="store_item.image_hash" :src="$heap.state.hostname +'/image/get.php/' +store_item.image_hash +'.500.500.webp'"/>
        </div>
      </router-link>
      <div 
        v-if="store_perks[store_index].length > 0" 
        class="perk-row" 
         :style="`width:${store_perks[store_index].length*50}px`">
        <span v-for="perk in store_perks[store_index]" :key="perk.image_hash" class="perk" >
          <ion-img v-if="perk.image_hash" :src="`${$heap.state.hostname +'/image/get.php/' +perk.image_hash +'.80.80.png'}`"/>
          <ion-img v-else :src="`/img/perks/${perk.image_url}`"/>
        </span>
      </div>
        
      <router-link :to="`/catalog/store-${store_item.store_id}`" style="text-decoration: none">
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
      </router-link>

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


  <ion-card v-if="hiddenCount>0">
    <ion-card-content>
      Количество продавцов, находящихся за пределами радиуса доставки, скрытых из результатов <b>{{hiddenCount}}</b>
    </ion-card-content>
  </ion-card>
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
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
  IonThumbnail,
  IonText,
  IonInput,
  IonButton,
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
import jQuery       from "jquery";
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
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
  IonThumbnail,
  IonText,
  IonInput,
  IonButton,
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
      outofrangeFormHidden:0,
      out:{
      },
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
    outofrange_address(){
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
          location_longitude:loc.location_longitude,
        }
        let response
        response=await Utils.prePost(`${heap.state.hostname}Store/listNearGet`, location)
        if(response){
          this.hiddenCount=response.hidden_count
          this.storeList=this.storeListCalculate(response.store_list)
        }
        response=await Utils.post(`${heap.state.hostname}Store/listNearGet`, location)
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
      this.out.address??=this.outofrange_address
      try{
        const request={
          type:'outofrange',
          user_id:this.$heap.state.user?.user_id,
          from:this.out.phone,
          subject:this.out.address,
          body:this.out.comment
        }
        await Utils.post(`${heap.state.hostname}Talk/inquiryCreate`, request)
        this.$flash("Заявка отправлена")
      }catch{/** */}
      this.outofrangeFormHidden=1
    }
  },
  mounted(){
    this.$topic.on('userMainLocationSet',loc=>this.listNearGet(loc))
    this.$topic.on('userCurrentLocationSet',loc=>this.listNearGet(loc))
    this.listNearGet(heap.state.user.location_current??heap.state.user.location_main);
  }
};
</script>

