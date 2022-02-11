<style scoped>
  textarea{
    width:100%;
    background-color: #ffffff99;
    border:1px solid;
    border-color:var(--ion-color-primary);
  }
</style>

<template>
    <textarea v-model="comment" placeholder="Заметка для продавца" rows="3"></textarea>
</template>

<script>
export default{
  inject:["$Order"],
  props:['productId'],
  data(){
    return {
      comment:''
      };
  },
  mounted(){
      let productInCart=this.$Order.cart.entryGet(this.productId);
      if( !productInCart || !productInCart.data.entry_quantity ){
        this.comment='';
        return;
      }
      this.comment=productInCart.data.entry_comment||'';
  },
  watch:{
    comment(){
      this.commentUpdate();
    }
  },
  methods:{
    commentUpdate(){
      let entry={
        product_id:this.productId,
        entry_comment:this.comment
      };
      let self=this;
      clearTimeout(self.clock);
      self.clock=setTimeout(()=>{
        self.$Order.cart.entryUpdate(entry);
      },500);
    }
  }
}
</script>