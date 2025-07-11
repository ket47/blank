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
  <base-layout :page-title="`Промокод ${item?.promo_code??''}`">
  <div v-if="item">
    <ion-card>
      <ion-card-content :class="messageClass">
        <ion-text color="dark">{{message}}</ion-text>
      </ion-card-content>
    </ion-card>
    <ion-list v-if="0">
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
    
    
    
    <!-- <ion-list>
      <ion-item>
        <ion-icon :icon="textOutline" slot="start" color="primary" />
        <ion-input
          v-model="item.promo_code"
          name="promo_code"
          type="text"
          @change="save('promo_code', $event.target.value)"
          placeholder="буквы и цифры"
          label="Промокод"
          label-placement="stacked"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-icon :icon="bookOutline" slot="start" color="primary" />
        <ion-textarea
          v-model="item.promo_description"
          placeholder="описание условий промокода"
          label="Описание"
          label-placement="stacked"
          name="promo_description"
          @change="save('promo_description', $event.target.value)">
        </ion-textarea>
      </ion-item>
      <ion-item lines="none">
        <ion-icon :icon="walletOutline" slot="start" color="primary" />
        <ion-input
          v-model="item.promo_sum"
          placeholder="сумма скидки"
          label="Сумма"
          label-placement="stacked"
          @change="save('promo_sum', $event.target.value)"
        ></ion-input>
      </ion-item>

      <ion-item lines="none">
        <ion-icon slot="start" />
        <ion-segment
          mode="ios"
          v-model="item.promo_subject"
          @ionChange="save('promo_subject', $event.target.value)"
        >
          <ion-segment-button value="product">
            <ion-icon :icon="fastFoodOutline"/>
            скидка от суммы
          </ion-segment-button>
          <ion-segment-button value="delivery">
            <ion-icon :icon="rocketOutline"/>
            скидка от доставки
          </ion-segment-button>
        </ion-segment>
      </ion-item>
    </ion-list> -->

    <ion-item-divider>
      <ion-label>Условия применения</ion-label>
    </ion-item-divider>
    <div class="ion-padding">
      <ion-chip v-if="item.case_product_id" color="primary">
        <ion-icon :icon="fastFoodOutline"/>
        <ion-label color="dark">{{ item.case_product_name }}</ion-label>
        <ion-icon :icon="closeCircleOutline" @click="save('case_store_id',null,'case_product_id',null)"/>
      </ion-chip>
      <ion-chip v-if="item.case_store_id" color="primary">
        <ion-icon :icon="storefrontOutline"/>
        <ion-label color="dark">{{ item.case_store_name }}</ion-label>
        <ion-icon :icon="closeCircleOutline" @click="save('case_store_id',null,'case_product_id',null)"/>
      </ion-chip>
      <ion-chip v-if="item.case_user_id" color="primary">
        <ion-icon :icon="personOutline"/>
        <ion-label color="dark">{{ item.case_user_name }} {{ item.case_user_phone }}</ion-label>
        <ion-icon :icon="closeCircleOutline" @click="save('case_user_id',null)"/>
      </ion-chip>
      <ion-chip v-if="item.case_min_sum" color="primary">
        <ion-icon :icon="walletOutline"/>
        <ion-label color="dark">Сумма {{ item.case_min_sum }}</ion-label>
        <ion-icon :icon="closeCircleOutline" @click="save('case_min_sum',null)"/>
      </ion-chip>
      <ion-chip v-if="item.started_at" color="primary">
        <ion-icon :icon="calendarClearOutline"/>
        <ion-label color="dark">От {{ item.started_at }}</ion-label>
        <ion-icon :icon="closeCircleOutline" @click="save('started_at',null)"/>
      </ion-chip>
      <ion-chip v-if="item.finished_at" color="primary">
        <ion-icon :icon="calendarNumberOutline"/>
        <ion-label color="dark">До {{ item.finished_at }}</ion-label>
        <ion-icon :icon="closeCircleOutline" @click="save('finished_at',null)"/>
      </ion-chip>
    </div>

    <div class="ion-padding">
      <ion-chip v-if="!item.case_product_id" @click="itemCasePick('product')">
        <ion-icon :icon="fastFoodOutline"/>
        <ion-label>Товар</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.case_store_id" @click="itemCasePick('store')">
        <ion-icon :icon="storefrontOutline"/>
        <ion-label>Магазин</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.case_user_id" @click="itemCasePick('user')">
        <ion-icon :icon="personOutline"/>
        <ion-label>Клиент</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.case_min_sum">
        <ion-icon :icon="walletOutline"/>
        <ion-label>Сумма заказа</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.started_at">
        <ion-icon :icon="calendarClearOutline"/>
        <ion-label>Начало</ion-label>
      </ion-chip>
      <ion-chip v-if="!item.finished_at">
        <ion-icon :icon="calendarNumberOutline"/>
        <ion-label>Конец</ion-label>
      </ion-chip>
    </div>







    <ion-item-divider>
      <ion-label>Списывать с магазина</ion-label>
    </ion-item-divider>
    <div style="display:grid;grid-template-columns:repeat( auto-fill, 200px )">
      <ion-card>
        <ion-card-header>
          <ion-item lines="none">
            <ion-icon :icon="storefrontOutline" slot="start" size="large" color="primary"/>
            <ion-icon :icon="trashOutline" slot="end" color="medium" />
          </ion-item>
        </ion-card-header>
        <ion-card-content>
          Сумма <b>350</b> Магазин <b>YaEm</b>
        </ion-card-content>
      </ion-card>
    </div>
    <div class="ion-padding">
      <ion-chip>
        <ion-icon :icon="storefrontOutline"/>
        <ion-label>Магазин</ion-label>
      </ion-chip>
    </div>
    </div>


    <div v-else>
      Loading
    </div>


    <ion-modal :is-open="ipicker.is_opened">
      <ion-header>
        <ion-item>
          <ion-icon :icon="calendarClearOutline"/>
        </ion-item>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-list>
        <ion-item v-if="ipicker.start_at_opened">
          <ion-icon :icon="calendarClearOutline"/>
          <ion-input  type="date" v-model="ipicker.start_at" label="Начало действия" label-placement="stacked"/>
        </ion-item>
        <ion-item v-if="ipicker.finish_at_opened">
          <ion-icon :icon="calendarNumberOutline"/>
          <ion-input  type="date" v-model="ipicker.finish_at" label="Начало действия" label-placement="stacked"/>
        </ion-item>
        <ion-item v-if="ipicker.case_min_sum_opened">
          <ion-icon :icon="walletOutline"/>
          <ion-input  type="date" v-model="ipicker.case_min_sum" label="Минимальная сумма заказа" label-placement="stacked"/>
        </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>

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
  closeCircleOutline,

}                             from "ionicons/icons";
import ItemPicker             from '@/components/ItemPicker.vue'

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
  
  closeCircleOutline,
    }
  },
  data() {
    return {
      promoCodeId: this.$route.params.id,
      is_deleted:0,
      is_disabled:0,
      item: null,
      ipicker:{//input
        is_opened:1,
        start_at:null,
        start_at_opened:0,
        finish_at:null,
        finish_at_opened:0,
        case_min_sum:null,
        case_min_sum_opened:0,
      }
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
        if (resp == "ok") {
          this.$flash("Сохранено");
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
            this.$flash("Сумма слишком маленькая");
            break;
        }
        return false;
      }
    },
    async itemDelete(){
      return false
    },


    async itemCasePick( type ){
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
        })
        this.item.case_store_id=store.store_id
        this.item.case_store_name=store.store_name
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