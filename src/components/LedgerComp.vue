<style >
.tag{
  padding: 5px;
  color:#ccc;
  display: inline-block;
}
.tag:hover{
  color: var(--ion-color-primary);
  cursor:pointer;
}
</style>


<template>
<div>
  <ion-list>
    <ion-item lines="full">
      <ion-label>Баланс</ion-label>
      <ion-text slot="end" v-if="balance>0" color="success"><b>{{ balance }}{{ $heap.state.currencySign }}</b></ion-text>
      <ion-text slot="end" v-else-if="balance<0" color="danger"><b>{{ balance }}{{ $heap.state.currencySign }}</b></ion-text>
      <ion-text slot="end" v-else color="medium"><b>{{ balance }}{{ $heap.state.currencySign }}</b></ion-text>
    </ion-item>
  </ion-list>

  <ion-accordion-group :value="settingsType">
    <ion-accordion value="period">
      <ion-item slot="header">
        <ion-icon :icon="calendarOutline" slot="start"/>
        <ion-text>Период</ion-text>
        <ion-text color="medium" slot="end">{{ start_at_dmy }} - {{ finish_at_dmy }}</ion-text>
      </ion-item>
      <ion-list slot="content">
        <ion-item>
          <ion-text color="medium">Начальная дата</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:120px 100px;">
            <ion-input type="date" v-model="start_at"  @ionInput="listGet()" debounce="500" />
            <ion-input type="text" style="text-align:right" v-if="meta.sum_start" :value="`${meta.sum_start}${$heap.state.currencySign}`" readonly />
          </div>
        </ion-item>
        <ion-item>
          <ion-text color="medium">Обороты</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:120px 100px;">
            <ion-input type="text" style="text-align:right" v-if="meta.sum_debit" :value="`+${meta.sum_debit}${$heap.state.currencySign}`" readonly />
            <ion-input type="text" style="text-align:right" v-if="meta.sum_credit" :value="`-${meta.sum_credit}${$heap.state.currencySign}`" readonly />
          </div>
        </ion-item>
        <ion-item>
          <ion-text color="medium">Конечная дата</ion-text>
          <div slot="end" style="display:grid;grid-template-columns:120px 100px;">
            <ion-input type="date" v-model="finish_at"  @ionChange="listGet()" />
            <ion-input type="text" style="text-align:right" v-if="meta.sum_finish" :value="`${meta.sum_finish}${$heap.state.currencySign}`" readonly />
          </div>
        </ion-item>
      </ion-list>
    </ion-accordion>
    <ion-accordion value="tags">
      <ion-item slot="header">
        <ion-icon :icon="pricetagOutline" slot="start"/>
        <ion-text>Фильтр по тегам</ion-text>
      </ion-item>
      <ion-list slot="content">
        <ion-item lines="none">
          <ion-text>
            <ion-text v-if="!tagDict" color="medium">нажмите на #тег для фильтрации</ion-text>
            <ion-chip v-for="(tagLabel,tag) in tagDict" :key="tag" color="primary">#{{tagLabel}} <ion-icon :src="closeCircle" @click="itemTagRemove(tag)"></ion-icon></ion-chip>
            <ion-chip @click="itemTagCreate()" color="medium" v-if="is_admin"><ion-icon :src="addOutline"/><ion-label>Добавить #тег</ion-label></ion-chip>
          </ion-text>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>
  <ion-searchbar v-model="searchQuery" placeholder="Поиск по сумме или описанию" debounce="300" @ionInput="listGet()"/>
  <ion-list v-if="ledger==null">
    <ion-item v-for="i in [1,2,3]" :key="i">
        <ion-text slot="start"><ion-skeleton-text animated style="width:50px" /></ion-text>
        <ion-label><ion-skeleton-text animated style="width:100%" /></ion-label>
        <ion-label slot="end" color="success"><ion-skeleton-text animated style="width:50px" /></ion-label>
    </ion-item>
  </ion-list>



  <ion-list v-else-if="ledger.length>0">
    <ion-item detail="false">
      <ion-chip @click="listGet()" color="medium">
        <ion-icon :src="refreshOutline"/>
        <ion-label>Обновить</ion-label>
      </ion-chip>
    </ion-item>
    <div v-for="trans in ledgerCalc" :key="trans.trans_id">
      <ion-item :detail="is_admin" lines="none" @click="itemClick(trans.trans_id)">
          <ion-text slot="start">{{trans.date}}</ion-text>
          <ion-text>
            {{trans.trans_description}}
          </ion-text>
          <ion-label slot="end" v-if="trans.amount_sign*trans.trans_amount>0" color="success">{{trans.trans_amount}}</ion-label>
          <ion-label slot="end" v-else-if="trans.amount_sign*trans.trans_amount<0"  color="danger">{{trans.trans_amount}}</ion-label>
          <ion-label slot="end" v-else  color="medium">{{trans.trans_amount}}</ion-label>
      </ion-item>
      <ion-item>
        <ion-text>
          <div class="tag" v-for="(tag,i) in trans.tag_list" :key="i" @click="itemTagAdd(tag)">#{{tag[1]}}</div>
        </ion-text>
      </ion-item>
    </div>
  </ion-list>


  <ion-list v-else>
    <ion-item>
        Нет операций в данном периоде
    </ion-item>
  </ion-list>



  <ion-infinite-scroll @ionInfinite="listLoadMore($event)" id="moderation-infinite-scroll">
      <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Загрузка..."></ion-infinite-scroll-content>
  </ion-infinite-scroll>
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  modalController,
  actionSheetController,
}                             from "@ionic/vue";
import { 
  calendarOutline,
  addOutline,
  closeCircle,
  pricetagOutline,
  refreshOutline,
  calculatorOutline,
}                             from "ionicons/icons";
import jquery                 from "jquery";
import User                   from '@/scripts/User.js'
import Utils                  from '@/scripts/Utils.js'

import ItemPicker             from '@/components/ItemPicker.vue'

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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  },
  props:['permanentTag'],
  setup(){
    return {
      calendarOutline,
      addOutline,
      closeCircle,
      pricetagOutline,
      refreshOutline,
      calculatorOutline,
    }
  },
  data() {
    const today=Utils.date.today()
    const firstDay=Utils.date.firstDay(-1)
    return {
      balance: '-',
      start_at: Utils.date.toIso(firstDay),
      finish_at: Utils.date.toIso(today),
      searchQuery:'',
      tagQuery:'',
      tagDict:null,

      ledger:null,
      meta:{},
      today:today,
      settingsType:null,

      can_reload_at:0
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
            trans.tag_list= trans.tags?.substring(1)?.toLowerCase()?.split('|')?.map(tag=>tag.split('#'))
            lcalc.push(trans)
        }
        return lcalc
    },
    is_admin(){
      return User.isAdmin()
    },
    start_at_dmy(){
      return Utils.date.isoToDmy(this.start_at)
    },
    finish_at_dmy(){
      return Utils.date.isoToDmy(this.finish_at)
    },
  },
  watch:{
    query:function(){
      this.listGet()
    }
  },
  methods: {
    async listLoadMore(ev){
        await this.listGet('append')
        ev.target.complete();
    },
    async listGet(mode) {
      const now=Date.now()
      if(!mode && this.can_reload_at>now){
        return
      }
      this.can_reload_at=now+1000
      try {
        const tagQuery=Object.keys(this.tagDict??{})?.join(' ')
        const request={
            start_at:this.start_at,
            finish_at:this.finish_at,
            tagQuery:`${tagQuery} ${this.permanentTag??''}`,
            searchQuery:this.searchQuery,
            limit:10
        }
        if(mode=='append'){
            request.offset=this.ledger?.length??0
            request.limit=10
        }
        const response= await jquery.post(`${this.$heap.state.hostname}Transaction/listGet`,request)
        if( mode=='append' ){
            this.ledger??=[]
            response.ledger=this.ledger.concat(response.ledger)
        }
        this.ledger=response.ledger
        this.meta=response.meta
        //if( this.finish_at==this.today ){
            this.balance=response.meta.sum_finish
        //}
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
              data: 'order',
            },
            {
              text: 'Продавец',
              data: 'store',
            },
            {
              text: 'Курьер',
              data: 'courier',
            },
            {
              text: 'Счет',
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