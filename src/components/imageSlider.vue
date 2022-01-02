<template>
    <ion-slides v-if="imageList"  pager="true" :options="slideOpts">
        <ion-slide v-for="image in imageList" :key="image.image_hash">
            <div class="slide">
                <img  :src="$store.state.hostname + '/image/get.php/' + image.image_hash + '.950.950.webp'"/>
            </div>
        </ion-slide>
    </ion-slides>
</template>

<script>
import { IonSlides, IonSlide } from '@ionic/vue';

export default{
    components: { IonSlides, IonSlide },
    props: ['imageList'],
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

<style>


</style>