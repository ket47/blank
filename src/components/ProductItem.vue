<style scoped>
.product_item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.absent{
    filter:grayscale(1);
    opacity: 0.5;
}
.incart .product_list_item_img{
    border: 2px solid var(--ion-color-primary);
}
.product_list_item_img{
    border-radius: 10px;
    border: 2px solid var(--ion-color-light);
    width:150px;
    height:150px;
    overflow:hidden;
    align-items: center;
    justify-content: center;
    display:flex;
    position: relative;
}
.product_list_item_img .blur-image{
    height: 100%;
    position: absolute;
    z-index: -1;
    filter: blur(2px);
}
.deleted .product_list_item_img{
    border: 4px solid red;
}
.disabled .product_list_item_img{
    border: 4px solid #666;
}
</style>
<template>
    <div :class="item_class" :id="`product_list_item${productItem.product_id}`"
        >
        <div class="product_list_item_img">
            <div style="position:relative;top:-50%;">
                <cart-add-buttons buttonLayout="vertical" :productItem="productItem"></cart-add-buttons>
            </div> 
            <img class="blur-image" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.200.200.webp`"/>
            <ion-img @click="$router.push(`/catalog/product-${productItem.product_id}`)" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.200.200.webp`"/>
        </div>
        <div style="height:5em;overflow:hidden">
            <div style="color:black;height:3em;font-size:1em;overflow:hidden;line-height:1.4em; font-weight: bold;" @click="$router.push(`product-${productItem.product_id}`)">
                {{ productItem.product_name }}
            </div>
            
                <span v-if="productItem.product_price!=productItem.product_final_price" style="color:var(--ion-color-danger)">
                    <s>{{productItem.product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
                </span>
                <span style="color:var(--ion-color-primary)">
                    <b style="font-weight: bold; margin: 0; font-size: 1.4em">{{productItem.product_final_price}}</b>
                    <b style="font-weight: bold; margin: 0; font-size: 1.2em">{{$heap.state.currencySign}}</b>
                </span>
             / 
                <span style="color:var(--ion-color-medium)">
                    {{productItem.product_unit}}
                </span>
        </div>
    </div>
</template>
<script>
import {
  IonImg,
}                       from '@ionic/vue'
import CartAddButtons from '@/components/CartAddButtons';
export default {
    components:{
    IonImg,
    CartAddButtons
    },
    props:['productItem'],
    computed:{
        item_class(){
            if(this.productItem.deleted_at){
                return 'deleted'
            }
            if(this.productItem.disabled==1){
                return 'disabled'
            }
            if(this.productItem.is_counted==1 && (this.productItem.product_quantity-this.productItem.product_quantity_reserved)<1){
                return 'absent'
            }
            return ''
        }
    }
}
</script>