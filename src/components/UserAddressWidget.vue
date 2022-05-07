<style scoped>
  .center{
    height: 100%;
    width: 100%;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    background-color: white;
    box-shadow: 5px 0px 5px #0003;
    display: flex;
    align-items: center;
  }
  .rightend{
    height: 100%;
    width:90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .selector{
    display: flex;
    background-color: var(--ion-color-secondary);
    height: 40px;
    box-shadow: 0px 0px 5px #ccc;
    -margin-bottom: 20px;
  }
  ion-img{
    height: 24px;
    margin: 7px;
  }
</style>

<template>
    <div v-if="isMainLocationSet" @click="selectDeliveryAddress()" class="selector">
      <div class="center">
        <ion-img v-if="location_main.image_hash" :src="$heap.state.hostname + 'image/get.php/'+location_main.image_hash+'.32.32.webp'"/>
        <ion-text style="margin:5px" color="primary">{{$heap.state.user?.location_main?.location_address}}</ion-text>
      </div>
      <div class="rightend" v-if="deliveryTime">
        <ion-text style="font-size:24px">{{deliveryTime.time}}</ion-text>
        <ion-note style="font-size:10px">мин</ion-note>
      </div>
      <div class="rightend" v-else></div>
    </div>

    <ion-item v-else detail button @click="selectDeliveryAddress()">
      <ion-icon
        slot="start"
        style="color: var(--ion-color-primary)"
        :icon="location"
      />
      <ion-label> Выбрать адрес доставки </ion-label>
    </ion-item>

    <ion-item v-if="showComment">
        <ion-textarea placeholder="комментарий к адресу" @change="locationCommentChanged()" v-model="$heap.state.user.location_main.location_comment"></ion-textarea>
    </ion-item>
</template>

<script>
import { IonIcon,IonTextarea }  from "@ionic/vue";
import { location }             from "ionicons/icons";
import heap                     from "@/heap";
import router                   from '@/router';
import Topic                    from '@/scripts/Topic.js'
import jQuery                   from 'jquery';

export default {
  props:['deliveryTime','showComment'],
  components: {
    IonIcon,IonTextarea
  },
  setup() {
    return { location };
  },
  data() {
    return {
      location_main: heap.state.user.location_main,
    };
  },
  created(){
    let self=this;
    Topic.on('userMainLocationSet',mainloc=>{
      self.location_main=mainloc
    })
  },
  methods: {
    selectDeliveryAddress() {
        router.push({name: 'UserAddresses'});
    },
    async locationCommentChanged(){
      const request={
        location_id:heap.state.user.location_main.location_id,
        location_comment:heap.state.user.location_main.location_comment
      };
      jQuery.post( this.$heap.state.hostname + "Location/itemUpdate", JSON.stringify(request) );
    }
  },
  computed: {
    isSignedIn() {
      return heap.state.user.user_id && heap.state.user.user_id > -1;
    },
    isMainLocationSet(){
        return this.location_main?1:0;
    }
  },
};
</script>