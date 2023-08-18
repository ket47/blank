<style scoped>
  .product-actions{
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: space-between;

    border-radius: 10px;
    overflow: hidden;
    width: auto;
    transition: all 0.3s ease;
    font-weight: bold;

  }
  .product-actions  ion-button{
    box-shadow: none;
    height: 40px;
    -width:40px;
    --border-radius: 10px;
    --box-shadow: none;
    margin: 0px;
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
  .absolute{
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .incart{
    background-color:var(--ion-color-primary-tint);
  }
  .sold{
    display: none;
  }

</style>

<template>
    <div v-if="productData" :class="`product-actions ${componentLayout} ${buttonLayout} ${this.currentQuantity>0?'incart':''} ${isAvailable?'':'sold'}`">
      
      <ion-button v-if="!this.currentQuantity" @click="addToOrder(+this.productData.product_quantity_min)" color="primary" size="small">
        <span style="font-size:2em">+</span><!-- that is strange but improves chrome performance-->
      </ion-button>
      
      <ion-button v-if="this.currentQuantity>0" @click="addToOrder(+this.productData.product_quantity_min)" color="light" size="small">
        <ion-icon :icon="add" color="primary"></ion-icon>
      </ion-button>
      <ion-label v-if="this.currentQuantity>0" color="primary" size="small" @click="setInOrder()">{{ this.currentQuantity }}</ion-label>
      <ion-button v-if="this.currentQuantity>0" @click="addToOrder(-this.productData.product_quantity_min)" color="light" size="small">
        <ion-icon :icon="remove" v-if="this.currentQuantity>this.productData.product_quantity_min" color="primary"></ion-icon>
        <ion-icon :icon="trash" v-if="this.currentQuantity<=this.productData.product_quantity_min" color="primary"></ion-icon>
      </ion-button>
    </div>
</template>

<script>
import { 
  IonIcon,
  IonButton,
  IonLabel,

}                           from '@ionic/vue';
import { 
  add,
  remove,
  trash,
  cart 
}                           from 'ionicons/icons';
import heap                 from '@/heap';
export default{
  components:{
    IonIcon,
    IonButton,
    IonLabel,
  },
  inject:["$Order"],
  props:['productItem','entry','orderData','buttonLayout','display'],
  setup() {
    return {
      add,
      remove,
      trash,
      cart
    }
  },
  data() {
    return { 
      order_store_id:0,
      productData:null
    };
  },
  mounted(){
    this.propsCalculate()
    this.productListItemHighlight();
  },

  methods:{
    propsCalculate(){
      let order_store_id=0;
      let productData=(this.entry||this.productItem);
      productData.product_quantity_min= parseFloat(productData.product_quantity_min) || 1;

      if( this.productItem ){
        productData.entry_quantity=0;
        order_store_id=this.productItem.store_id;
      } else {
        order_store_id=this.orderData.order_store_id;
      }
      this.order_store_id=order_store_id;
      this.productData=productData;
    },
    productListItemHighlight(){
      const parent_product_id=this.productData?.parent_product_id||this.productData?.product_id
      let product_list_item=document.getElementById(`product_list_item${parent_product_id}`);
      if(!product_list_item){
        return;
      }
      if(this.currentQuantity){
        product_list_item.classList.add("incart");
      } else {
        product_list_item.classList.remove("incart");
      }
    },
    addToOrder(step){
      console.log(step)
      let newQuantity=parseFloat(this.currentQuantity)+parseFloat(step);
      if( !this.productItem && !this.entry ){
        return;//haven't loaded yet or qty is negative
      }
      if(this.currentQuantity+step<0){
        newQuantity=0;
      }
      if( newQuantity==0 && this.orderData?.order_id>0 && confirm("Удалить?")===false ){
          return;
      }
      return this.updateOrder(newQuantity);
    },
    setInOrder(){
      let newQuantity=parseFloat( prompt("Введите количество",this.currentQuantity) );
      if(newQuantity==null || isNaN(newQuantity)){
        return;
      }
      return this.updateOrder(newQuantity);
    },
    newQuantityCalculate(newQuantity){
      if( newQuantity<0 || !newQuantity ){
        newQuantity=0;
      }
      newQuantity=this.productData.product_quantity_min*Math.round(newQuantity/this.productData.product_quantity_min);
      if( this.productData.is_counted==1 ){
        let freeProductQuantity=this.productData.product_quantity-this.productData.product_quantity_reserved

        if(this.orderData?.order_stock_status=='reserved'){//if order at correction stage
          freeProductQuantity+=parseFloat(this.productData.entry_quantity)
        }
        if(newQuantity>freeProductQuantity){
          this.$flash(`В наличии есть только ${freeProductQuantity}${this.productData.product_unit}`);
          newQuantity=this.productData.product_quantity;
        }
      }
      return newQuantity
    },
    async updateOrder(newQuantity){
      newQuantity=this.newQuantityCalculate(newQuantity)
      let stock_product_quantity=this.productItem?this.productItem.product_quantity:this.productData.product_quantity;
      let entry_text=this.productData.entry_text
      if(this.productData.product_name){
        entry_text=this.productData.product_name+(this.productData.product_option?` [${this.productData.product_option}]`:'')
      }
      let entry={
        entry_id:this.productData.entry_id,
        product_id:this.productData.product_id,
        product_unit:this.productData.product_unit,
        product_quantity:stock_product_quantity,
        product_quantity_min:this.productData.product_quantity_min,
        is_counted:this.productData.is_counted,
        entry_quantity:newQuantity,
        entry_price:this.productData.product_final_price||this.productData.entry_price,
        entry_text:entry_text,
        image_hash:this.productData.image_hash||''
      };
      this.productData.entry_quantity=newQuantity;
      await this.$Order.doc.entrySave(this.order_store_id,entry,this.orderData);
      this.productListItemHighlight();
    },
  },
  computed:{
    currentQuantity(){
      if( this.productItem ){
        //If buttons are in storeview
        return Math.round(100*(heap.state.cartProductWatchList[this.productData.product_id]||0))/100;
      }
      //if buttons are in orderview or cartview
      return Math.round(100*this.productData.entry_quantity)/100;
    },
    componentLayout(){
      if(this.display=='inline'){
        return 'inline';
      }
      return 'absolute'
    },
    isAvailable(){
      if(this.productData.is_counted==1 && !this.productData.entry_quantity){
        return (this.productData.product_quantity-this.productData.product_quantity_reserved)>0
      }
      return true;
    }
  },
  watch:{
    'productItem':function(){
      this.propsCalculate()
    },
    'entry':function(){
      this.propsCalculate()
    },
  }
}
</script>