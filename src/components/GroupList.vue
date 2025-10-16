<style scoped>
.product-categories {
    padding: 10px 16px 0;
    background: white;
    transform: translateY(0px);
    transition: 0.3s all ease;
}
.product-categories.is-sticky {
    top: 0;
    z-index: 100;
    position: sticky;
    transform: translateY(-70px);
    border-bottom: 1px solid var(--ion-color-light);
}
.product-categories .swiper-slide{
    display: flex;
    flex-direction: column;
    -moz-box-align: center;
    align-items: center;
    -moz-box-pack: center;
    justify-content: center;
}
.product-categories .swiper-slide a{
    color: var(--ion-color-dark);
    text-decoration: none !important;
}
.product-categories ion-thumbnail{
    transform: scaleY(1);
    transition: 0.3s all ease;
}
.product-categories.is-sticky ion-thumbnail{
    transform: scaleY(0);
}
.product-categories .swiper-slide .slide-title{
    text-align: center; 
    overflow: hidden; 
    width: 100%; 
    font-size: 11px; 
    margin: 8px 0px; 
    text-overflow: ellipsis;
    height: 2.2em;
}
.product-categories.is-sticky a .slide-title{
    height: auto;
    padding: 6px;
    margin-top: 0;
    border-radius: 16px;
}
.product-categories.is-sticky .swiper-slide a.is-active .slide-title{
    background-color: var(--ion-color-primary);
    color: white;
    font-weight: bold;
}
</style>
<template>
    <swiper :id="`productCategories${storeId}`" class="product-categories" :slides-per-view="'auto'" :space-between=10 ref="productCategoriesSwiper">
        <swiper-slide v-for="(group, index) in groupList" :key="group.group_id" style="width: 70px;">
            <a :data-target="`#group-${index}-${storeId}`" :class="(index == activeIndex) ? 'is-active' : ''" @click="onClick(index)">
                <ion-thumbnail style="width:70px;height:70px">
                    <ion-img v-if="group.image_hash" style="border-radius:10px;border:1px solid #ddd" :src="`${$heap.state.hostname}image/get.php/${group.image_hash}.150.150.webp`"/>
                </ion-thumbnail>
                <div class="slide-title">{{group.group_name}}</div>
            </a>
        </swiper-slide>
    </swiper>
</template>

<script>
import { 
  IonImg,
  IonThumbnail,
}                                   from "@ionic/vue";
import { defineComponent }          from "@vue/runtime-core";
import { Swiper, SwiperSlide }      from 'swiper/vue';
export default defineComponent({
    components:{
        IonImg,
        IonThumbnail,
        Swiper,
        SwiperSlide
    },
    props: ['groupList', 'onClick', 'activeIndex', 'storeId'],
    watch:{
        'activeIndex'(){
            this.$refs.productCategoriesSwiper.$el.swiper.slideTo(this.activeIndex)
        },
    }
})
</script>