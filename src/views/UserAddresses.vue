<template>
  <base-layout page-title="Мои адреса" page-default-back-link="/user-dashboard"  ref="UserAddressPage">
        <ion-list v-if="locationList.length" lines="full">
          <ion-item v-for="(location,i) in locationList" :key="location.location_id">
              <ion-img slot="start" :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.32.32.png`" />
              <ion-label @click="locationSetMain(`${location.location_id}`,`${i}`)" style="white-space:normal;cursor:pointer;">{{ location.location_address }}</ion-label>
              <ion-icon slot="end" :icon="trash" @click="locationDelete(`${location.location_id}`,`${i}`)"></ion-icon>
          </ion-item>
        </ion-list>
        <ion-card v-else color="warning">
          <ion-card-content>
          Пока адреса не добавлены
          </ion-card-content>
        </ion-card>

        <ion-list>
          <ion-list-header>
            <ion-label>Добавить адрес</ion-label>
          </ion-list-header>
          <ion-item  v-for="location in locationGroupList" :key="location.group_id" @click="modalLocationCreate(`${location.group_id}`,`${location.group_name}`)" style="cursor:pointer">
              <ion-img :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.32.32.png`" />
              <ion-label style="margin-left:5px;padding-left:5px;border-left:solid 1px black;white-space:normal">{{ location.group_name }}</ion-label>
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
  IonNote,
  IonListHeader,
  IonIcon,
  modalController,
  IonCard,
  IonCardContent,
}                         from "@ionic/vue";
import router             from '@/router';
import heap               from '@/heap';
import Topic              from '@/scripts/Topic.js'
import jQuery             from 'jquery';
import UserAddressPicker  from '@/components/UserAddressPicker.vue';

import { trash }          from 'ionicons/icons';

export default{
  name: 'UserAddresses',
  components: {
  IonImg,
  IonLabel,
  IonItem,
  IonList,
  IonNote,
  IonListHeader,
  IonIcon,
  IonCard,
  IonCardContent,
  },
  setup(){
    return { trash };
  },
  mounted(){
    this.locationListGet();
  },
  methods:{
    async modalLocationCreate( location_group_id, location_group_name ) {
      if(!heap.state.user.user_id){
        this.$flash('Чтобы добавленные адреса сохранились, пожалуйста войдите в систему');
        router.push({name: 'UserSignIn'});
        return;
      }
      var location_group_name_low=String(location_group_name).toLowerCase();
      const modal = await modalController.create({
        component: UserAddressPicker,
        showBackdrop:true,
        backdropDismiss:true,
        swipeToClose: true,
        cssClass: 'update-profile-modal',
        presentingElement: this.$refs.UserAddressPage.$el,
        componentProps:{
          location_group_name_low
        },
      });
      modal.onDidDismiss().then(location => {
        this.locationCreate(location_group_id,location.data);
      });
      return modal.present();
    },
    locationListGet(){
      var self=this;
      jQuery.get(heap.state.hostname + "User/locationListGet",{includeGroupList:1}).done(function(response){
        self.locationList=response.location_list;
        self.locationGroupList=response.location_group_list;
        if(self.locationList){
          for(let loc of self.locationList){
            if(loc.is_main!=1)continue;
              heap.state.user.location_main=loc;
          }
        }
      });
    },
    locationCreate(group_id,location){
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
      var self=this;
      jQuery.post(heap.state.hostname + "User/locationCreate",request).done(function(response){
        self.locationListGet();
      }).fail(function(xhr){
        if( xhr.responseJSON && xhr.responseJSON.messages.error=='limit_exeeded' ){
          self.$flash("Больше адресов добавить нельзя");
        }
      });
    },
    async locationSetMain( location_id, index ){
      var self=this;
      var loc=self.locationList[index];
      heap.state.user.location_main={
        location_id:loc.location_id,
        location_latitude:loc.location_latitude,
        location_altitude:loc.location_altitude,
        location_address:loc.location_address,
        image_hash:loc.image_hash
      };
      router.go(-1);
      await jQuery.post(heap.state.hostname + "User/locationSetMain",{location_id});
      Topic.publish('userMainLocationSet',heap.state.user.location_main)
    },
    locationDelete( location_id, index ){
      var self=this;
      self.locationList.splice(index,1);
      jQuery.post(heap.state.hostname + "User/locationDelete",{location_id}).done(function(response){
        self.locationListGet();
      });
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