<style scoped>
  .pdisabled{
    background-color: var(--ion-color-light-shade);
  }
  .pdeleted{
    background-color: var(--ion-color-danger-tint);
  }
  .phidden{
    background-color: var(--ion-color-warning-shade);
  }
  .pactive{
    background-color: var(--ion-color-success-shade);
  }
</style>

<template>
  <base-layout :pageTitle="`Промокод ${item?.promo_code??''}`">
  <div v-if="item">
    <ion-card>
      <ion-card-content :class="messageClass">
        <ion-text color="dark">{{message}}</ion-text>
      </ion-card-content>
    </ion-card>

    <ion-list>
      <ion-item>
        <ion-icon :src="checkmarkCircleOutline" color="primary" slot="start"/>
        <ion-toggle v-model="item.is_working" color="success" @ionChange="save($event.target.name,$event.target.checked?1:0)" name="is_working">Активен</ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="ribbonOutline" color="primary" slot="start"/>
        <ion-toggle v-model="item.is_disabled" @ionChange="save($event.target.name,$event.target.checked?1:0)" name="is_disabled">На модерации</ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="trashOutline" color="primary" slot="start"/>
        <ion-toggle v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)">Удален</ion-toggle>
      </ion-item>
    </ion-list>
    <ion-item-divider>
      <ion-label>Основные настройки</ion-label>
    </ion-item-divider>
    <ion-list>
      <ion-item>
        <ion-icon :icon="textOutline" slot="start" color="primary" />
        <ion-input
          v-model="item.promo_code"
          name="promo_code"
          type="text"
          @change="save('promo_code', $event.target.value)"
          placeholder="буквы и цифры"
          label-placement="stacked"
          required
        >
          <ion-text color="primary" slot="label">Промокод</ion-text>
        </ion-input>
      </ion-item>

      <ion-item lines="none">
        <ion-icon :icon="giftOutline" slot="start" color="primary" />
        <ion-input
          v-model="item.promo_sum"
          placeholder="сумма скидки"
          label-placement="stacked"
          @change="save('promo_sum', $event.target.value)"
        >
          <ion-text color="primary" slot="label">Сумма</ion-text>
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-icon slot="start" />
        <ion-segment
          mode="ios"
          v-model="item.promo_subject"
          @ionChange="save('promo_subject', $event.target.value)"
        >
          <ion-segment-button value="product">
            <ion-icon :icon="cubeOutline" color="secondary"/>
            скидка от суммы
          </ion-segment-button>
          <ion-segment-button value="delivery">
            <ion-icon :icon="rocketOutline" color="secondary"/>
            скидка от доставки
          </ion-segment-button>
        </ion-segment>
      </ion-item>
      <ion-item lines="none">
        <ion-icon :icon="bookOutline" slot="start" color="primary" />
        <ion-textarea
          v-model="item.promo_description"
          placeholder="описание условий промокода"
          label-placement="stacked"
          name="promo_description"
          @change="save('promo_description', $event.target.value)">
          
          <ion-text color="primary" slot="label">Описание</ion-text>
        </ion-textarea>
      </ion-item>
    </ion-list>

    <ion-item-divider>
      <ion-label>Условия применения</ion-label>
    </ion-item-divider>
    <div class="ion-padding">
      <ion-chip v-if="item.case_product_id" color="primary">
        <ion-icon :icon="fastFoodOutline"/>
        <ion-label color="dark" @click="itemTagPick('product')">{{ item.case_product_name }}</ion-label>
        <ion-icon :icon="closeOutline" @click="save('case_store_id',null,'case_product_id',null)"/>
      </ion-chip>
      <ion-chip v-if="item.case_store_id" color="primary">
        <ion-icon :icon="storefrontOutline"/>
        <ion-label color="dark" @click="itemTagPick('store')">{{ item.case_store_name }}</ion-label>
        <ion-icon :icon="closeOutline" @click="save('case_store_id',null,'case_product_id',null)"/>
      </ion-chip>
      <ion-chip v-if="item.case_user_id" color="primary">
        <ion-icon :icon="personOutline"/>
        <ion-label color="dark" @click="itemTagPick('user')">{{ item.case_user_name }} {{ item.case_user_phone }}</ion-label>
        <ion-icon :icon="closeOutline" @click="save('case_user_id',null)"/>
      </ion-chip>
      <ion-chip v-if="item.case_min_sum" color="primary">
        <ion-icon :icon="walletOutline"/>
        <ion-label color="dark" @click="itemTagPick('min_sum')">Мин. сумма заказа: {{ item.case_min_sum }}{{ $heap.state.currencySign }}</ion-label>
        <ion-icon :icon="closeOutline" @click="save('case_min_sum',null)"/>
      </ion-chip>
      <ion-chip v-if="item.case_started_at" color="primary">
        <ion-icon :icon="calendarClearOutline"/>
        <ion-label color="dark" @click="itemTagPick('started_at')">От {{ item.case_started_at }}</ion-label>
        <ion-icon :icon="closeOutline" @click="save('case_started_at',null)"/>
      </ion-chip>
      <ion-chip v-if="item.case_finished_at" color="primary">
        <ion-icon :icon="calendarNumberOutline"/>
        <ion-label color="dark" @click="itemTagPick('finished_at')">До {{ item.case_finished_at }}</ion-label>
        <ion-icon :icon="closeOutline" @click="save('case_finished_at',null)"/>
      </ion-chip>
    </div>

    <div class="ion-padding">
      <ion-chip v-if="!item.case_product_id" @click="itemTagPick('product')">
        <ion-icon :icon="fastFoodOutline"/>
        <ion-label>Товар</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.case_store_id" @click="itemTagPick('store')">
        <ion-icon :icon="storefrontOutline"/>
        <ion-label>Магазин</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.case_user_id" @click="itemTagPick('user')">
        <ion-icon :icon="personOutline"/>
        <ion-label>Клиент</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.case_min_sum" @click="itemTagPick('min_sum')">
        <ion-icon :icon="walletOutline"/>
        <ion-label>Сумма заказа</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.case_started_at" @click="itemTagPick('started_at')">
        <ion-icon :icon="calendarClearOutline"/>
        <ion-label>Начало</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.case_finished_at" @click="itemTagPick('finished_at')">
        <ion-icon :icon="calendarNumberOutline"/>
        <ion-label>Конец</ion-label>
      </ion-chip>
    </div>

    <ion-item-divider v-if="item.case_store_id">
      <ion-label>Списывать с {{ item.case_store_name }}</ion-label>
    </ion-item-divider>
    <div class="ion-padding" v-if="item.case_store_id">
      <ion-chip v-if="item.charge_sum" color="danger">
        <ion-icon :icon="removeCircleOutline"/>
        <ion-label color="dark" @click="itemTagPick('charge_sum')">Списать с {{ item.case_store_name }}: {{ item.charge_sum }}{{ $heap.state.currencySign }}</ion-label>
        <ion-icon :icon="closeOutline" @click="save('charge_sum',null)"/>
      </ion-chip>

      <ion-chip v-if="!item.charge_sum" @click="itemTagPick('charge_sum')">
        <ion-icon :icon="removeCircleOutline"/>
        <ion-label>Сумма списания</ion-label>
      </ion-chip>
    </div>

    <ion-item-divider>
      <ion-label>Итог</ion-label>
    </ion-item-divider>
    <div class="ion-padding" v-if="messageClass=='pactive'" style="color:var(--ion-color-dark);font-size:0.8em">
      <p>
        Это промокод <b>{{ item.promo_code }}</b> <span v-if="item.promo_description">,с описанием <b>{{ item.promo_description }}</b>,</span> на сумму <ion-chip color="primary">{{ item.promo_sum }}{{ $heap.state.currencySign }}</ion-chip>
        <b><span v-if="item.promo_subject=='product'">от суммы заказа</span>
        <span v-else>от доставки</span></b>.
      </p>
      <p>
        Он может быть использован 
        <span v-if="item.case_store_id">в <b>{{ item.case_store_name }}</b></span>
        <span v-if="item.case_product_id">, при покупке <b>{{ item.case_product_name }}</b></span>
        <span v-if="item.case_min_sum">, если сумма заказа больше <b>{{ item.case_min_sum }}{{ $heap.state.currencySign }}</b></span>.
      </p>
      <p>
        <span v-if="item.case_user_id">Только клиент {{ item.case_user_name }} может использовать его один раз.</span>
        <span v-else>Промокод могут использовать все клиенты не ограниченное количество раз.</span>
      </p>
      <p v-if="item.case_started_at || item.case_finished_at">
        Время действия 
        <span v-if="item.case_started_at"> с {{ item.case_started_at }}</span>
        <span v-if="item.case_finished_at"> до {{ item.case_finished_at }}</span>. 
      </p>
      <p>
        <span v-if="item.charge_sum">Сумма <b>{{ item.charge_sum }}{{ $heap.state.currencySign }}</b> будет списана с {{ item.case_store_name }}. </span>
        <span v-if="item.charge_sum*1 < item.promo_sum*1">Часть суммы в {{ item.promo_sum-item.charge_sum }}{{ $heap.state.currencySign }} будет списана с {{ $heap.state.settings.app_title }}. </span>
      </p>
    </div>
  </div>
  <div v-else>
    Loading
  </div>
  </base-layout>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonItemDivider,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonChip,
  IonToggle,
  IonTextarea,
  IonText,
  modalController,

  IonModal,
  IonHeader,
  IonContent,
}                              from "@ionic/vue";
import {
  trashOutline,
  personOutline,
  textOutline,
  bookOutline,
  walletOutline,
  fastFoodOutline,
  rocketOutline,
  calendarClearOutline,
  calendarNumberOutline,
  storefrontOutline,
  ribbonOutline,
  checkmarkCircleOutline,
  closeOutline,
  removeCircleOutline,
  cubeOutline,
  giftOutline,
}                             from "ionicons/icons";
import ItemPicker             from '@/components/ItemPicker.vue'
import ItemInputPicker        from '@/components/ItemInputPicker.vue'

export default {
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonItemDivider,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonChip,
    IonToggle,
    IonTextarea,
    IonText,

    IonModal,
    IonHeader,
    IonContent,

  },
  setup() {
    return {
      trashOutline,
      personOutline,
      textOutline,
      bookOutline,
      walletOutline,
      fastFoodOutline,
      rocketOutline,
      calendarClearOutline,
      calendarNumberOutline,
      storefrontOutline,
      ribbonOutline,
      checkmarkCircleOutline,
    removeCircleOutline,
    cubeOutline,
  giftOutline,

  closeOutline,
    }
  },
  data() {
    return {
      promoCodeId: this.$route.params.id,
      is_deleted:0,
      is_disabled:0,
      item: null,
    };
  },
  computed:{
    message(){
      if( !this.item ){
        return ''
      }
      if(this.item.deleted_at){
        return "???????"
      }
      if(this.item.is_disabled==1){
        return "Промокод находится на рассмотрении у администратора"
      }
      if(this.item?.is_working==0){
        return "Промокод не активен. Вы можете активировать его"
      }
      return "Промокод активен"
    },
    messageClass(){
      if( !this.item ){
        return ''
      }
      if(this.item?.deleted_at){
        return "pdeleted";
      }
      if(this.item?.is_disabled==1){
        return "pdisabled";
      }
      if(this.item?.is_working==0){
        return "phidden";
      }
      return 'pactive';
    },
  },
  methods: {
    async itemGet(){
      try{
        const request={
          promo_code_id:this.promoCodeId
        }
        const item=await this.$post('PromoCode/itemGet',request)

        item.is_disabled*=1
        item.is_working*=1
        if( item.case_started_at ){
          item.case_started_at=item.case_started_at.split(' ')[0]
        }
        if( item.case_finished_at ){
          item.case_finished_at=item.case_finished_at.split(' ')[0]
        }
        this.item=item
      } catch (err){
        console.warn(err)
      }
    },
    async save(field_name, field_value, field_name2, field_value2 ) {
      var requestData = {};
      requestData.promo_code_id = this.promoCodeId;
      requestData[field_name] = field_value;
      if(field_name2){
        requestData[field_name2] = field_value2;
      }
      await this.itemUpdate(requestData);
      this.item[field_name] = field_value;
      if(field_name2){
        this.item[field_name2] = field_value2;
      }
    },
    async itemUpdate(requestData) {
      try {
        const resp = await this.$post(`PromoCode/itemUpdate`,JSON.stringify(requestData));
        if( requestData?.promo_sum ){
          this.itemGet()//case_min_sum & charge_sum may be changed
        }
        if (resp == "ok") {
          this.$flash("💾 Сохранено");
          return true;
        }
      } catch (err) {
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
          case "promo_sum_small":
            this.$flash("🚫 Сумма слишком маленькая");
            break;
        }
        this.itemGet()
        return false;
      }
    },
    async itemDelete(){
      return false
    },


    async itemTagPick( type ){
      if( type=='product' ){
        this.$flash("С какого магазина товар?")
        const store=await this.itemPick('store')
        if( !store ){
          return
        }
        const product=await this.itemPick('product',{store_id:store.store_id})

        this.itemUpdate({
          promo_code_id:this.promoCodeId,
          case_store_id:store.store_id,
          case_product_id:product.product_id
        })
        this.item.case_store_id=store.store_id
        this.item.case_store_name=store.store_name
        this.item.case_product_id=product.product_id
        this.item.case_product_name=product.product_name
      }
      if( type=='store' ){
        const store=await this.itemPick('store')
        if( !store ){
          return
        }
        this.itemUpdate({
          promo_code_id:this.promoCodeId,
          case_store_id:store.store_id,
          case_product_id:null
        })
        this.item.case_store_id=store.store_id
        this.item.case_store_name=store.store_name
        this.item.case_product_id=null
        this.item.case_product_name=null
      }
      if( type=='user' ){
        const user=await this.itemPick('user')
        if( !user ){
          return
        }
        this.itemUpdate({
          promo_code_id:this.promoCodeId,
          case_user_id:user.user_id,
        })
        this.item.case_user_id=user.user_id
        this.item.case_user_name=user.user_name
        this.item.case_user_phone=user.user_phone
      }
      if( type=='min_sum' ){
        const value=await this.inputValuePick('text',this.item.case_min_sum,'Минимальная сумма заказа')
        if( !value || value<=0 ){
          return
        }
        if( this.item.promo_sum*1 > value*1 ){
          this.$flash(`Минимальная сумма заказа должна быть не меньше ${this.item.promo_sum}${this.$heap.state.currencySign}`)
        }
        this.item.case_min_sum=value
        await this.itemUpdate({
          promo_code_id:this.promoCodeId,
          case_min_sum:value,
        })
        this.itemGet()
      }
      if( type=='started_at' ){
        let value=await this.inputValuePick('date',this.item.case_started_at,'Начало действия')
        if( !value ){
          return
        }
        this.item.case_started_at=value
        await this.itemUpdate({
          promo_code_id:this.promoCodeId,
          case_started_at:value+' 00:00:00',
        })
        this.itemGet()
      }
      if( type=='finished_at' ){
        let value=await this.inputValuePick('date',this.item.case_finished_at,'Конец действия')
        if( !value ){
          return
        }
        this.item.case_finished_at=value
        await this.itemUpdate({
          promo_code_id:this.promoCodeId,
          case_finished_at:value+' 00:00:00',
        })
        this.itemGet()
      }
      if( type=='charge_sum' ){
        const value=await this.inputValuePick('text',this.item.charge_sum,'Списывать с магазина')
        if( !value || value<=0 ){
          return
        }
        if( this.item.promo_sum*1 < value*1 ){
          this.$flash(`Сумма списания должна быть меньше ${this.item.promo_sum}${this.$heap.state.currencySign}`)
        }
        this.item.charge_sum=value
        await this.itemUpdate({
          promo_code_id:this.promoCodeId,
          charge_sum:value,
        })
        this.itemGet()
      }
    },
    async inputValuePick( inputType, inputValue, inputLabel ){
      const modal = await modalController.create({
          component: ItemInputPicker,
          componentProps:{inputType,inputValue,inputLabel},
          initialBreakpoint: 0.35,
          breakpoints: [0, 0.35, 0.7],
          canDissmiss:true,
      });
      modal.present()
      this.$topic.on('dismissModal',()=>{
          modal.dismiss()
      });
      const item=await modal.onDidDismiss()
      return item.data
    },

    async itemPick( itemType, filter=null ){
      const modal = await modalController.create({
          component: ItemPicker,
          componentProps:{itemType,filter},
          initialBreakpoint: 0.75,
          breakpoints: [0.75, 1],
          canDissmiss:true,
      });
      modal.present()
      this.$topic.on('dismissModal',()=>{
          modal.dismiss()
      });
      const item=await modal.onDidDismiss()
      return item.data
    },
  },
  created() {
    if( this.promoCodeId==0 ){
      //create
    } else{
      this.itemGet()
    }
  },
};
</script>