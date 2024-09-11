<style scoped>
.is_main{
    font-weight: bold;
}
</style>
<template>
  <base-layout page-title="Мои адреса" ref="UserAddressPage">
        <ion-card v-if="mainAddress">
          <ion-card-header>
            <ion-card-title>
              Адрес доставки заказа
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p><b style="color:var(--ion-color-primary)">{{mainAddress.location_address}}</b>, выбран как адрес доставки заказов.</p>
          </ion-card-content>
        </ion-card>
        <ion-card v-else>
          <ion-card-header>
            <ion-card-title>
              Адрес не установлен
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Вы пока не добавили адрес доставки заказа.</p>
            <p>Для поиска ресторанов и магазинов будет использоваться адрес по умолчанию.</p>
          </ion-card-content>
        </ion-card>

        <ion-list v-if="locationList.length" lines="none">
          <div v-for="(location,i) in locationList" :key="location.location_id">
            <ion-item button detail @click="locationSetMain(`${location.location_id}`,`${i}`)">
                <ion-img slot="start" alt="location icon" :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.60.60.png`" style="height:24px" />
                <ion-label style="white-space:normal;cursor:pointer;"  :class="location.is_main==1?'is_main':''">
                  {{ location.location_address }}
                </ion-label>
            </ion-item>
            <ion-item  lines="full" v-if="location.is_main==1">
                <div>
                    <div v-if="location.location_comment" @click="locationCommentEdit('locationStart')" style="padding:10px;background-color:var(--ion-color-light);color:#666;border-radius:15px;display:inline-block">
                        {{location.location_comment}}
                    </div>
                    <ion-chip color="medium" v-else @click="locationCommentEdit('locationStart')">
                        <ion-icon :src="addOutline"/><ion-label>комментарий</ion-label>
                    </ion-chip>

                    <ion-chip v-if="location.location_phone>0" color="medium" @click="locationPhoneEdit('locationStart')">
                        <ion-icon :src="callOutline"/><ion-label>{{location.location_phone}}</ion-label>
                    </ion-chip>
                    <ion-chip v-else color="medium" @click="locationPhoneEdit('locationStart')"><ion-icon :src="addOutline"/><ion-label>телефон</ion-label></ion-chip>
                </div>
                <ion-icon slot="end" :icon="trashOutline" @click="locationDelete(`${location.location_id}`,`${i}`)" color="medium"></ion-icon>
            </ion-item>
          </div>
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
  IonCardTitle,
  modalController,
  loadingController,
  IonChip,
  alertController,
}                         from "@ionic/vue";
import router             from '@/router';
import heap               from '@/heap';
import User               from '@/scripts/User.js'
import jQuery             from 'jquery';
import UserAddressPicker  from '@/components/UserAddressPicker.vue';

import { locationOutline,trashOutline,addOutline,callOutline, }          from 'ionicons/icons';


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
  IonCardTitle,
  IonChip,
  },
  setup(){
    return { locationOutline,trashOutline,addOutline,callOutline, };
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
          this.$go('/modal/user-authorize');
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
        location_longitude:location.location_longitude,
        location_comment:location.location_comment
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
      const loc=this.locationList[index];
      heap.state.user.location_main={
        location_id:loc.location_id,
        location_latitude:loc.location_latitude,
        location_longitude:loc.location_longitude,
        location_address:loc.location_address,
        image_hash:loc.image_hash
      };
      await jQuery.post(heap.state.hostname + "User/locationSetMain",{location_id});
      this.$topic.publish('userMainLocationSet',heap.state.user.location_main)
      this.$flash("Адрес доставки изменен")
      if(this.$heap.state.next_route){
        this.$go(this.$heap.state.next_route)
        this.$heap.state.next_route=null
      } else {
        this.locationListGet()
      }
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
    },
    async locationUpdate( update ){
      await jQuery.post(heap.state.hostname + "Location/itemUpdate",JSON.stringify(update))
      this.$flash("Сохранено")
      this.locationListGet();
    },
    async locationPhoneEdit( type ){
        let phone=heap.state.user.location_main.location_phone??''
        const alert = await alertController.create({
            header: 'Напишите номер телефона',
            buttons: [
                {
                    text: 'Удалить',
                    role: 'cancel'
                },
                {
                    text: 'OK',
                    role: 'confirm'
                },
            ],
            inputs: [
                {
                    name:'phone',
                    placeholder: '+7 xxxxxxxxxx',
                    value:phone
                },
            ],
        });
        try{
            await alert.present();
            const {data,role}=await alert.onDidDismiss()
            if(role=='confirm'){
                phone=data.values.phone.replace(/\D/g,'').replace(/^7/,'')
                if(phone){
                    if(phone.length!=10){
                        this.$flash("Проверьте правильность телефона")
                        return
                    }
                    phone='+7'+phone
                }
            }
            if(role=='cancel'){
                phone=''
            }
            heap.state.user.location_main.location_phone=phone
            const update={
              location_id:heap.state.user.location_main.location_id,
              location_phone:phone
            }
            this.locationUpdate( update )
        } catch(err){
            console.log(err)
        }
    },
    async locationCommentEdit( type ){
        let comment=heap.state.user.location_main.location_comment??''
        const alert = await alertController.create({
            header: 'Комментарий к адресу',
            buttons: [
                {
                    text: 'Удалить',
                    role: 'cancel'
                },
                {
                    text: 'OK',
                    role: 'confirm'
                },
            ],
            inputs: [
                {
                    type:'textarea',
                    name:'comment',
                    placeholder: 'напишите комментарий',
                    value:comment
                },
            ],
        });
        try{
            await alert.present();
            const {data,role}=await alert.onDidDismiss()
            comment=data.values.comment
            if(role=='cancel'){
                comment=''
            }
            heap.state.user.location_main.location_comment=comment
            const update={
              location_id:heap.state.user.location_main.location_id,
              location_comment:comment
            }
            this.locationUpdate( update )
        } catch(err){
            console.log(err)
        }
    },







  },
  data(){
    return{
      locationList:[],
      locationGroupList:[]
    }
  }
}
</script>