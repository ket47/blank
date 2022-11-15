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
</style>
<template>
    <swiper id="hcat_widget_grid"
        :slides-per-view="3"
        :space-between="0"
    >
        <swiper-slide v-for="group in groupList" :key="group.group_id"  @click="() => {return onClick(group.group_id)}">
            <ion-thumbnail style="width:70px;height:70px">
                <ion-img style="border-radius:10px;border:1px solid #ddd" :src="`${$heap.state.hostname}image/get.php/${group.image_hash}.150.150.webp`"/>
            </ion-thumbnail>
            <div style="height:2.5em;text-align:center;overflow:hidden;width:115px; font-size: 12px; padding: 8px 0">{{group.group_name}}</div>
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