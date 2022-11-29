<template>
  <ion-list>
    <ion-item>
      <ion-title>Баланс</ion-title>
      <ion-text slot="end" v-if="balance>0" color="success">{{ balance }}{{ $heap.state.currencySign }}</ion-text>
      <ion-text slot="end" v-else>{{ balance }}{{ $heap.state.currencySign }}</ion-text>
    </ion-item>
  </ion-list>

  <ion-accordion-group>
    <ion-accordion>
      <ion-item slot="header">
        <ion-icon :icon="settingsOutline" slot="start"/>
        <ion-text>Настройки</ion-text>
      </ion-item>
      <ion-list slot="content">
        <ion-item color="light">
          <ion-text>Начальная дата</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:110px 110px;">
            <ion-input type="date" v-model="start_at"  @ionChange="listGet()"/>
            <ion-input type="text" style="text-align:right" color="medium" v-if="meta.sum_start" :value="`${meta.sum_start}${$heap.state.currencySign}`" readonly />
          </div>
        </ion-item>
        <ion-item color="light">
          <ion-text>Обороты</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:110px 110px;">
            <ion-input type="text" style="text-align:right" color="medium" v-if="meta.sum_debit" :value="`+${meta.sum_debit}${$heap.state.currencySign}`" readonly />
            <ion-input type="text" style="text-align:right" color="medium" v-if="meta.sum_credit" :value="`-${meta.sum_credit}${$heap.state.currencySign}`" readonly />
          </div>
        </ion-item>
        <ion-item color="light">
          <ion-text>Конечная дата</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:110px 110px;">
            <ion-input type="date" v-model="finish_at" />
            <ion-input type="text" style="text-align:right" color="medium" v-if="meta.sum_finish" :value="`${meta.sum_finish}${$heap.state.currencySign}`" readonly />
          </div>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>

  <ion-list v-if="ledger==null">
    <ion-item v-for="i in [1,2,3]" :key="i">
        <ion-text slot="start"><ion-skeleton-text animated style="width:50px" /></ion-text>
        <ion-label><ion-skeleton-text animated style="width:100%" /></ion-label>
        <ion-label slot="end" color="success"><ion-skeleton-text animated style="width:50px" /></ion-label>
    </ion-item>
  </ion-list>
  <ion-list v-else-if="ledger.length>0">
    <ion-item v-for="trans in ledgerCalc" :key="trans.trans_id">
        <ion-text slot="start">{{trans.date}}</ion-text>
        <ion-text>{{trans.trans_description}}</ion-text>
        <ion-label slot="end" v-if="trans.is_debit==1" color="success">{{trans.trans_amount}}</ion-label>
        <ion-label slot="end" v-else  color="danger">{{trans.trans_amount}}</ion-label>
    </ion-item>
  </ion-list>
  <ion-list v-else>
    <ion-item>
        Нет операций в данном периоде
    </ion-item>
  </ion-list>


</template>

<script>
import {
  IonIcon,
  IonTitle,
  IonLabel,
  IonItem,
  IonInput,
  IonList,
  IonAccordion,
  IonAccordionGroup,
  IonText,
  IonSkeletonText,
} from "@ionic/vue";
import { settingsOutline } from "ionicons/icons";
import jquery from "jquery";

export default {
  components: {
    IonIcon,
    IonTitle,
    IonLabel,
    IonItem,
    IonInput,
    IonList,
    IonAccordion,
    IonAccordionGroup,
    IonText,
    IonSkeletonText,
  },
  props:['account'],
  setup(){
    return {
        settingsOutline
    }
  },
  data() {
    const today = new Date();
    const firstDay = new Date(Date.parse(`${today.getFullYear()}-${today.getMonth()+1}-1`));
    return {
      balance: '-',
      start_at: firstDay.toISOString().slice(0, 10),
      finish_at: today.toISOString().slice(0, 10),
      ledger:null,
      meta:{},
      today:today,
    };
  },
  computed:{
    ledgerCalc(){
        if( this.ledger==null ){
            return null;
        }
        let lcalc=[];
        for(let trans of this.ledger){
            trans.date=this.toLocDate(trans.trans_date)
            lcalc.push(trans)
        }
        return lcalc
    }
  },
  methods: {
    async listGet() {
      try {
        const request={
            start_at:this.start_at,
            finish_at:this.finish_at,
            account:this.account,
        }
        const response= await jquery.post(`${this.$heap.state.hostname}Transaction/listGet`,request);
        this.ledger=response.ledger
        this.meta=response.meta
        if( this.finish_at==this.today.toISOString().slice(0, 10) ){
            this.balance=response.meta.sum_finish;
        }
      } catch (err) {
        const exception = err.responseJSON;
        const exception_code = exception.messages.error;
        switch (exception_code) {
          case "no_account":
            this.$flash("Ошибка получения выписки");
            break;
          case "large_interval":
            this.$flash("Период должен быть не больше 3 месяцев");
            break;
        }
        this.ledger=[];
        return false;
      }
    },
    toLocDate( iso ){
        const event = new Date(Date.parse(iso));
        const options = { month: 'short', day: 'numeric' };

        return event.toLocaleDateString(undefined, options);
    },

  },
  mounted() {
    this.listGet();
  },
};
</script>