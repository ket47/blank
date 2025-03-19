<style scoped>
  .address-description{
    font-size: 12px;
  }
  .center{
    display: flex;
    align-items: center;
    padding: 3px 16px;
    justify-content: left;
    font-size: 14px;
  }
  .center ion-icon{
    margin: 0 3px;
    font-size: 16px;
  }
  .center ion-icon[slot="start"]{
    margin-left: -2px;
  }
  .rightend{
    height: 100%;
    width:90px;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: space-between;
  }
  .selector{
    display: flex;
    margin: 5px 0;
  }
</style>

<template>
  <ion-list v-if="isMainLocationSet" @click="this.$heap.state.next_route='/catalog';selectDeliveryAddress()">
      <ion-item lines="none">
        <ion-thumbnail v-if="location_shown.image_hash" slot="start" style="width:30px;height:30px">
          <ion-img :src="`${$heap.state.hostname}/image/get.php/${location_shown.image_hash}.32.32.png`" />
        </ion-thumbnail>
        <ion-icon v-else slot="start" color="primary" :icon="locationOutline"/>
        <ion-label>
          <ion-text v-if="location_shown.group_name=='Current'" color="medium">Ваше местоположение</ion-text>
          <ion-text v-else color="medium">Адрес доставки заказа</ion-text>
          <br />
          <ion-note color="medium" class="ion-text-wrap">
            <ion-text color="dark" class="max-two-lines address-description">{{ location_shown?.location_address }}</ion-text>
            <ion-chip v-if="deliveryTime?.time>0" slot="end"  color="medium"  background="transparent">
              <ion-icon :src="timeOutline"/><label>{{deliveryTime.time}}</label>
            </ion-chip>
          </ion-note>
        </ion-label>
        <ion-icon slot="end" :icon="chevronDownOutline"/>
      </ion-item>
  </ion-list>
  <ion-list v-if="showComment && location_shown">
    <ion-item>
        <ion-textarea rows="1" placeholder="комментарий к адресу" @change="locationCommentChanged()" v-model="location_shown.location_comment"></ion-textarea>
    </ion-item>
  </ion-list>
  <ion-card v-if="location_shown?.is_default==1">
    <ion-card-header>
      <ion-card-title>
        Укажите адрес доставки
      </ion-card-title>
    </ion-card-header>
    <ion-card-content v-if="location_unconfirmed">
      <p>Ваш адрес определился как <span style="color:var(--ion-color-primary)"><b>{{location_unconfirmed.location_address}}</b></span>.</p>
      <!-- <p>Использовать его для поиска продавцов поблизости?</p> -->
      <ion-button expand="block" @click="confirmCurrentLocation()">Использовать адрес</ion-button>
    </ion-card-content>
    <ion-card-content v-else-if="isSignedIn">
      <p>Добавьте ваш адрес доставки</p>
      <ion-button expand="block" @click="this.$heap.state.next_route='/catalog';$go('/modal/user-addresses')">Добавить адрес</ion-button>
    </ion-card-content>
    <ion-card-content v-else>
      Зарегистрируйтесь и получите максимум от сервиса
      <ion-button expand="block" @click="this.$heap.state.next_route='/catalog';$go('/modal/user-authorize')">Регистрация</ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script>
import { 
  IonImg,
  IonIcon,
  IonTextarea,
  IonText,
  IonItem,
  IonList,
  IonThumbnail,
  IonChip,
  IonButton,

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonNote,
  IonLabel
}  from "@ionic/vue";

import { 
  locationOutline, 
  chevronDownOutline,
  timeOutline
}                               from "ionicons/icons";
import User                    from '@/scripts/User.js'
import jQuery                   from 'jquery';

export default {
  props:['deliveryTime','showComment'],
  components: {
      IonImg,
      IonIcon,
      IonTextarea,
      IonText,
      IonItem,
      IonList,
      IonThumbnail,
      IonChip,
      IonButton,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonNote,
      IonLabel
  },
  setup() {
    return { 
      locationOutline, 
      chevronDownOutline,
      timeOutline
    };
  },
  data() {
    return {
      location_shown: this.$heap.state.user.location_main,
      location_unconfirmed:null
    };
  },
  created(){
    this.$topic.on('userCurrentLocationFound',unconfirmedloc=>this.location_unconfirmed=unconfirmedloc)
    this.$topic.on('userMainLocationSet',mainloc=>this.location_shown=mainloc)
    this.$topic.on('userCurrentLocationSet',currloc=>this.location_shown=currloc)
  },
  methods: {
    confirmCurrentLocation(){
      User.geo.currentLocationSet(this.location_unconfirmed)
    },
    selectDeliveryAddress() {
        this.$go('/modal/user-addresses');
    },
    async locationCommentChanged(){
      const request={
        location_id:this.location_shown.location_id,
        location_comment:this.location_shown.location_comment
      };
      jQuery.post( this.$heap.state.hostname + "Location/itemUpdate", JSON.stringify(request) );
    }
  },
  computed: {
    isSignedIn() {
      return this.$heap.state.user.user_id && this.$heap.state.user.user_id > -1;
    },
    isMainLocationSet(){
        return this.location_shown?1:0;
    }
  },
};
</script>