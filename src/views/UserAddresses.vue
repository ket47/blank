<template>
  <base-layout page-title="Мои адреса" page-default-back-link="/user-dashboard" :errorMessage="error">
  <div class="panel">
  <ion-list class="adresses-list">
    <ion-item  v-for="location in locationList" :key="location.location_id">
        <ion-thumbnail>
          <ion-icon v-if="location.group_type == 'address_home'" name="home"></ion-icon>
          <ion-icon v-if="location.group_type == 'address_work'" name="business"></ion-icon>
          <ion-icon v-if="location.group_type == 'address_other'" name="trail-sign"></ion-icon>
        </ion-thumbnail> 
        <ion-card-header>
            <ion-label>{{ location.location_address }}</ion-label>
        </ion-card-header>
        <ion-thumbnail>
          <ion-icon name="trash"></ion-icon>
        </ion-thumbnail>
    </ion-item>
  </ion-list>
  </div>
  </base-layout>
</template>


<script>

import { IonIcon,IonThumbnail } from '@ionic/vue';
import { addIcons } from 'ionicons';
import { home, business, trailSign, trash } from 'ionicons/icons';
import store from '../store';
import jQuery from '../jquery';


export default  {
  name: 'UserAddresses',
  components: {
    IonIcon,
    IonThumbnail
  },
  created() {
    addIcons({
      'home': home,
      'business': business,
      'trail-sign': trailSign,
      'trash': trash
    });
  },
  methods:{
    locationListGet:function(){
      jQuery.get(store.state.hostname + "User/locationListGet").done(function(response){
        UserAddresses.data.locationList=response;
      });
    }
  },
  data(){
    return{
      locationList:[]
    }
  }
}
</script>

<style>

.panel{
  box-shadow: 1px 1px 15px -5px #00000085;
}
 ion-list.adresses-list{
  padding-bottom: 0px;
}
.adresses-list ion-card{
  display: flex;
  justify-content: space-between;
}
.adresses-list ion-card-header{
  flex: 3;
}
.adresses-list ion-icon {
  font-size: 26px;
  padding: 12px;
}
</style>

