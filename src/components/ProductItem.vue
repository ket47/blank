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
    border: 2px solid var(--ion-color-primary) !important;
}
.product_list_item_img{
    border-radius: 10px;
    border: 2px solid var(--ion-color-light);
    width:125px;
    height:125px;
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
    filter: blur(5px);
}
.deleted .product_list_item_img{
    border: 4px solid red;
}
.disabled .product_list_item_img{
    border: 4px solid #666;
}
.promo .product_list_item_img{
    /** */
}
</style>
<template>
    <div :class="item_class" :id="`product_list_item${productItem.product_id}`">
        <div style="position:relative" v-if="productItem.options">
            <div class="product_list_item_img" style="position:absolute;border:#9ac solid 2px;top:-8px;left:8px;z-index:-1"></div>
            <div class="product_list_item_img" style="position:absolute;border:#cde solid 2px;top:-4px;left:4px;z-index:-1"></div>
        </div>
        <div class="product_list_item_img" :style="productItem.options?'border:#def solid 2px;':''">
            <div style="position:relative;top:-50%;" v-if="productItem.is_disabled=='0' && !productItem.deleted_at">
                <cart-add-buttons buttonLayout="vertical" :productItem="productItem"></cart-add-buttons>
            </div> 
            <ion-chip v-if="discount<0" style="position:absolute;right:0px;top:0px;background-color:var(--ion-color-success-tint)" outline color="success">{{discount}}%</ion-chip>
            <ion-img class="blur-image" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.200.200.webp`"/>
            <ion-img @click="$go(`/catalog/product-${productItem.product_id}`)" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.200.200.webp`"/>
            <ion-icon v-if="productItem.options" :src="layersOutline" color="primary" size="large" style="position:absolute;bottom:3px;right:3px"/>
        </div>
        <div style="height:5em;overflow:hidden">
            <div style="color:black;height:3em;font-size:1em;overflow:hidden;line-height:1.4em; font-weight: bold;" @click="$go(`/catalog/product-${productItem.product_id}`)">
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
            <span v-if="productItem.product_unit=='порция'" style="color:var(--ion-color-medium)">{{weight_in_gramms}}г</span>
            <span v-else-if="productItem.product_unit=='порция мл'" style="color:var(--ion-color-medium)">{{weight_in_gramms}}мл</span>
            <span v-else style="color:var(--ion-color-medium)">{{productItem.product_unit}}</span>
        </div>
    </div>
</template>
<script>
import {
  IonImg,
  IonIcon,
  IonChip,
}                       from '@ionic/vue'
import CartAddButtons   from '@/components/CartAddButtons';
import { 
  layersOutline
}                       from "ionicons/icons";
export default {
    components:{
        IonImg,
        IonIcon,
        IonChip,
        CartAddButtons,
    },
    props:['productItem'],
    setup(){
        return {layersOutline}
    },
    computed:{
        item_class(){
            if(this.productItem.deleted_at){
                return 'deleted'
            }
            if(this.productItem.product_final_price!=this.productItem.product_price){
                return 'promo'
            }
            if(this.productItem.is_disabled==1){
                return 'disabled'
            }
            if(this.productItem.is_counted==1 && (this.productItem.product_quantity-this.productItem.product_quantity_reserved)<1){
                return 'absent'
            }
            return ''
        },
        discount(){
            return Math.round(this.productItem.product_final_price/this.productItem.product_price*100-100)
        },
        weight_in_gramms(){
            return this.productItem.product_weight*1000
        }
    }
}
</script>