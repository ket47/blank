<style scoped>
input,textarea{
  border: none;
  padding: 5px;
  margin: 5px;
  width: 100%;
  outline: none;
}
ion-text{
  color:black;
  padding:20px;
  border-radius:10px;
}
.disabled{
  background-color: var(--ion-color-light-shade);
}
.deleted{
  background-color: var(--ion-color-danger-tint);
}
.image_disabled{
  border: 4px solid #999;
  filter: grayscale(0.5);
}
.user-grid{
  min-height: 350px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x: right;
  background-position-y: bottom;
}
</style>
<template>
  <base-layout page-title="Пользователь"  pageDefaultBackLink="/user">
    <ion-modal :is-open="isAddPromoOpen" :initial-breakpoint="0.75" :breakpoints="[0, 0.75,1]">
      <ion-header>
        <ion-toolbar>
          <ion-title>Добавление скидки</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-input label="Название скидки" label-placement="stacked" type="text" v-model="promo_name"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Сумма скидки" label-placement="stacked" type="text" v-model="promo_value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Минимальный заказ" label-placement="stacked" type="text" v-model="promo_minsum"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Срок жизни дней" label-placement="stacked" type="num" v-model="promo_lifetime"></ion-input>
        </ion-item>
        <ion-item lines="none"></ion-item>
        <ion-button @click="promoCreate()" expand="block">Создать</ion-button>
        <ion-button @click="isAddPromoOpen=0" color="light" expand="block">Закрыть</ion-button>
      </ion-content>
    </ion-modal>




    <div v-if="user==null">
      
    </div>
    <div  v-else-if="user?.user_id">
      <ion-card lines="none" v-if="message">
        <ion-card-content :class="messageClass">
          {{message}}
        </ion-card-content>
      </ion-card>
      <ion-card lines="none" v-else>
        <ion-card-content style="background-color: var(--ion-color-success-tint);">
        Анкета пользователя активна.
        </ion-card-content>
      </ion-card>
      
      <form @change="updateUser">
        <ion-list>
          <ion-item>
            <ion-icon :src="trashOutline" color="primary" slot="start"/>
            Удалено
            <ion-toggle slot="end" v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)"></ion-toggle>
          </ion-item>
          <ion-item>
            <ion-icon :src="closeOutline" color="primary" slot="start"/>
            Заблокировано
            <ion-toggle slot="end" v-model="is_disabled" @ionChange="itemDisable($event.target.checked?1:0)"></ion-toggle>
          </ion-item>

          <ion-item-divider>
            <ion-label>Основные настройки</ion-label>
          </ion-item-divider>
          <ion-item lines="full">
            <ion-input v-model="user.user_phone" name="user_phone" placeholder="Телефон" label="Телефон" label-placement="stacked"/>
          </ion-item>
          <ion-item lines="full">
            <ion-checkbox v-model="user.user_phone_verified" name="user_phone_verified" @click="updateUserDelayed({target:{name:'user_phone_verified'}})">Телефон подтвержден</ion-checkbox>
          </ion-item>
          <ion-item lines="full">
            <ion-input v-model="user.user_email" name="user_email" placeholder="Емаил" label="почта" label-placement="stacked"/>
          </ion-item>
          <ion-item lines="full">
            <ion-input v-model="user.user_name" name="user_name" placeholder="Имя" label="Имя" label-placement="stacked"/>
          </ion-item>
          <!-- <ion-item lines="full">
            <ion-input v-model="user.user_surname" placeholder="Фамилия" label="Фамилия" label-placement="stacked"/>
          </ion-item>
          <ion-item lines="full">
            <ion-input v-model="user.user_middlename" placeholder="Отчество" label="Отчество" label-placement="stacked"/>
          </ion-item> -->
          <ion-item lines="full">
            <ion-input v-model="user.user_birthday" name="user_birthday" placeholder="День рождения" label="День рождения" label-placement="stacked" type="datetime-local"/>
          </ion-item>



          <ion-item lines="full">
            <ion-label>Регистрация</ion-label>
            <p slot="end" style="font-size:10px;width:7em">{{user.created_at}}</p>
          </ion-item>
          <ion-item lines="full">
            <ion-label>Последний вход</ion-label>
            <p slot="end" style="font-size:10px;width:7em">{{user.signed_in_at}}</p>
          </ion-item>
          <ion-item lines="full" @click="itemSignInById(user.user_id);" button color="warning">
            <ion-icon :icon="enterOutline" slot="start"/>
            Войти как {{user.user_name}}
          </ion-item>
        </ion-list>
      </form>


      <ion-item-divider>
        <ion-label>Дополнително</ion-label>
      </ion-item-divider>
        <ion-accordion-group>
          <ion-accordion>
              <ion-item slot="header">
                  <ion-label>Пуш подписки {{user_push_subs?.length||0}}</ion-label>
              </ion-item>
              <ion-list slot="content">
                  <ion-item v-for="sub in user_push_subs" :key="sub.sub_id">
                    <ion-label>{{sub.platform}} / {{sub.mobile||sub.browser}}</ion-label>
                    <p slot="end" style="font-size:10px;width:7em">{{sub.created_at}}</p>
                  </ion-item>
              </ion-list>
          </ion-accordion>
          <ion-accordion>
              <ion-item slot="header">
                  <ion-label>Скидки {{promo_list?.length||0}}</ion-label>
              </ion-item>
              <ion-list slot="content">
                  <ion-item v-for="promo in promo_list" :key="promo.promo_id">
                    <ion-icon :src="checkmarkOutline" color="success" slot="start"/>
                    <ion-label>{{promo.promo_name}} / {{promo.promo_value}} / {{promo.promo_share}}%</ion-label>
                    <p slot="end" style="font-size:10px;width:7em">{{promo.expired_at}}</p>
                  </ion-item>
                  <ion-item v-for="promo in promo_list_expired" :key="promo.promo_id">
                    <ion-icon :src="closeOutline" color="danger" slot="start"/>
                    <ion-label>{{promo.promo_name}} / {{promo.promo_value}} / {{promo.promo_share}}%</ion-label>
                    <p slot="end" style="font-size:10px;width:7em">{{promo.expired_at}}</p>
                  </ion-item>
                  <ion-item button @click="isAddPromoOpen=1">
                    <ion-icon :src="addOutline" slot="start"/>
                    <ion-label>Добавить скидку</ion-label>
                  </ion-item>
              </ion-list>
          </ion-accordion>
        </ion-accordion-group>





    </div>
    <div v-else>

    </div>

  </base-layout>
</template>

<script>
import { 
  IonTextarea,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonButton,
  IonList,
  IonCheckbox,
  IonText,
  IonItemDivider,
  IonToggle,
  IonIcon,
  IonAccordion,
  IonAccordionGroup,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
}                    from "@ionic/vue";
import {
  enterOutline,
  addOutline,
  trashOutline,
  searchOutline,
  documentTextOutline,
  checkmarkOutline,
  closeOutline,
}                     from 'ionicons/icons'
import jQuery         from "jquery";
import heap           from '@/heap';
import User           from '@/scripts/User.js';
//import ItemPicker     from '@/components/ItemPicker.vue'

export default  {
  components: {
  IonTextarea,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonButton,
  IonList,
  IonCheckbox,
  IonText,
  IonItemDivider,
  IonToggle,
  IonIcon,
  IonAccordion,
  IonAccordionGroup,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  },
  setup(){
    return {
      enterOutline,
      addOutline,
      trashOutline,
      searchOutline,
      documentTextOutline,
      checkmarkOutline,
      closeOutline
    }
  },
  data(){
    return {
      managed_user_id:this.$route?.query?.user_id,
      user: null,
      user_push_subs:null,
      promo_list:null,
      promo_list_expired:null,
      promo_name:null,
      promo_value:null,
      promo_minsum:null,
      promo_lifetime:null,


      isAdmin:User.isAdmin(),
      isAddPromoOpen:0,
      is_deleted:0,
      is_disabled:0,
    }
  },
  ionViewDidEnter(){
    if(this.managed_user_id==this.$route?.query?.user_id){
      return
    }
    this.managed_user_id=this.$route?.query?.user_id
    this.itemGet()
  },
  mounted(){
    this.itemGet();
  },
  computed:{
    message(){
      if(this.user?.deleted_at){
        return "Пользователь удален";
      }
      if(this.user?.is_disabled==1){
        return "Пользователь заблокирован";
      }
      return null;
    },
    messageClass(){
      if(this.user?.deleted_at){
        return "deleted";
      }
      if(this.user?.is_disabled==1){
        return "disabled";
      }
      return null;
    },
  },
  methods:{
    async itemGet(){
      if(this.managed_user_id==0){
        const user_id=await this.itemGetCreate()
        if(!user_id){
          return
        }
        this.managed_user_id=user_id
      }
      if(this.managed_user_id>0){
        try{
          this.user=await jQuery.post( `${heap.state.hostname}User/itemGet`,{user_id:this.managed_user_id})
          this.user_push_subs=await jQuery.post( `${heap.state.hostname}MessageSub/listGet`,{user_id:this.managed_user_id})
          this.promo_list=await jQuery.post( `${heap.state.hostname}Promo/listGet`,{user_id:this.managed_user_id,type:'active'})
          this.promo_list_expired=await jQuery.post( `${heap.state.hostname}Promo/listGet`,{user_id:this.managed_user_id,type:'expired'})
        } catch( err ){
          this.$flash("Не удалось загрузить пользователя")
        }
      } else {
        this.user={}
      }
      this.itemParseFlags()
    },
    itemParseFlags(){
      if(!this.user){
        return
      }
      this.is_deleted   = this.user.deleted_at==null?0:1
      this.is_disabled  = this.user.is_disabled==0?0:1
    },
    async itemGetCreate(){
        const user_phone=prompt('Телефон нового пользователя')
        if( !user_phone ){
          setTimeout(()=>this.$go('/admin/list-moderation'),200)
          return
        }
        const request={
          name_query_fields:'user_phone',
          name_query:user_phone,
          limit:1
        }
        const users=await jQuery.post( `${heap.state.hostname}User/listGet`,request)
        if( users && users[0] ){
          return users[0].user_id
        }
        const new_user={
          user_phone,
          user_name:'новый пользователь'
        }
        return this.itemCreate( new_user )
    },
    async itemCreate( new_user ){
      try{
        return await jQuery.post(`${heap.state.hostname}User/itemCreate`,new_user);
      } catch (err){
        
        let exception_code = "unknown";
        try {
          const invalid_field = Object.keys(
            JSON.parse(err.responseJSON.messages.error)
          )[0];
          const invalid_reason = Object.values(
            JSON.parse(err.responseJSON.messages.error)
          )[0];
          exception_code = invalid_field + "_" + invalid_reason;
        } catch {
          /** */
        }

        switch (exception_code) {
          case "user_phone_notunique":
            this.$flash("Пользователь с таким телефоном уже зарегистрирован");
            break;
          case "user_phone_required":
          case "user_phone_invalid":
          case "user_phone_short":
            this.$flash("Проверьте номер телефона");
            break;
          case "user_name_required":
          case "user_name_short":
            this.$flash("Проверьте ваш псевдоним");
            break;
          case "user_email_invalid":
            this.$flash("Проверьте ваш е-маил");
            break;
          case "user_email_notunique":
            this.$flash("Такой е-маил уже используется");
            break;
          case "user_pass_required":
            this.$flash("Пароль обязателен для заполнения");
            break;
          case "user_pass_short":
            this.$flash("Пароль слишком короткий");
            break;
          case "user_pass_notmatches":
            this.$flash("Пароль не совпадает с подтверждением");
            break;
          default:
            this.$flash("Не удалось зарегистрироваться");
        }
        return 0
      }
    },
    async itemDelete( is_deleted ){
      if(!confirm("Вы уверенны?")){
        return
      }
      const remoteFunction=is_deleted?'itemDelete':'itemUnDelete'
      try{
        await jQuery.post( heap.state.hostname + "user/"+remoteFunction, { user_id: this.user.user_id })
        this.user.deleted_at=is_deleted?1:null;
      }catch{
        //
      }
      this.itemGet()
    },
    async itemDisable( is_disabled ){
      if(this.user.is_disabled==is_disabled){
        return
      }
      try{
        await jQuery.post( heap.state.hostname + "User/itemDisable", { user_id: this.user.user_id, is_disabled })
        this.user.is_disabled=is_disabled;
      }catch{
        this.itemGet()
      }
    },
    async itemSignInById( user_id ){
      if( !confirm(`Войти в профиль пользователя ${this.user.user_name}?`) ){
        return
      }
      this.$flash("Выходим из админ профиля")
      const request={
        user_id
      }
      await jQuery.post( `${heap.state.hostname}User/signInById`,request)
      await this.$go('/')
      //location.reload()
    },
    async updateUser(ev){
      const field_name=ev.target.name;
      const field_value=this.user[field_name]

      const request={
        user_id:this.user.user_id,
        [field_name]:field_value
      }
      try{
        await jQuery.post(heap.state.hostname + "User/itemUpdate",JSON.stringify(request));
        this.$flash("Сохранено")
      } catch(err){
        this.$flash("Ошибка сохранения")
        this.itemGet()
      }
    },
    async updateUserDelayed(ev){
      setTimeout(()=>this.updateUser(ev),200)
    },
    async promoCreate(){
      const promo_share=this.promo_value*100/this.promo_minsum
      const request={
        owner_id:this.managed_user_id,
        promo_name:this.promo_name,
        promo_value:this.promo_value,
        promo_share,
        promo_lifetime:this.promo_lifetime
      }
      if( !this.promo_lifetime || !this.promo_name || !this.promo_value || this.promo_value>this.promo_minsum ){
        this.$flash("Проверьте форму!")
        return
      }
      await jQuery.post(heap.state.hostname + "Promo/itemCreate",request);
      this.isAddPromoOpen=0
      this.$flash("Скидка создана")
      this.itemGet()
    }

    // async itemOrderCreate(){
    //   const store=this.storePick()
    //   try{
    //     const request={
    //       store_id:store.store_id
    //     }
    //     const order_id=await jQuery.post( `${heap.state.hostname}Order/itemCreate`,request)


    //   }
    // },
    // async storePick(){
    //     const modal = await modalController.create({
    //         component: ItemPicker,
    //         componentProps:{itemType:'store'},
    //         initialBreakpoint: 0.75,
    //         breakpoints: [0.75, 1],
    //         canDissmiss:true,
    //     });
    //     modal.present()
    //     this.$topic.on('dismissModal',()=>{
    //         modal.dismiss()
    //     });
    //     const item=await modal.onDidDismiss();
    //     return item?.data || null
    // },

  },
}
</script>