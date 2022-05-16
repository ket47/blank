<style scoped>
  .schedule ion-item ion-label{
    width:130px
  }
  .disabled{
    background-color: var(--ion-color-medium-shade);
  }
  .deleted{
    background-color: var(--ion-color-danger-tint);
  }
  .notworking{
    background-color: var(--ion-color-light-shade);
  }
  .primary{
    background-color: var(--ion-color-primary-shade);
  }
  .active{
    background-color: var(--ion-color-success-shade);
  }
  ion-text{
    padding:20px 0px 20px 0px;
    font-style: italic;
  }
</style>

<template>
  <base-layout page-title="Мой магазин" :page-default-back-link="'/store-'+this.storeId">
    <ion-card v-if="message">
      <ion-card-content :class="messageClass">
        {{message}}
      </ion-card-content>
    </ion-card>

    <ion-list v-if="storeItem">
      <ion-item>
        <ion-icon :src="storefrontOutline" color="primary" slot="start"/>
        Готово к заказам
        <ion-toggle slot="end" v-model="is_working" @ionChange="save('is_working',$event.target.checked?1:0)"></ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="trashOutline" color="primary" slot="start"/>
        Удалено
        <ion-toggle slot="end" v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)"></ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="flagOutline" color="primary" slot="start"/>
        Опорное
        <ion-toggle slot="end" v-model="is_primary" @ionChange="save('is_primary',$event.target.checked?1:0)"></ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="searchOutline" color="primary" slot="start"/>
        На модерации
        <ion-toggle slot="end" v-model="is_disabled" @ionChange="itemDisable($event.target.checked?1:0)"></ion-toggle>
      </ion-item>
    </ion-list>
    <form @change="saveForm" v-if="storeItem">
      <ion-list lines="full">
      <ion-item-group>
        <ion-item-divider>
          <ion-label>Основные настройки</ion-label>
        </ion-item-divider>

        <ion-item>
          <ion-label position="stacked" color="primary">Название действующее</ion-label>
          <ion-text>{{storeItem.store_name}}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label position="stacked" color="primary">Название новое</ion-label>
          <ion-input v-model="storeItem.store_name_new" name="store_name_new"/>
          <ion-icon v-if="isAdmin" :icon="checkmarkCircleOutline" slot="end" color="success" @click="fieldApprove('store_name')"/>
        </ion-item>

        <ion-item>
          <ion-label position="stacked" color="primary">Описание действующее</ion-label>
          <ion-text>{{storeItem.store_description}}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label position="stacked" color="primary">Описание новое</ion-label>
          <ion-textarea v-model="storeItem.store_description_new" name="store_description_new"></ion-textarea>
          <ion-icon v-if="isAdmin" :icon="checkmarkCircleOutline" slot="end" color="success" @click="fieldApprove('store_description')"/>
        </ion-item>

        <ion-item>
          <ion-label position="stacked" color="primary">Название предприятия действующее</ion-label>
          <ion-text>{{storeItem.store_company_name}}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label position="stacked" color="primary">Название предприятия новое</ion-label>
          <ion-textarea v-model="storeItem.store_company_name_new" name="store_company_name_new"></ion-textarea>
          <ion-icon v-if="isAdmin" :icon="checkmarkCircleOutline" slot="end" color="success" @click="fieldApprove('store_company_name')"/>
        </ion-item>
        <ion-item>
          <ion-label position="stacked" color="primary">Телефон</ion-label>
          <ion-input
            v-model="storeItem.store_phone"
            name="store_phone"
            type="tel"
            inputmode="tel"
            placeholder="x(xxx)-xxx-xx-xx"
            spellcheck="false"
            autocapitalize="off"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked" color="primary">Электронная почта</ion-label>
          <ion-input v-model="storeItem.store_email" name="store_email"/>
        </ion-item>
        <ion-item>
          <ion-row>
            <ion-col>
              <ion-label position="stacked" color="primary">Мин. заказ ({{$heap.state.currencySign}})</ion-label>
              <ion-input v-model="storeItem.store_minimal_order" name="store_minimal_order"/>
            </ion-col>
            <ion-col>
              <ion-label position="stacked" color="primary">Подготовка (минут)</ion-label>
              <ion-input v-model="storeItem.store_time_preparation" name="store_time_preparation"/>
            </ion-col>
          </ion-row>
        </ion-item>
      </ion-item-group>
      </ion-list>

      <ion-item-divider>
        <ion-label>Категории товаров и услуг</ion-label>
      </ion-item-divider>
      <ion-list v-if="is_groups_marked">
        <ion-item v-for="group in storeGroupList" :key="group.group_id">
          <ion-avatar slot="start">
            <ion-img :src="`${$heap.state.hostname}image/get.php/${group.image_hash}.50.50.webp`"/>
          </ion-avatar>
          {{group.group_name}}
          <ion-checkbox color="primary" slot="end" :checked="group.is_marked" @ionChange="itemUpdateGroup($event.target.checked?1:0,group.group_id)"></ion-checkbox>
        </ion-item>
      </ion-list>

      <ion-item-divider>
        <ion-label>Адрес</ion-label>
      </ion-item-divider>

      <ion-list v-if="storeItem?.locations?.length">
        <ion-item v-for="location in storeItem.locations" :key="location.location_id">
            <ion-img slot="start" :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.32.32.png`" />
            <ion-label style="white-space:normal;cursor:pointer;">{{ location.location_address }}</ion-label>
            <ion-icon slot="end" :icon="trash" @click="locationDelete(`${location.location_id}`)"></ion-icon>
        </ion-item>
      </ion-list>
      <ion-list v-else>
        <ion-item>
          <ion-text>Пока адреса не добавлены</ion-text>
        </ion-item>
        <ion-button @click="modalLocationCreate()" size="small" expand="full" color="medium">
          <ion-icon :src="locationOutline"/> Добавить
        </ion-button>
      </ion-list>
      <ion-list>
        <ion-item-divider>
          <ion-label>Изображения магазина в приложении</ion-label>
        </ion-item-divider>
          <image-tile-comp :images="storeItem.images" :image_holder_id="storeItem.store_id" controller="Store" ref="storeImgs"></image-tile-comp>
        <ion-button @click="$refs.storeImgs.take_photo()" size="small" expand="full" color="medium">
          <ion-icon :src="cameraOutline"/> Добавить
        </ion-button>
      </ion-list>

      <ion-list>
      <ion-item-group class="schedule">
        <ion-item-divider>
          <ion-label>Время работы</ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-label slot="start">Понедельник</ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_0" name="store_time_opens_0"/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_0" name="store_time_closes_0"/>
        </ion-item>
        <ion-item>
          <ion-label slot="start">Вторник</ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_1" name="store_time_opens_1"/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_1" name="store_time_closes_1"/>
        </ion-item>
        <ion-item>
          <ion-label slot="start">Среда</ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_2" name="store_time_opens_2"/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_2" name="store_time_closes_2"/>
        </ion-item>
        <ion-item>
          <ion-label slot="start">Четверг</ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_3" name="store_time_opens_3"/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_3" name="store_time_closes_3"/>
        </ion-item>
        <ion-item>
          <ion-label slot="start">Пятница</ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_4" name="store_time_opens_4"/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_4" name="store_time_closes_4"/>
        </ion-item>
        <ion-item>
          <ion-label slot="start">Суббота</ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_5" name="store_time_opens_5"/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_5" name="store_time_closes_5"/>
        </ion-item>
        <ion-item>
          <ion-label slot="start">Воскресенье</ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_6" name="store_time_opens_6"/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_6" name="store_time_closes_6"/>
        </ion-item>
      </ion-item-group>
      </ion-list>
    </form>

    <ion-list v-if="storeItem">
      <ion-item-divider>
          <ion-label>Адинистраторы</ion-label>
      </ion-item-divider>
      <ion-item v-for="owner in ownerList" :key="owner.user_id">
        <ion-icon :src="personOutline" slot="start" color="primary"/>
        <ion-label>{{owner.user_phone}}</ion-label>
        <ion-icon :src="trashOutline" slot="end" @click="ownerDelete(owner.user_id)"/>
      </ion-item>
      <ion-item button @click="ownerAdd()">
        <ion-icon :src="addOutline" slot="start" color="primary"/>
        <ion-label>Добавить администратора</ion-label>
      </ion-item>
    </ion-list>
  </base-layout>
</template>

<script>
import {
  IonInput,
  IonTextarea,
  IonToggle,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonItemDivider,
  IonText,
  IonCol,
  IonRow,
  IonItemGroup,
  IonImg,
  IonAvatar,
  IonButton,
  modalController
  }                   from '@ionic/vue'
import {
  cameraOutline,
  trash,
  trashOutline,
  locationOutline,
  storefrontOutline,
  flagOutline,
  searchOutline,
  personOutline,
  addOutline,
  checkmarkCircleOutline
}                     from 'ionicons/icons'
import imageTileComp  from '@/components/ImageTileComp.vue'
import UserAddressPicker from '@/components/UserAddressPicker.vue'
import heap           from '@/heap';
import jQuery         from "jquery";
import User           from '@/scripts/User.js'

export default  {
  components: { 
  IonInput,
  IonTextarea,
  IonToggle,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonItemDivider,
  IonText,
  IonCol,
  IonRow,
  IonItemGroup,
  IonImg,
  IonAvatar,
  IonButton,
  imageTileComp
    },
  setup(){
    return {
      cameraOutline,
      trash,
      trashOutline,
      locationOutline,
      storefrontOutline,
      flagOutline,
      searchOutline,
      personOutline,
      addOutline,
      checkmarkCircleOutline
      }
  },
  data(){
    return {
      config: {
        phoneMask: '+0(000)-000-00-00'
      },
      storeId: this.$route.params.id,
      storeItem: null,
      storeGroupList:null,
      ownerList:null,
      is_groups_marked:0,
      is_deleted:0,
      is_disabled:0,
      is_working:0,
      is_primary:0
    }
  },
  computed: {
    isPhoneValid() {
      return [11,12].includes(this.storeItem.user_phone.replace(/\D/g,"").length);
    },
    isAdmin(){
      return User.isAdmin();
    },
    message(){
      if(this.storeItem?.deleted_at){
        return "Предприятие не активно и будет удалено. Вы еще можете отменить удаление";
      }
      if(this.storeItem?.is_disabled==1){
        return "Предприятие не активно и находится на рассмотрении у администратора";
      }
      if(this.storeItem?.is_working!=1){
        return "Предприятие отмечено вами как времено не готовое к заказам. Например, в связи с праздниками";
      }
      if(this.storeItem?.is_primary==1){
        return "Предприятие активно и готово принимать заказы в рабочее время. Является опорным";
      }
      return "Предприятие активно и готово принимать заказы в рабочее время.";
    },
    messageClass(){
      if(this.storeItem?.deleted_at){
        return "deleted";
      }
      if(this.storeItem?.is_disabled==1){
        return "disabled";
      }
      if(this.storeItem?.is_primary==1){
        return "primary";
      }
      if(this.storeItem?.is_working!=1){
        return "notworking";
      }
      return 'active';
    },
  },
  created(){
    this.listGroupGet()
    this.itemGet()
    this.ownerListGet()
  },
  methods:{
    async itemGet(){
      try{
        this.storeItem=await jQuery.post( heap.state.hostname + "Store/itemGet", { store_id: this.storeId })
        this.itemParseFlags()
        this.itemMarkGroups()
      }catch{
        //
      }
    },
    itemMarkGroups(){
      if(!this.storeItem || !this.storeGroupList){
        this.is_groups_marked=0
        return
      }
      try{
        const member_of_groups=this.storeItem.member_of_groups.group_ids.split(',');
        for(let group of this.storeGroupList){
          group.is_marked=member_of_groups.includes(group.group_id);
        }
        this.is_groups_marked=1
      }catch{
        //
      }
    },
    itemParseFlags(){
      this.is_deleted   = this.storeItem.deleted_at==null?0:1
      this.is_disabled  = this.storeItem.is_disabled==0?0:1
      this.is_working   = this.storeItem.is_working==0?0:1
      this.is_primary   = this.storeItem.is_primary==1?1:0
    },
    async itemDelete( is_deleted ){
      const remoteFunction=is_deleted?'itemDelete':'itemUnDelete'
      try{
        await jQuery.post( heap.state.hostname + "Store/"+remoteFunction, { store_id: this.storeId })
        this.storeItem.deleted_at=is_deleted?1:null;
      }catch{
        this.itemGet()
      }
    },
    async itemDisable( is_disabled ){
      if(this.storeItem.is_disabled==is_disabled){
        return
      }
      try{
        await jQuery.post( heap.state.hostname + "Store/itemDisable", { store_id: this.storeId, is_disabled })
        this.storeItem.is_disabled=is_disabled;
      }catch{
        this.itemGet()
      }
    },
    saveForm(ev){
      const field_name=ev.target.name;
      const field_value=this.storeItem[field_name]
      this.save(field_name,field_value)
    },
    async save(field_name, field_value) {
      // if(this.storeItem[field_name] == field_value){
      //   return
      // }
      if(field_name == 'user_phone'){
        if(!this.isPhoneValid){
          return false;
        }
        field_value = field_value.replace(/\D/g,"");
      }
      if(!field_name){
        return
      }
      let request = {
        store_id:this.storeId,
        [field_name]:field_value
      };
      try{
        await jQuery.post( heap.state.hostname + "Store/itemUpdate", JSON.stringify(request))
        this.storeItem[field_name] = field_value;
        this.itemParseFlags()
      } catch(err){
        this.$flash("Не удалось сохранить изменение")
        this.itemGet()
      }
    },
    async fieldApprove(field_name){
      let request = {
        store_id:this.storeId,
        field_name
      };
      try{
        await jQuery.post( heap.state.hostname + "Store/fieldApprove", request)
      } catch(err){
        const validationErrors=err.responseJSON.messages.error
        if(validationErrors?.includes('store_description')){
          this.$flash("Описание слишком короткое")
        } else
        if(validationErrors?.includes('store_name')){
          this.$flash("Название слишком короткое")
        } else 
        this.$flash("Не удалось сохранить изменение")
      }
      this.itemGet()
    },
    async itemUpdateGroup(is_joined,group_id){
      const request={
        store_id:this.storeId,
        is_joined,
        group_id
      }
      try{
        await jQuery.post( heap.state.hostname + "Store/itemUpdateGroup", request)
      } catch(err){
        this.$flash("Не удалось сохранить изменение")
        this.itemGet()
      }      
    },
    async listGroupGet(){
      try{
        this.storeGroupList=await jQuery.get( heap.state.hostname + "Store/listGroupGet")
        this.itemMarkGroups()
      }catch{/** */}
    },
    async ownerListGet(){
      try{
        this.ownerList=await jQuery.post(heap.state.hostname + "Store/ownerListGet",{store_id:this.storeId} )
      }catch{/** */}
    },
    async ownerAdd(){
      let owner_phone=prompt('Введите номер телефона нового администратора')
      if(!owner_phone){
        return
      }
      owner_phone=owner_phone.replace(/\D/g,"")
      if( ![11,12].includes(owner_phone.length) ){
        this.$flash("Проверьте правильность телефона")
        return
      }
      try{
        await jQuery.post(heap.state.hostname + "Store/ownerSave",{store_id:this.storeId,action:'add',owner_phone})
        this.ownerListGet()
      }catch{
        this.$flash("Не удалось добавить администратора")
      }
    },
    async ownerDelete(owner_id){
      if(!confirm("Удалить этого пользователя из администраторов магазина?")){
        return
      }
      try{
        await jQuery.post(heap.state.hostname + "Store/ownerSave",{store_id:this.storeId,action:'delete',owner_id})
        this.ownerListGet()
      }catch{
        this.$flash("Не удалось удалить администратора")
      }
    },
    async modalLocationCreate() {
      if(!heap.state.user.user_id){
        this.$flash('Чтобы добавленные адреса сохранились, пожалуйста войдите в систему');
        this.$router.push({name: 'UserSignIn'});
        return;
      }
      var location_group_name_low="рабочий";
      const modal = await modalController.create({
        component: UserAddressPicker,
        showBackdrop:true,
        backdropDismiss:true,
        componentProps:{
          location_group_name_low
        },
      });
      modal.onDidDismiss().then(location => {
        this.locationCreate(location.data);
      });
      return modal.present();
    },
    async locationCreate(location){
      if( !location ){
        return;
      }
      const request={
        location_holder:'store',
        location_holder_id:this.storeId,
        location_group_type:'address_work',
        location_address:location.location_address,
        location_latitude:location.location_latitude,
        location_longitude:location.location_longitude
      };
      try{
        await jQuery.post(heap.state.hostname + "Store/locationCreate",request)
        this.itemGet()
      } catch (err){
        const message=err.responseJSON?.messages?.error;
        if(message=='limit_exeeded'){
          this.$flash("Больше адресов добавить нельзя")
        }
      }
    },
    async locationDelete( location_id ){
      try{
        await jQuery.post(heap.state.hostname + "Store/locationDelete",{location_id})
        this.itemGet()
      }catch{/** */}
    }
  },
}
</script>