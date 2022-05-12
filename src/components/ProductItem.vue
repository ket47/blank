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
    width:130px;
    height:130px;
    overflow:hidden;
    align-items: center;
    display:flex;
}
</style>
<template>
    <div :class="productItem.product_quantity>0?'':'absent'" :id="`product_list_item${productItem.product_id}`"
        >
        <div class="product_list_item_img">
            <div style="position:relative;top:-50%;">
                <cart-add-buttons buttonLayout="vertical" :productItem="productItem"></cart-add-buttons>
            </div>
            <ion-img @click="$router.push(`product-${productItem.product_id}`)" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.150.150.webp`"/>
        </div>
        <div style="height:3.5em;overflow:hidden">
            <span v-if="productItem.product_price!=productItem.product_final_price" style="color:var(--ion-color-danger)">
                <s>{{productItem.product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
            </span>
            <span style="color:var(--ion-color-primary)">
                {{productItem.product_final_price}}{{$heap.state.currencySign}}
            </span> / 
            <span style="color:var(--ion-color-medium)">
                {{productItem.product_unit}}
            </span>
            <div style="color:black;" @click="$router.push(`product-${productItem.product_id}`)">{{ productItem.product_name }}</div>
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
    props:['productItem']
}
</script>