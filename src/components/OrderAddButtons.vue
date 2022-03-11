<style scoped>
  .product-actions{
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    left: 0;
    top: 0;

    background-color: var(--ion-color-light);
    border-radius: 10px;
    box-shadow: 1px 1px 5px #00000036;
    width: auto;
    transition: all .3s ease;
    font-weight: bold;
  }
  .product-actions ion-label{
    cursor:pointer;
    width: 2.5em;
    text-align: center;
  }
  .product-actions ion-label:hover{
    background-color:var(--ion-color-primary-tint);
    border-radius: 5px;
  }
  .product-actions.horizontal{
    flex-flow: row-reverse;
  }
  .incart{
    border:1px solid var(--ion-color-primary);
  }
  .sold{
    display: none;
  }

</style>

<template>
    <div :class="`product-actions ${buttonLayout} ${productQuantityInCart>0?'incart':''} ${productItem.product_quantity>0?'':'sold'}`">
      
      <ion-button v-if="!productQuantityInCart" @click="addToCart(+productQtyStep)" size="small" color="primary">
        <ion-icon :icon="add" color="light"></ion-icon>
      </ion-button>
      
      <ion-button v-if="productQuantityInCart>0" @click="addToCart(+productQtyStep)" size="small" color="light">
        <ion-icon :icon="add" color="primary"></ion-icon>
      </ion-button>
      <ion-label v-if="productQuantityInCart>0" color="primary" @click="setInCart()">{{ productQuantityInCart }}</ion-label>
      <ion-button v-if="productQuantityInCart>0" @click="addToCart(-productQtyStep)" size="small" color="light">
        <ion-icon :icon="remove" v-if="productQuantityInCart>productQtyStep" color="primary"></ion-icon>
        <ion-icon :icon="trash" v-if="productQuantityInCart==productQtyStep" color="primary"></ion-icon>
      </ion-button>
    </div>
</template>

<script>
import { add, remove, trash, cart } from 'ionicons/icons';
import { toastController } from '@ionic/vue';
export default{
  inject:["$Order"],
  props:['productId','productItem','productQtyStep','buttonLayout'],
  setup() {
    return {
      add,
      remove,
      trash,
      cart
    }
  },
  data() {
    let productQuantityInCart=this.$Order.cart.entryQuantityGet(this.productId);
    return { 
      productQuantityInCart,
      clock:null
    };
  },
  mounted(){
    this.productListItemHighlight();
  },
  methods:{
    productListItemHighlight(){
      let product_list_item=document.getElementById(`product_list_item${this.productItem.product_id}`);
      if(!product_list_item){
        return;
      }
      if(this.productQuantityInCart){
        product_list_item.classList.add("incart");
      } else {
        product_list_item.classList.remove("incart");
      }
      
    },
    addToCart(step){
      let newQuantity=this.productQuantityInCart*1+step*1;
      if( !this.productItem || (this.productQuantityInCart+step<0) ){
        return;//haven't loaded yet or qty is negative
      }
      return this.updateCart(newQuantity);
    },
    setInCart(){
      let newQuantity=parseFloat( prompt("Введите количество",this.productQuantityInCart) );
      if(newQuantity==null || isNaN(newQuantity)){
        return;
      }
      return this.updateCart(newQuantity);
    },
    updateCart(newQuantity){
      if(this.productItem && newQuantity>=0){
        let product_quantity_min=this.productItem.product_quantity_min||1;
        newQuantity=product_quantity_min*Math.round(newQuantity/product_quantity_min);

        if( this.productItem.is_produced==0 && newQuantity>this.productItem.product_quantity ){
          this.flash(`В наличии есть только ${this.productItem.product_quantity}${this.productItem.product_unit}`);
          newQuantity=this.productItem.product_quantity;
        }
        let store_id=this.productItem.store_id;
        let product_id=this.productItem.product_id;
        let entry={
          product_id,
          entry_quantity:newQuantity,
          entry_price:this.productItem.product_final_price,
          product_name:this.productItem.product_name,
          product_unit:this.productItem.product_unit,
        };
        this.productQuantityInCart=newQuantity;
        this.productListItemHighlight();

        let self=this;
        clearTimeout(self.clock);
        self.clock=setTimeout(()=>{
          self.$Order.cart.entrySave(store_id,entry);
        },500);
        return true;
      }
      return false;
    },
    async flash( message ) {
      const toast = await toastController
        .create({
          message: message,
          duration: 2000,
          color:'dark'
        })
      return toast.present();
    },
  }
}
</script>