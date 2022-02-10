<template>
    <ion-slides v-if="imageList"  pager="true" :options="slideOpts">
        <ion-slide v-for="image in imageList" :key="image.image_hash" style="max-height:50vh">
            <div :style="`width:100%;max-height:${maxHeight|200}px;overflow:hidden;display:flex;align-items:center`">
                <ion-img  style="width:100%" :src="`${$store.state.hostname}image/get.php/${image.image_hash}.${imgWidth|300}.${imgHeight|300}.webp`"/>
            </div>
        </ion-slide>
    </ion-slides>
</template>

<script>
import { IonSlides, IonSlide } from '@ionic/vue';

export default{
    components: { IonSlides, IonSlide },
    props: ['imageList','imgHeight','imgWidth','maxHeight'],
    setup() {
        const slideOpts = {  
            slidesPerView: 1,
            centeredSlides: true, 
            initialSlide: 0,
            speed: 400,
            grabCursor: true,
            touchStartForcePreventDefault: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        };
        return { slideOpts }
    }
};
</script>