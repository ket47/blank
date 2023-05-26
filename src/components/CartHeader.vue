<template>
  <ion-chip @click="openCartList()" color="dark" v-if="cartListTotal" style="background-color: var(--ion-color-primary);">
    <ion-icon :icon="cart" style="font-weight: bold; color: white;"></ion-icon>
    <ion-label style="font-weight: bold; color: white;">{{ cartListTotal }}{{$heap.state.currencySign}}</ion-label>
  </ion-chip>
</template>
 
<script>
import { cart }             from 'ionicons/icons';
import {
  IonIcon,
  IonLabel,
  IonChip,
  modalController
}                           from '@ionic/vue';
import router               from '@/router';
import CartBodyModal        from '@/components/CartBodyModal.vue';
import Topic                from '@/scripts/Topic.js';

export default{
  inject:["$Order"],
  components:{
    IonIcon,
    IonLabel,
    IonChip,
  },
  setup() {
    return {
      cart
    }
  },
  computed:{
    cartListTotal(){
      return this.$Order.cart.listTotalGet()
    }
  },
  methods:{
    goToCartList(){
      router.push({path: '/cart-list'});
    },
    async openCartList() {
      const presEl=document.querySelector('ion-router-outlet');
      const modal = await modalController.create({
        component: CartBodyModal,
        canDismiss:true,
        backdropDismiss:true,
        keyboardClose:true,
        presentingElement:presEl
      });
      const dismissFn=function(){
        modal.dismiss();
      };
      Topic.on('dismissModal',dismissFn);
      return modal.present();
    }
  }
};
</script>