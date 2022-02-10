<style scoped>
</style>

<template>
    <ion-item lines="none" color="secondary" v-if="cartEntry">В корзине {{cartEntry.quantity}}{{cartEntry.unit}} на сумму {{cartEntry.sum}}{{$store.state.currencySign}}</ion-item>
    <ion-item lines="none" color="medium" v-else>Еще не заказан</ion-item>
</template>

<script>
export default{
  inject:["$Order"],
  props:['productId','productItem'],
  computed:{
    cartEntry(){
      let productInCart=this.$Order.cart.entryGet(this.productId);
      if( !productInCart || !productInCart.data.product_quantity ){
        return null;
      }
      let price=productInCart.data.product_price||0;
      let quantity=productInCart.data.product_quantity||0;
      let sum=Math.round(price*quantity*100)/100;
      return {
        quantity,
        sum:sum,
        unit:this.productItem.product_unit
      };
    }
  }
}
</script>