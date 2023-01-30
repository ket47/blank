<template>
    <base-layout pageDefaultBackLink="/user" page-title="Редактирование проводки">    
        <ion-list v-if="transaction">
            <ion-item>
                <ion-label position="floating">Дата</ion-label>
                <ion-input v-model="transaction.trans_date" placeholder="дата" type="date"></ion-input>
            </ion-item>
            <ion-item lines="none">
                <ion-label position="floating">Тип проводки</ion-label>
                <ion-select interface="popover" placeholder="Выберите тип проводки" v-model="transaction.trans_role" required @ionChange="itemUpdateRole()">
                    <ion-select-option v-for="trans in transTypes" :key="trans.trans_role" :value="trans.trans_role">{{trans.trans_name}}</ion-select-option>
                </ion-select>
            </ion-item>
            
            <ion-item>
                <ion-select slot="start" v-model="transaction.trans_holder" disabled placeholder="Тип объекта" >
                    <ion-select-option value="order">Заказ #</ion-select-option>
                    <ion-select-option value="store">Продавец #</ion-select-option>
                    <ion-select-option value="courier">Курьер #</ion-select-option>
                </ion-select>

                <ion-label @click="holderIdPick()">{{transaction.trans_holder_label}}</ion-label>
                <ion-button slot="end" @click="holderIdPick()" >
                    <ion-icon :icon="searchOutline"/>
                </ion-button>
            </ion-item>
            <ion-item>
                <ion-label position="floating">Сумма</ion-label>
                <ion-input v-model="transaction.trans_amount" placeholder="сумма" inputmode="decimal" autocomplete="transaction-amount" min="1"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">Комментарий</ion-label>
                <ion-textarea v-model="transaction.trans_description"></ion-textarea>
            </ion-item>
            <ion-item lines="full">
                <ion-label>Отключена</ion-label>
                <ion-toggle v-model="transaction.is_disabled" />
            </ion-item>
            <ion-item lines="none">
                <ion-note v-if="transaction.created_at">
                Создано {{transaction.created_user_name}} {{transaction.created_at}}
                </ion-note>
                <ion-note v-if="transaction.created_at">
                Изменено {{transaction.updated_user_name}} {{transaction.updated_at}}
                </ion-note>
            </ion-item>
        </ion-list>
        <ion-grid v-if="transaction">
            <ion-row>
                <ion-col><ion-button color="medium" @click="itemDelete()" expand="block">Удалить</ion-button></ion-col>
                <ion-col><ion-button color="primary" @click="itemSave()" expand="block">Сохранить</ion-button></ion-col>
            </ion-row>
        </ion-grid>
    </base-layout>
</template>
<script>
import {
  IonInput,
  IonIcon,
  IonList,
  IonItem,
  IonToggle,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  modalController,
}                          from '@ionic/vue';
import {
    trashOutline,
    searchOutline,
}                          from 'ionicons/icons'
import jquery              from 'jquery'
import User                from '@/scripts/User.js'
import Utils               from '@/scripts/Utils.js'
import ItemPicker          from '@/components/ItemPicker.vue'

const transTypes=[
    {
        'trans_role':'transit->supplier',
        'trans_holder':'order',
        'trans_name':'Продавец Возврат товара',
        'trans_description':'Средства взимаемые с Продавца для воврата оплаты Покупателю. Заказ №{{trans_holder_id}}',
    },
    {
        'trans_role':'supplier->transit',
        'trans_holder':'order',
        'trans_name':'Продавец Отгрузка заказа',
        'trans_description':'Стоимость товара, отгруженного Покупателю. Заказ №{{trans_holder_id}}',
    },
    {
        'trans_role':'capital.profit->supplier',
        'trans_holder':'order',
        'trans_name':'Продавец Комиссия сайта',
        'trans_description':'Комиссия сайта за предоставленные услуги. Заказ №{{trans_holder_id}}',
    },
    {
        'trans_role':'money.account->supplier',
        'trans_holder':'store',
        'trans_name':'Продавец Выплата',
        'trans_description':'Оплата по договору за выполненые заказы',
    },
    {
        'trans_role':'supplier->money.account',
        'trans_holder':'store',
        'trans_name':'Продавец Авансирование услуг',
        'trans_description':'Аванс за услуги сайта',
    },
    {
        'trans_role':'money.account->courier',
        'trans_holder':'courier',
        'trans_name':'Курьер Выплата',
        'trans_description':'Оплата по договору за оказанные услуги',
    },
    {
        'trans_role':'courier->capital.profit',
        'trans_holder':'order',
        'trans_name':'Курьер Начисление бонуса',
        'trans_description':'Начисление бонуса за Заказ №{{trans_holder_id}}',
    },
    {
        'trans_role':'capital.profit->courier',
        'trans_holder':'order',
        'trans_name':'Курьер Штраф',
        'trans_description':'Штраф за не выполнение Заказа №{{trans_holder_id}}',
    },
]

export default {
    components: {
        IonInput,
        IonIcon,
        IonList,
        IonItem,
        IonToggle,
        IonLabel,
        IonSelect,
        IonSelectOption,
        IonTextarea,
        IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
    },
    setup(){
        return {trashOutline,searchOutline,}
    },
    data(){
        return{
            transactionId: this.$route.params.id,
            transaction:null,
            transTypes,
        }
    },
    computed:{
    },
    created(){
        const self=this
        this.$topic.on('userGet',()=>{
            self.init()
        })
        if( User.isAdmin() ){
            this.init()
        }
    },
    methods:{
        init(){
            if( !User.isAdmin() ){
                this.$router.replace('/')
            }
            this.itemGet();
        },
        async itemGet(){
            if(this.transactionId==0){
                this.transaction={}
                return
            }
            let request={
                trans_id:this.transactionId
            };
            try{
                this.transaction=await jquery.post(`${this.$heap.state.hostname}Transaction/itemGet`,request)
                this.holderLabelGet()
            }
            catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                switch(exception_code){
                    case 'forbidden':
                        this.$flash("Не достаточно прав");
                        break;
                    case 'notfound':
                        this.$flash("Проводка не найдена");
                        break;
                }
                return false
            }
        },
        async holderLabelGet(){
            try{
                this.transaction.trans_holder_label=''
                if( this.transaction.trans_holder=='order' ){
                    const request={
                        name_query:this.transaction.trans_holder_id,
                        name_query_fields:'order_id'
                    }
                    const result=await jquery.post(`${this.$heap.state.hostname}Order/listGet`,request)
                    const item=result[0]
                    this.transaction.trans_holder_label=`заказ#${item.order_id} ${item.store_name} > ${item.user_name}`
                }
                if( this.transaction.trans_holder=='store' ){
                    const request={
                        name_query:this.transaction.trans_holder_id,
                        name_query_fields:'store_id'
                    }
                    const result=await jquery.post(`${this.$heap.state.hostname}Store/listGet`,request)
                    const item=result[0]
                    this.transaction.trans_holder_label=`продавец ${item.store_name}`
                }
                if( this.transaction.trans_holder=='courier' ){
                    const request={
                        name_query:this.transaction.trans_holder_id,
                        name_query_fields:'courier_id'
                    }
                    const result=await jquery.post(`${this.$heap.state.hostname}Courier/listGet`,request)
                    const item=result[0]
                    this.transaction.trans_holder_label=`курьер ${item.user_name} ${item.user_phone}`
                }
            }catch{/** */}
        },
        async holderIdPick(){
            if(!this.transaction.trans_holder){
                return
            }
            const itemType=this.transaction.trans_holder
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
            this.transaction.trans_holder_id=item.data.id
            this.transaction.trans_holder_label=item.data.name
            this.itemRender()
        },
        validate(){
            if( !(this.transaction.trans_date) ){
                this.$flash("Дата не выбрана")
                return false
            }
            if( !(this.transaction.trans_role) ){
                this.$flash("Тип проводки не выбран")
                return false
            }
            if( !(this.transaction.trans_holder_id>0) ){
                this.$flash("Контрагент не выбран")
                return false
            }
            if( (this.transaction.trans_amount==0) ){
                this.$flash("Сумма должна не равняться нулю")
                return false
            }
            return true
        },
        async itemSave(){
            if(!this.validate()){
                return;
            }
            const request={
                trans_id:this.transaction.trans_id,
                trans_date:this.transaction.trans_date,
                trans_holder:this.transaction.trans_holder,
                trans_holder_id:this.transaction.trans_holder_id,
                trans_amount:this.transaction.trans_amount,
                trans_role:this.transaction.trans_role,
                trans_description:this.transaction.trans_description,
                is_disabled:this.transaction.is_disabled,
            }
            try{
                const remoteFunction=request.trans_id?'itemUpdate':'itemCreate'
                await jquery.post(`${this.$heap.state.hostname}Transaction/${remoteFunction}`,JSON.stringify(request))
                this.$flash("💾 сохранено")
                this.$router.go(-1);
            }
            catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                switch(exception_code){
                    case 'forbidden':
                        this.$flash("Не достаточно прав");
                        break;
                }
                this.$flash("Не удалось сохранить проводку")
                return false
            }
        },
        async itemUpdateRole(){
            this.transaction.trans_holder_id=''
            this.transaction.trans_holder_label='Выберите агента';
            this.itemRender()
        },
        itemRender(){
            const foundTransType = this.transTypes.find(trans_type => trans_type.trans_role==this.transaction.trans_role);
            if(!foundTransType){
                this.$flash("Неверный тип проводки")
                return
            }
            this.transaction.trans_tags=''
            this.transaction.trans_holder=foundTransType.trans_holder
            this.transaction.trans_description=Utils.render(foundTransType.trans_description,this.transaction)
        },
        async itemDelete(){
            if(!confirm("Вы уверенны?")){
                return
            }
            try{
                await jquery.post(`${this.$heap.state.hostname}Transaction/itemDelete`,{trans_id:this.transactionId})
                this.$router.go(-1);
            }catch{/** */}
        }
    },
}
</script>