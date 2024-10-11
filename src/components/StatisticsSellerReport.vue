<style scoped>
.table_head{
    display:grid;
    grid-template-columns:repeat(2,auto);
    font-size:.8em;
    background-color: #ccc;
    border-radius: 2px;
    margin: 10px;
    width:250px;
    row-gap:1px;
}
.table_head>div{
    padding: 15px;
    background-color: #fcfcfc;
}
.table_head>div:nth-child(even){
    text-align: right;
    color:var(--ion-color-primary);
}
.table{
    display:grid;
    grid-template-columns:repeat(11,auto);
    font-size:.6em;
    margin: 10px;
}
.table_h{
    display:contents;
    font-weight:bold;
    text-align: center;
    white-space: nowrap;
    border-radius:15px;
}
.table_r{
    display:contents;
}
.table_r:nth-child(odd)>div{
    background-color: #fcfcfc;
}
.table_r:hover>div{
    background-color: var(--ion-color-primary-tint);
}
.table_h>div{
    color:var(--ion-color-primary);
    font-weight: bold;
    background-color: var(--ion-color-primary-tint);
    padding: 15px;
    border-bottom: 3px var(--ion-color-primary) solid;
}
.table_r>div{
    padding: 10px;
    border-bottom: 1px #ccc solid;
}
</style>
<template>
<div>
  <ion-accordion-group>
    <ion-accordion value="period">
      <ion-item slot="header">
        <ion-icon :icon="calendarOutline" slot="start"/>
        <ion-text>Период <small>{{start_at}} до {{finish_at}}</small></ion-text>
      </ion-item>
      <ion-list slot="content">
        <ion-item>
          <ion-text>Начальная дата</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:120px;">
            <ion-input type="date" v-model="start_at"  @ionInput="reportGet()"/>
          </div>
        </ion-item>
        <ion-item>
          <ion-text>Конечная дата</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:120px;">
            <ion-input type="date" v-model="finish_at"  @ionInput="reportGet()" />
          </div>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>

  <div class="horizontalScroller">
      <ion-chip @click="reportExport()" color="medium"><ion-icon :src="downloadOutline"/><ion-label>Скачать</ion-label></ion-chip>
      <!-- <ion-chip @click="reportPrint()" color="medium"><ion-icon :src="printOutline"/><ion-label>Напечатать</ion-label></ion-chip> -->
      <ion-chip @click="reportGet()" color="medium"><ion-icon :src="reloadOutline"/><ion-label>Обновить</ion-label></ion-chip>
  </div>

  <ion-searchbar v-model="searchQuery" placeholder="Поиск по товару" @ionInput="reportGet()" debounce="500" />
  <ion-list v-if="report==null">
    <ion-item v-for="i in [1,2,3]" :key="i">
        <ion-text slot="start"><ion-skeleton-text animated style="width:50px" /></ion-text>
        <ion-label><ion-skeleton-text animated style="width:100%" /></ion-label>
        <ion-label slot="end" color="success"><ion-skeleton-text animated style="width:50px" /></ion-label>
    </ion-item>
  </ion-list>
  <div v-else-if="report.body.length>0" class="printDiv">
    <div class="table_head">
        <div>Количество</div><div>{{report.head.total_quantity}}</div>
        <div>Скидка</div><div>{{report.head.total_discount}}</div>
        <div>Сумма</div><div>{{report.head.total_sum}}</div>
        <div>Вознаграждение</div><div>{{report.head.total_commission}}</div>
        <div>К выплате</div><div>{{report.head.total_topay}}</div>
    </div>
    <div class="table" style="overflow-x:scroll">
        <div class="table_h">
            <div>Время</div>
            <div>Заказ №</div>
            <div>Товар</div>
            <div>Цена</div>
            <div>Количество</div>
            <div>Скидка</div>
            <div>Сумма</div>
            <div>Вознаграждение %</div>
            <div>Доставка</div>
            <div>Оплата</div>
            <div>Чек</div>
        </div>
        <div v-for="(row,i) in report.body" :key="i" class="table_r">
            <div>{{row.created_at}}</div>
            <div>{{row.order_id}}</div>
            <div>{{row.entry_text}}</div>
            <div>{{row.entry_price}}</div>
            <div>{{row.entry_quantity}}</div>
            <div>{{row.entry_discount}}</div>
            <div>{{row.entry_sum}}</div>
            <div>{{row.fee}}</div>
            <div>{{row.delivery}}</div>
            <div>{{row.payment_type}}</div>
            <div><a v-if="row.invoice_link" :href="row.invoice_link" target="_new">онлайн чек</a></div>
        </div>
    </div>
  </div>
  <ion-list v-else>
    <ion-item>
        Нет заказов в данном периоде
    </ion-item>
  </ion-list>
</div>
</template>
<script>
import {
  IonIcon,
  IonLabel,
  IonItem,
  IonInput,
  IonList,
  IonAccordion,
  IonAccordionGroup,
  IonText,
  IonSkeletonText,
  IonSearchbar,
  IonChip,
}                             from "@ionic/vue";
import { 
  calendarOutline,
  addOutline,
  closeCircle,
  pricetagOutline,
  downloadOutline,
  reloadOutline,
  printOutline,
}                             from "ionicons/icons";
import jquery                 from "jquery";

export default { 
  components: {
    IonIcon,
    IonLabel,
    IonItem,
    IonInput,
    IonList,
    IonAccordion,
    IonAccordionGroup,
    IonText,
    IonSkeletonText,
    IonSearchbar,
    IonChip,
  },
  props:['store'],
  setup(){
    return {
      calendarOutline,
      addOutline,
      closeCircle,
      pricetagOutline,
      downloadOutline,
      reloadOutline,
      printOutline,
    }
  },
  data() {
    const today = new Date();
    const firstDay = new Date(Date.UTC(today.getFullYear(),today.getMonth(),1));
    return {
      start_at: firstDay.toISOString().slice(0, 10),
      finish_at: today.toISOString().slice(0, 10),
      searchQuery:'',

      report:null,
      today:today,
    };
  },
  watch:{
    store:function(){
        this.reportGet()
    }
  },
  methods: {
    async reportGet() {
        if(!this.store?.store_id){
            this.report=null
            this.head=null
            return
        }
        try {
            const request={
                store_id:this.store?.store_id,
                start_at:this.start_at,
                finish_at:this.finish_at,
                searchQuery:this.searchQuery
            }
            const response= await jquery.post(`${this.$heap.state.hostname}Statistics/sellReportProductGet`,request)
            this.report=response
        } catch (err) {
            const exception_code = err?.responseJSON?.messages?.error;
            switch (exception_code) {
                case "large_interval":
                this.$flash("Период должен быть не больше 3 месяцев")
                break;
                default:
                this.$flash("Ошибка получения выписки")
                break;
            }
            this.ledger=[]
            this.balance=0
            return false;
        }
    },
    reportPrint(){
        window.print()
    },
    async reportExport(){
        if(!this.store?.store_id){
            this.report=null
            this.head=null
            return
        }
        try {
            const request={
                store_id:this.store?.store_id,
                start_at:this.start_at,
                finish_at:this.finish_at,
                searchQuery:this.searchQuery,
                output:'xlsx'
            }
            const response= await jquery.post(`${this.$heap.state.hostname}Statistics/sellReportProductGet`,request)
            const storeNameCleared=this.store.store_name.replace(/[^\wа-яА-Яa-zA-Z]/gi,'')
            const reportUrl=`${this.$heap.state.hostname}Statistics/download/${response}/sellReport_${storeNameCleared}_${this.start_at}.xlsx`
            const anchor = document.createElement('a')
            anchor.href =reportUrl
            anchor.download='download'
            anchor.click()
        } catch (err) {
            const exception_code = err?.responseJSON?.messages?.error;
            switch (exception_code) {
                case "large_interval":
                    this.$flash("Период должен быть не больше 3 месяцев")
                    break;
                default:
                    this.$flash("Ошибка получения выписки")
                    console.log(err)
                    break;
            }
            this.ledger=[]
            this.balance=0
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
    this.reportGet()
  },
};
</script>