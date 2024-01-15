<style scoped>
.is_main{
    font-weight: bold;
}
</style>
<template>
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-title>Мои адреса</ion-title>
          <ion-icon slot="end" @click="modalClose();" :icon="closeOutline" size="large"></ion-icon>            
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>
        <ion-list v-if="locationList.length" lines="full">
          <ion-item v-for="(location,i) in locationList" :key="location.location_id">
              <ion-img slot="start" alt="location icon" :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.60.60.png`" style="height:24px" />
              <ion-label @click="locationSelect(location)" style="white-space:normal;cursor:pointer;"  :class="location.is_main==1?'is_main':''">{{ location.location_address }}</ion-label>
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
  </ion-content>
</template>


<script>
import {
  IonImg,
  IonLabel,
  IonItem,
  IonList,
  IonListHeader,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  modalController,
}                         from "@ionic/vue";
import { 
  locationOutline,
  trashOutline,
  addOutline,
  closeOutline,
}                         from 'ionicons/icons';
import heap               from '@/heap';
import User               from '@/scripts/User.js'
import jQuery             from 'jquery';
import UserAddressPicker  from '@/components/UserAddressPicker.vue';



export default{
  components: {
  IonImg,
  IonLabel,
  IonItem,
  IonList,
  IonListHeader,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  },
  setup(){
    return {
  locationOutline,
  trashOutline,
  addOutline,
  closeOutline,
    };
  },
  data(){
    return{
      locationList:[],
      locationGroupList:[]
    }
  },
  mounted(){
    this.locationListGet()
    //this.$topic.on('dismissModal',()=>this.modalClose())//errors overlay...
  },
  computed:{
    mainAddress(){
      return this.locationList?.find(location=>location.is_main==1)
    }
  },
  methods:{
    modalClose(){
      modalController.dismiss(null,'cancel')
    },
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
    locationSelect(loc){
      modalController.dismiss(loc,'confirm')
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
  },
}
</script>