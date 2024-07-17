<style scoped>
.promo-counter-container{
  position: relative;
}


@media screen and (min-width: 740px) {
  
}

</style>

<template>
  <div class="promo-counter-container">
    
    <ion-list lines="none">
      <ion-item :button="true" detail="false"  @click="popoverOpen = 1">
        <ion-icon  slot="start"></ion-icon>
        <ion-label>
          <strong>Доступные скидки: {{ promoList.length }}</strong><br />
          <ion-text>На общую сумму: {{ totalSum }}р.</ion-text>
        </ion-label>
      </ion-item>
    </ion-list>
    <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false">
      <ion-content>
        <ion-list lines="none">
            <ion-item :detail="false" v-for="(promo, promoIndex) in promoList" :key="promoIndex" @click="popoverOpen = false"  >
                <ion-label>{{ promo.promo_name }}</ion-label> 
            </ion-item>
        </ion-list>
      </ion-content>
    </ion-popover>
  </div>
</template>

<script>

import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonText,
  IonPopover,
  IonContent
}                   from "@ionic/vue";
import {  
  chevronBackOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'

import heap         from "@/heap";
import Utils        from '@/scripts/Utils.js'

export default {
  components: {
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonText,
    IonPopover,
    IonContent
  },
  computed: {
    user () {
      return heap.state.user
    }
  },
  data() {
    return {
      popoverOpen: false,
      totalSum: 0,
      promoList: []
    };
  },
  methods: {
    async listGet() {
      try{
        this.$emit('isloading', true)
        let response
        response=await Utils.prePost(`${heap.state.hostname}Promo/listGet`, {user_id: this.$heap.state.user.user_id, type:	"active"})
        response=await Utils.post(`${heap.state.hostname}Promo/listGet`, {user_id: this.$heap.state.user.user_id, type:	"active"})
        this.filterList(response)
      }catch{  this.$emit('isloading', false) }
    },
    filterList(promoList){
      this.promoList = promoList.filter((el) => { return el.is_used == '0' && el.is_disabled == '0' })
      this.totalSum = this.promoList.reduce((accum, promo) => accum + promo.promo_value*1,  0, );
      console.log(this.totalSum)
    }
  },
  watch:{
    'user'(){
      this.listGet();
    }
  }
};
</script>

