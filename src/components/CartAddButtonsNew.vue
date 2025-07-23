<style scoped>
  .product-actions{
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: 10px;
    overflow: hidden;
    width: auto;
    transition: all 0.3s ease;
    font-weight: bold;

    background-color:var(--ion-color-primary-tint);
  }
  .product-actions  ion-button{
    box-shadow: none;
    height: 40px;
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
  .product-actions.horizontal ion-button{
    flex: 1;
  }
  .product-actions.horizontal ion-label{
    flex: 2;
  }
  .absolute{
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .incart{
    
  }
  .sold{
    display: none;
  }

</style>

<template>
    <div v-if="productData"  :class="`product-actions ${componentLayout} ${buttonLayout} ${currentQuantity>0?'incart':''} ${isAvailable?'':'sold'}`">
      
      <ion-button v-if="!currentQuantity" @click="addToOrder(+productData.product_quantity_min)" color="primary" expand="block" size="small">
        <ion-icon :icon="add" slot="start"></ion-icon>
        <span v-if="buttonLayout=='horizontal'"> купить</span>
      </ion-button>
        <ion-button v-if="currentQuantity>0" @click="addToOrder(+productData.product_quantity_min)" color="light" size="small">
          <ion-icon :icon="add" color="primary"></ion-icon>
        </ion-button>
        <ion-label v-if="currentQuantity>0" color="primary" size="small" @click="setInOrder()">{{ currentQuantity }}</ion-label>
        <ion-button v-if="currentQuantity>0" @click="addToOrder(-productData.product_quantity_min)" color="light" size="small">
          <ion-icon :icon="remove" v-if="currentQuantity>productData.product_quantity_min" color="primary"></ion-icon>
          <ion-icon :icon="trash" v-if="currentQuantity<=productData.product_quantity_min" color="primary"></ion-icon>
        </ion-button>
    </div>
</template>

<script>
import { 
  IonIcon,
  IonButton,
  IonLabel,
  actionSheetController ,
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
      productData:null,
      isOptionSelectorOpen:0,
      optionSelectorList:[],
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
    async checkForOptions(){
      let options = this.productItem?.options
      if( !options ){
        return false
      }
      let i=1
      let optionSelectorList=[]
      for(let option of options){
        optionSelectorList.push({
          text: `${option.product_option} по цене ${option.product_final_price}${this.$heap.state.currencySign}`,
          data: option
        })
      }
      optionSelectorList.push({
        text: `Закрыть`,
        role: 'cancel',
      })

      const actionSheet = await actionSheetController.create({
        header: this.productData.product_name,
        subHeader:'выберите вариант',
        buttons: optionSelectorList
      });

      actionSheet.present();

      const {data} = await actionSheet.onDidDismiss()
      if(data?.product_id){
        this.productData.product_id=data.product_id
        this.productData.product_option=data.product_option
        this.productData.product_final_price=data.product_final_price
        return false
      }
      return true
    },
    async addToOrder(step){
      let currentQuantity=parseFloat(this.currentQuantity)
      let newQuantity=currentQuantity+parseFloat(step);
      if( !currentQuantity ){
        const is_option_canceled=await this.checkForOptions()
        if(is_option_canceled){
          return
        }
      }
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
      const isInCorrection=this.orderData?.order_stock_status=='reserved'?true:false
      const isInCart=!isInCorrection

      if(isInCart){
        /**
         * If we are in cart we need to round quantity to integer times minimal quantity
         */
        newQuantity=this.productData.product_quantity_min*Math.round(newQuantity/this.productData.product_quantity_min)
      }
      //console.log(newQuantity,newQuantity/this.productData.product_quantity_min,Math.round(newQuantity/this.productData.product_quantity_min))
      if( this.productData.is_counted==1 ){
        let freeProductQuantity=Math.round( 100*(this.productData.product_quantity-this.productData.product_quantity_reserved) )/100

        if(isInCorrection){//if order at correction stage
          freeProductQuantity+=parseFloat(this.productData.entry_quantity)
        }
        if(newQuantity>freeProductQuantity){
          this.$flash(`В наличии есть только ${freeProductQuantity}${this.productData.product_unit}`);
          newQuantity=Math.min(this.productData.product_quantity,freeProductQuantity)
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
      this.$emit('added',this.productData)
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