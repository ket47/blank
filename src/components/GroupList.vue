<style scoped>
#hcat_widget_grid {
    padding: 0 16px;
}
#hcat_widget_grid .swiper-slide{
    display: flex;
    flex-direction: column;
    -moz-box-align: center;
    align-items: center;
    -moz-box-pack: center;
    justify-content: center;
}
#hcat_widget_grid .swiper-slide .slide-title{
    text-align: center; 
    overflow: hidden; 
    width: 100%; 
    font-size: 11px; 
    padding: 8px 0px; 
    text-overflow: ellipsis; 
    white-space: nowrap;
}
</style>
<template>
    <swiper id="hcat_widget_grid"
        :slides-per-view="4.5"
        :space-between=10
    >
        <swiper-slide v-for="group in groupList" :key="group.group_id"  @click="() => {return onClick(group.group_id)}">
            <ion-thumbnail style="width:70px;height:70px">
                <ion-img style="border-radius:10px;border:1px solid #ddd" :src="`${$heap.state.hostname}image/get.php/${group.image_hash}.150.150.webp`"/>
            </ion-thumbnail>
            <div class="slide-title">{{group.group_name}}</div>
        </swiper-slide>
    </swiper>
    <div id="hcat_widget_grid">
    </div>
</template>

<script>
import { 
  IonImg,
  IonThumbnail,
}                          from "@ionic/vue";
import { defineComponent } from "@vue/runtime-core";
  import { Swiper, SwiperSlide } from 'swiper/vue';
export default defineComponent({
    components:{
        IonImg,
        IonThumbnail,
        Swiper,
        SwiperSlide
    },
    props: ['groupList', 'onClick']
})
</script>