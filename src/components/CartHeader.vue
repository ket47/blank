<template>
  <ion-chip @click="openCartList()" color="dark">
    <ion-icon :icon="cart"></ion-icon>
    <ion-label>{{ cartListTotal }}{{$heap.state.currencySign}}</ion-label>
  </ion-chip>
</template>
 
<script>
import { cart }             from 'ionicons/icons';
import { modalController }  from '@ionic/vue';
import heap                 from '@/heap';
import router               from '@/router';
import CartBodyModal        from '@/components/CartBodyModal.vue';
import Topic                from '@/scripts/Topic.js';

export default{
  inject:["$Order"],
  setup() {
    return {
      cart
    }
  },
  computed:{
    cartListTotal(){
      let total=0;
      for(let i in heap.state.cartList){
        for(let k in heap.state.cartList[i].entries){
          let entry=heap.state.cartList[i].entries[k];
          if( !entry || !entry.entry_quantity || !entry.entry_price ){
            continue;
          }
          total+= (entry.entry_quantity) * (entry.entry_price);
        }
      }
      return total;
    }
  },
  mounted(){
    let self=this;
    setTimeout(function(){
      //self.openCartList();
    },2000);
    
  },
  methods:{
    goToCartList(){
      router.push({path: '/cart-list'});
    },
    async openCartList() {
      const modal = await modalController.create({component: CartBodyModal});
      const dismissFn=function(){
        modal.dismiss();
      };
      Topic.on('dismissModal',dismissFn);
      return modal.present();
    }
  }
};
</script>