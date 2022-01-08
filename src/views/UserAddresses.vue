<template>
  <base-layout page-title="Мои адреса" page-default-back-link="/user-dashboard" :errorMessage="error">
    <ion-page ref="UserAddressPage">
      <ion-content :fullscreen="true">
        <ion-list class="adresses-list">
          <ion-item  v-for="location in locationList" :key="location.location_id">
              <ion-img :src="`${$store.state.hostname}/image/get.php/${location.image_hash}.32.32.png`" />
              <ion-label style="margin-left:5px;padding-left:5px;border-left:solid 1px black;white-space:normal">{{ location.location_address }}</ion-label>
              <ion-thumbnail slot="end" @click="locationDelete(`${location.location_id}`)" style="font-size: 24px;cursor: pointer;padding:10px;color:#333">
                <ion-icon :icon="trash" />
              </ion-thumbnail>
          </ion-item>
        </ion-list>

        <ion-list>
          <ion-list-header>
            <ion-label>Добавить адрес</ion-label>
          </ion-list-header>
          <ion-item  v-for="location in locationGroupList" :key="location.group_id" @click="modalLocationCreate(`${location.group_id}`,`${location.group_name}`)">
              <ion-img :src="`${$store.state.hostname}/image/get.php/${location.image_hash}.32.32.png`" />
              <ion-label style="margin-left:5px;padding-left:5px;border-left:solid 1px black;white-space:normal">{{ location.group_name }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-page>
  </base-layout>
</template>


<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  modalController
} from "@ionic/vue";
import router from '../router';
import store from '../store';
import jQuery from 'jquery';
import UserAddressPicker from '@/components/UserAddressPicker.vue';
import { IonIcon } from '@ionic/vue';
import { trash } from 'ionicons/icons';

export default{
  name: 'UserAddresses',
  components: {
    IonContent,
    IonPage,
    IonIcon
  },
  setup(){
    return { trash };
  },
  created() {
    this.locationListGet();
  },
  methods:{
    async modalLocationCreate( location_group_id, location_group_name ) {
      if(!store.state.user.user_id){
        alert('Чтобы добавленные адреса сохранились, пожалуйста войдите в систему');
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
      jQuery.get(store.state.hostname + "User/locationListGet",{includeGroupList:1}).done(function(response){
        self.locationList=response.location_list;
        self.locationGroupList=response.location_group_list;
      });
    },
    locationCreate(group_id,location){
      if( !location ){
        return;
      }
      let request={
        location_holder:'user',
        location_holder_id:store.state.user.user_id,
        location_type_id:group_id,
        location_address:location.location_address,
        location_latitude:location.location_latitude,
        location_longitude:location.location_longitude
      };
      var self=this;
      jQuery.post(store.state.hostname + "User/locationCreate",request).done(function(response){
        self.locationListGet();
      }).fail(function(xhr){
        if( xhr.responseJSON && xhr.responseJSON.messages.error=='limit_exeeded' ){
          alert("Больше адресов добавить нельзя");
        }
      });
    },
    locationDelete( location_id ){
      var self=this;
      jQuery.post(store.state.hostname + "User/locationDelete",{location_id}).done(function(response){
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