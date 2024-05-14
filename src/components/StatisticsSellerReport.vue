<style scoped>
.table{
    display:grid;
    grid-template-columns:repeat(10,auto);
    --gap:1px;
    font-size:.8em;
}
.table_h{
    display:contents;
    font-weight:bold;
    text-align: center;
    white-space: nowrap;
}
.table_r{
    display:contents;
}
.table_r:nth-child(odd)>div{
    background-color: #eee;
}
.table_h>div{
    background-color: #def;
    padding: 5px;
}
.table_r>div{
    padding: 5px;
}
</style>
<template>
<div>
  <ion-accordion-group value="period">
    <ion-accordion value="period">
      <ion-item slot="header">
        <ion-icon :icon="calendarOutline" slot="start"/>
        <ion-text>Период</ion-text>
      </ion-item>
      <ion-list slot="content">
        <ion-item>
          <ion-text>Начальная дата</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:120px 100px;">
            <ion-input type="date" v-model="start_at"  @ionChange="listGet()"/>
          </div>
        </ion-item>
        <ion-item>
          <ion-text>Конечная дата</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:120px 100px;">
            <ion-input type="date" v-model="finish_at"  @ionChange="listGet()" />
          </div>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>
  <ion-searchbar v-model="searchQuery" placeholder="Поиск по товару или заказу" @ionChange="listGet()" />
  <ion-list v-if="report==null">
    <ion-item v-for="i in [1,2,3]" :key="i">
        <ion-text slot="start"><ion-skeleton-text animated style="width:50px" /></ion-text>
        <ion-label><ion-skeleton-text animated style="width:100%" /></ion-label>
        <ion-label slot="end" color="success"><ion-skeleton-text animated style="width:50px" /></ion-label>
    </ion-item>
  </ion-list>
  <div v-else-if="report.length>0" style="overflow-x:scroll">
    <div class="table">
        <div class="table_h">
            <div>Заказ №</div>
            <div>Товар</div>
            <div>Цена</div>
            <div>Количество</div>
            <div>Скидка</div>
            <div>Сумма</div>
            <div>Комиссия %</div>
            <div>Доставка</div>
            <div>Оплата</div>
            <div>Чек</div>
        </div>
        <div v-for="(row,i) in report" :key="i" class="table_r">
            <div>{{row.order_id}}</div>
            <div>{{row.entry_text}}</div>
            <div>{{row.entry_price}}</div>
            <div>{{row.entry_quantity}}</div>
            <div>{{row.entry_discount}}</div>
            <div>{{row.entry_sum}}</div>
            <div>{{row.fee}}</div>
            <div>{{row.delivery}}</div>
            <div>{{row.payment_type}}</div>
            <div>{{row.invoice_link}}</div>
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
  IonTitle,
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
  modalController,
  actionSheetController,
}                             from "@ionic/vue";
import { 
  calendarOutline,
  addOutline,
  closeCircle,
  pricetagOutline,
}                             from "ionicons/icons";
import jquery                 from "jquery";
import User                   from '@/scripts/User.js'

import ItemPicker             from '@/components/ItemPicker.vue'

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
    IonSearchbar,
    IonChip,
  },
  props:['permanentTag'],
  setup(){
    return {
      calendarOutline,
      addOutline,
      closeCircle,
      pricetagOutline,
    }
  },
  data() {
    console.log(this.query)
    const today = new Date();
    const firstDay = new Date(Date.parse(`${today.getFullYear()}-${today.getMonth()+1}-1`));
    return {
      start_at: firstDay.toISOString().slice(0, 10),
      finish_at: today.toISOString().slice(0, 10),
      searchQuery:'',

      report:null,
      today:today,
    };
  },
  computed:{
    // ledgerCalc(){
    //     if( this.ledger==null ){
    //         return null;
    //     }
    //     let lcalc=[];
    //     for(let trans of this.ledger){
    //         trans.date=this.toLocDate(trans.trans_date)
    //         trans.tag_list= trans.tags?.substring(1)?.toLowerCase()?.split('|')?.map(tag=>tag.split('#'))
    //         lcalc.push(trans)
    //     }
    //     return lcalc
    // },
    is_admin(){
      return User.isAdmin()
    }
  },
  watch:{
    query:function(){
      this.listGet()
    }
  },
  methods: {
    async listGet() {
      try {
        const request={
            start_at:this.start_at,
            finish_at:this.finish_at,
            searchQuery:this.searchQuery
        }
        const response= await jquery.post(`${this.$heap.state.hostname}Store/statSellReportGet`,request)
        this.report=response.body
        this.meta=response.meta
        if( this.finish_at==this.today.toISOString().slice(0, 10) ){
            this.balance=response.meta.sum_finish
        }
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
    toLocDate( iso ){
        const event = new Date(Date.parse(iso));
        const options = { month: 'short', day: 'numeric' };

        return event.toLocaleDateString(undefined, options);
    },
    itemClick(trans_id){
      if( !User.isAdmin() ){
        return
      }
      this.$go(`/admin/transaction-edit-${trans_id}`)
    },
    async itemTagPick( itemType ){
      const modal = await modalController.create({
          component: ItemPicker,
          componentProps:{itemType},
          initialBreakpoint: 0.75,
          breakpoints: [0.75, 1],
          canDissmiss:true,
      });
      modal.present()
      this.$topic.on('dismissModal',()=>{
          modal.dismiss()
      });
      const item=await modal.onDidDismiss();
      if(!item.data){
          return
      }

      if(item.data.order_id??0){
        this.itemTagAdd([`order:${item.data.order_id}`,`заказ ${item.data.order_id}`])
      }
      if(item.data.store_id??0){
        this.itemTagAdd([`store:${item.data.store_id}`,`продавец ${item.data.store_name}`])
      }
      if(item.data.courier_id??0){
        this.itemTagAdd([`courier:${item.data.courier_id}`,`курьер ${item.data.courier_name}`])
      }
      if(item.data.type??0){
        this.itemTagAdd([`acc::${item.data.type}`,`счет ${item.data.name}`])
      }
    },
    async itemTagCreate(){
        const actionSheet = await actionSheetController.create({
          header: 'Тип тега',
          buttons: [
            {
              text: 'Заказ',
              role: 'destructive',
              data: 'order',
            },
            {
              text: 'Продавец',
              role: 'destructive',
              data: 'store',
            },
            {
              text: 'Курьер',
              role: 'destructive',
              data: 'courier',
            },
            {
              text: 'Счет',
              role: 'destructive',
              data: 'acc',
            },
          ],
        });
        await actionSheet.present();
        const itemType = await actionSheet.onDidDismiss();
        if(itemType?.data){
          this.itemTagPick(itemType?.data)
        }
    },
    itemTagAdd(tag){
      let dict=this.tagDict??{}
      dict[tag[0]]=tag[1]
      this.tagDict=dict
      this.listGet()
      this.settingsType='tags'
    },
    itemTagRemove(tag){
      let dict=this.tagDict??{}
      dict[tag] && delete dict[tag]
      const size = Object.keys(dict).length
      this.tagDict=size?dict:null
      this.listGet()
      this.settingsType='tags'
    }
  },
  mounted() {
    this.listGet()
  },
};
</script>