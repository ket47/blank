<style scoped>
.is_main{
    font-weight: bold;
}
</style>
<template>
  <base-layout page-title="Мои адреса" ref="UserAddressPage">
        <ion-card v-if="mainAddress">
          <ion-card-header>
            <ion-card-subtitle>
              Адрес доставки заказа
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>Вы выбрали <b style="color:var(--ion-color-primary)">{{mainAddress.location_address}}</b>, как адрес доставки заказов.</p>
            <p>Вы сможете заказать из ресторанов и магазинов в пределах радиуса доставки.</p>
          </ion-card-content>
        </ion-card>
        <ion-card v-else>
          <ion-card-header>
            <ion-card-subtitle>
              Адрес не установлен
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>Вы пока не добавили адрес доставки заказа.</p>
            <p>Для поиска ресторанов и магазинов будет использоваться адрес по умолчанию.</p>
          </ion-card-content>
        </ion-card>

        <ion-list v-if="locationList.length" lines="full">
          <ion-item v-for="(location,i) in locationList" :key="location.location_id">
              <ion-img slot="start" alt="location icon" :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.60.60.png`" style="height:24px" />
              <ion-label @click="locationSetMain(`${location.location_id}`,`${i}`)" style="white-space:normal;cursor:pointer;"  :class="location.is_main==1?'is_main':''">{{ location.location_address }}</ion-label>
              <ion-icon slot="end" :icon="trashOutline" @click="locationDelete(`${location.location_id}`,`${i}`)"></ion-icon>
          </ion-item>
        </ion-list>

        <ion-list>
          <ion-list-header>
            <ion-label>Добавить адрес</ion-label>
          </ion-list-header>
          <ion-item  v-for="location in locationGroupList" :key="location.group_id" @click="modalLocationCreate(`${location.group_id}`,`${location.group_name}`)" style="cursor:pointer">
              <ion-img :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.60.60.png`" style="height:24px"  slot="start"/>
              <ion-label>{{ location.group_name }}</ion-label>
              <ion-icon :src="addOutline" slot="end"/>
          </ion-item>
        </ion-list>
  </base-layout>
</template>


<script>
import {
  IonImg,
  IonLabel,
  IonItem,
  IonList,
  IonListHeader,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  modalController,
  loadingController,
}                         from "@ionic/vue";
import router             from '@/router';
import heap               from '@/heap';
import User               from '@/scripts/User.js'
import jQuery             from 'jquery';
import UserAddressPicker  from '@/components/UserAddressPicker.vue';

import { locationOutline,trashOutline,addOutline }          from 'ionicons/icons';


export default{
  name: 'UserAddresses',
  components: {
  IonImg,
  IonLabel,
  IonItem,
  IonList,
  IonListHeader,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  },
  setup(){
    return { locationOutline,trashOutline,addOutline };
  },
  mounted(){
    this.locationListGet();
  },
  computed:{
    mainAddress(){
      return this.locationList?.find(location=>location.is_main==1)
    }
  },
  methods:{
    async modalLocationCreate( location_group_id, location_group_name ) {
      if(!heap.getters.userIsLogged){
        if( confirm('Чтобы добавленный адрес сохранился, необходимо авторизироваться') ){
          this.$go('/user/sign-in');
        }
        return;
      }
      var location_group_name_low=String(location_group_name).toLowerCase();
      const modal = await modalController.create({
        component: UserAddressPicker,
        showBackdrop:true,
        componentProps:{
          location_group_name_low
        },
      });
      modal.onDidDismiss().then(location => {
        this.locationCreate(location_group_id,location.data);
      });
      return modal.present();
    },
    async locationListGet(){
      try{
        let new_location_main=null
        const response=await jQuery.get(heap.state.hostname + "User/locationListGet",{includeGroupList:1})
        this.locationList=response.location_list;
        this.locationGroupList=response.location_group_list;
        if(this.locationList){
          for(let loc of this.locationList){
            if(loc.is_main!=1)continue;
              new_location_main=loc;
          }
        }
        if( !new_location_main ){
          /**
           * for some reason main location is not present so reload user data
           */
          User.get()
          return
        }
        if(new_location_main && new_location_main?.location_id!=heap.state.user.location_main?.location_id){
          heap.state.user.location_main=new_location_main
          this.$topic.publish('userMainLocationSet',heap.state.user.location_main)
        }
      }catch{/** */}
    },
    async locationCreate(group_id,location){
      if( !location ){
        return;
      }
      let request={
        location_holder:'user',
        location_holder_id:heap.state.user.user_id,
        location_group_id:group_id,
        location_address:location.location_address,
        location_latitude:location.location_latitude,
        location_longitude:location.location_longitude
      };
      try{
        await jQuery.post(heap.state.hostname + "User/locationCreate",request)
        if(this.$heap.state.next_route){
          this.$go(this.$heap.state.next_route)
          this.$heap.state.next_route=null
        }
        this.locationListGet();
      } catch(err){
        const exception=err.responseJSON;
        const exception_code=exception.messages.error;
        switch(exception_code){
            case 'limit_exeeded':
                this.$flash("Больше адресов добавить нельзя");
                break;
        }
        return false
      }
    },
    async locationSetMain( location_id, index ){
      var self=this;
      var loc=self.locationList[index];
      heap.state.user.location_main={
        location_id:loc.location_id,
        location_latitude:loc.location_latitude,
        location_longitude:loc.location_longitude,
        location_address:loc.location_address,
        image_hash:loc.image_hash
      };
      router.go(-1);
      await jQuery.post(heap.state.hostname + "User/locationSetMain",{location_id});
      this.$topic.publish('userMainLocationSet',heap.state.user.location_main)
    },
    async locationDelete( location_id, index ){
      if(!confirm("Удалить адрес доставки?")){
        return
      }
      try{
        this.locationList.splice(index,1);
        await jQuery.post(heap.state.hostname + "User/locationDelete",{location_id})
      }catch{/** */}
      this.locationListGet();
    },
    async locationCurrentSet(){
      const loading = await loadingController.create({
        message: 'Определяем ваше местоположение',
      });
      loading.present();
      try{
        await User.geo.locationCurrentGet()
        this.$flash("Ваше местоположение определено")
      } catch(err){
        this.$flash("Не удалось получить ваше местоположение")
      }
      loading.dismiss();
      router.go(-1)
    }
  },
  data(){
    return{
      locationList:[],
      locationGroupList:[]
    }
  }
}
</script>