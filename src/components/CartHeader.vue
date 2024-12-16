<style scoped>
  .activecart{
    background-color: var(--ion-color-primary);
    transition: 1s;
  }
  .activecart ion-icon{
    font-weight: bold;
    color: white;
  }
  .activecart ion-label{
    font-weight: bold; color: white;
  }
</style>
<template>
  <ion-chip @click="openCartList()" color="dark" v-if="cartListTotal" :class="currentClass">
    <ion-icon :icon="cart"></ion-icon>
    <ion-label>{{ cartListTotal }}{{$heap.state.currencySign}}</ion-label>
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
  data(){
    return {
      currentClass:'activecart'
    }
  },
  mounted(){
    this.$topic.on('cartOpen',()=>{
      if(this.$heap.state.cart_is_open==1){
        return
      }
      this.$heap.state.cart_is_open=1
      this.openCartList()
    })
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
      modal.present();
      await modal.onDidDismiss();
      this.$heap.state.cart_is_open=0
    }
  },
  watch:{
    cartListTotal(){
      this.currentClass='';
      setTimeout(()=>{this.currentClass='activecart'},300)
    }
  }
};
</script>