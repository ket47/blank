<style scoped>
.promo-counter-container{
  position: relative;
  background: var(--ion-color-light);
  display: grid;
  align-items: center;
  margin: 5px; 
  border-radius: 10px; 
  min-width: 320px;
  width: 50%;
  white-space: initial;
}
.promo-crystal-container{
  position: relative;
  background: #23b94f;
  display: grid;
  color: white;
  align-items: center;
  margin: 5px; 
  border-radius: 10px; 
  min-width: 320px;
  width: 50%;
  white-space: initial;
  animation: blinkColor 1.5s ease infinite alternate;
}
.promo-crystal-container ion-label{

  text-shadow: 0px 1px 3px #00000078;
}
.promo-crystal-container img{
  filter: drop-shadow(0px 1px 2px #0000008c);
}
@keyframes blinkColor {
    0%{
        background: #238eb9;
    }
    100%{
        background: #23b94f;
    }
}



</style>

<template>
  <div v-if="promoList.length > 0" class="promo-counter-container">
    <ion-list v-if="lastPromo.expired_at" style="background: transparent;">
        <ion-item  color="transparent" lines="none" button detail="true" :detailIcon="chevronForwardOutline" @click="$go(`/user/user-promo`)">
          <img slot="start" src="/img/discount_box.png" width="60"/>
          <ion-label class="ion-no-margin">
            <strong>У вас есть скидка 🔥 {{lastPromo.promo_value}}{{ $heap.state.currencySign }}</strong>
            <p style="font-size: 12px; line-height: 16px; margin-top: 5px;">Успейте воспользоваться, времени мало:</p>
          </ion-label>
        </ion-item>
      <ion-item  color="transparent" lines="none">
        <div style="margin: 0 auto">
          <FlipCountdown  :deadline="lastPromo.expired_at" />
        </div>
      </ion-item>
    </ion-list>
    <div v-else>
      <ion-item  color="transparent" lines="none" >
        <ion-label class="ion-no-margin">
          <strong><ion-skeleton-text :animated="true" style="width: 120px"></ion-skeleton-text></strong>
          <p style="font-size: 12px"><ion-skeleton-text :animated="true" style="width: 190px"></ion-skeleton-text></p>
        </ion-label>
      </ion-item>
    </div>
  </div>
  <div v-else  class="promo-crystal-container" >
    <ion-item  color="transparent" lines="none" button detail="true" :detailIcon="chevronForwardOutline"  @click="$go('/user/user-promo')">
      <img slot="start" src="/img/crystal.png" width="60"/>
      <ion-label class="ion-no-margin">
        <h4><b>Нужны скидки?</b></h4>
        <p style="font-size: 12px">Собирайте <b>изумруды</b> и используйте их в заказах!</p>
      </ion-label>
    </ion-item>
  </div>

</template>

<script>

import {
  IonList,
  IonLabel,
  IonItem,
  IonSkeletonText
}  from "@ionic/vue";


import {  
  chevronBackOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'


import FlipCountdown from "@/components/FlipCountdown";

import heap         from "@/heap";
import Utils        from '@/scripts/Utils.js'

export default {
  components: {
    IonList,
    IonLabel,
    IonItem,
    IonSkeletonText,
    FlipCountdown
  },
  computed: {
    user () {
      return heap.state.user
    }
  },
  setup(){
    return {
      chevronBackOutline,
      chevronForwardOutline
    }
  },
  data() {
    return {
      isLoading: false,
      popoverOpen: false,
      totalSum: 0,
      promoList: [],
      lastPromo: {},
      last_loaded_user_id:0
    };
  },
  methods: {
    async listGet() {
      try{
        if(this.$heap.state.user.user_id == -1 || this.$heap.state.user.user_id==this.last_loaded_user_id){
          return false
        }
        this.isLoading = true
        this.last_loaded_user_id=this.$heap.state.user.user_id

        this.$emit('isloading', true)
        let response
        response=await Utils.prePost(`${heap.state.hostname}Promo/listGet`, {user_id: this.$heap.state.user.user_id, type:	"active"})
        response=await Utils.post(`${heap.state.hostname}Promo/listGet`, {user_id: this.$heap.state.user.user_id, type:	"active"})
        this.filterList(response)
        this.setLastPromo()
        this.isLoading = false
      }catch{  this.$emit('isloading', false) }
    },
    filterList(promoList){
      this.promoList = promoList.filter((el) => { return el.is_used == '0' && el.is_disabled == '0' })
      this.totalSum = this.promoList.reduce((accum, promo) => accum + promo.promo_value*1,  0, );
    },
    setLastPromo(){
      this.lastPromo = this.promoList.reduce((last, promo) => new Date(last.expired_at).getTime() > new Date(promo.expired_at).getTime() ? last : promo);
    }
  },
  watch:{
    'user'(){
      this.listGet();
    }
  },
  mounted() {
    this.listGet();
  }
};
</script>


