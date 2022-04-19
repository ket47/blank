
<style scoped>
.product_list_widget_grid {
    display: grid;
    gap:6px;
    grid-template-columns: 1fr 1fr;
    font-size: 0.8em;
}
.product_list_item_img{
    border-radius: 10px;
    border: 2px solid #fff;
    width:100px;
    height:100px;
    overflow:hidden;
    align-items: center;
    display:flex;
}
@media screen and (min-width: 360px) {
    .product_list_widget_grid {
        grid-template-columns: 1fr 1fr 1fr;
    }
    .product_list_item_img{
        width:100px;
        height:100px;
    }
}
@media screen and (min-width: 620px) {
    .product_list_widget_grid {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    .product_list_item_img{
        width:150px;
        height:150px;
    }
}
@media screen and (min-width: 1000px) {
    .product_list_widget_grid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}
.product_list_widget_grid>div{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.product_list_widget_grid .absent{
    filter:grayscale(1);
    opacity: 0.5;
}

.product_list_widget_grid .incart .product_list_item_img{

    border: 2px solid var(--ion-color-primary);
}






.product-item {
  visibility: visible;
  user-select: none;
}
.product-item ion-card-header {
  border: 1px solid transparent;
}
.product-item.product-item-selected ion-card-header {
  border: 1px solid var(--ion-color-primary);
  border-radius: 15px;
}
ion-card {
  text-align: center;
}
.link {
  text-decoration: none;
  color: var(--ion-text-main);
}
ion-card-header {
  padding: 10px 0px;
  text-align: center;
}
ion-card-content {
  padding: 10px 0px;
  text-align: center;
}
ion-img{
    width:auto;
    min-width:100%;
}
</style>
<template>
    <div class="product_list_widget_grid">
        <div 
            v-for="productItem in productList" 
            :key="productItem.product_id" 
            :class="productItem.product_quantity>0?'':'absent'"
            :id="`product_list_item${productItem.product_id}`"
        >                
            <div style="" class="product_list_item_img">
                <div style="position:relative;top:-50%;">
                    <cart-add-buttons buttonLayout="vertical" :productItem="productItem"></cart-add-buttons>
                </div>
                <router-link class="link" :to="'product-' + productItem.product_id">
                    <ion-img v-if="productItem.image_hash" :src="$heap.state.hostname +'/image/get.php/' +productItem.image_hash +'.150.150.jpg'"/>
                </router-link>
            </div>
            <div style="height:50px;">
                <router-link class="link" :to="'product-' + productItem.product_id">
                    <span v-if="productItem.product_price!=productItem.product_final_price" style="color:var(--ion-color-danger)">
                        <s>{{productItem.product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
                    </span>
                    <span style="color:var(--ion-color-primary)">
                        {{productItem.product_final_price}}{{$heap.state.currencySign}}
                    </span> / 
                    <span style="color:var(--ion-color-medium)">
                        {{productItem.product_unit}}
                    </span>
                    <div style="color:black;">{{ productItem.product_name }}</div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>

import CartAddButtons from '../components/CartAddButtons';

export default {
    props: ['productList', 'onClick'],
    components: { 
        CartAddButtons
    }
};
</script>