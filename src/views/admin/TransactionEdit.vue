<template>
    <base-layout pageDefaultBackLink="/user" page-title="Редактирование проводки">    
        <ion-list v-if="transaction">
            <ion-item>
                <ion-label position="floating">Дата</ion-label>
                <ion-input v-model="transaction.trans_date" placeholder="дата" type="date"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">Тип проводки</ion-label>
                <ion-select interface="popover" placeholder="Выберите тип проводки" v-model="transaction.trans_role" required @ionChange="itemUpdateRole(1)">
                    <ion-select-option v-for="trans in transTypes" :key="trans.trans_role" :value="trans.trans_role">{{trans.trans_name}}</ion-select-option>
                </ion-select>
            </ion-item>
            <ion-item lines="none">
                <ion-label position="stacked">Родительские элементы</ion-label>
                <ion-text>
                    <ion-chip v-for="(tagLabel,tag) in tagDict" :key="tag" color="primary">#{{tagLabel}} <ion-icon v-if="tag.indexOf('acc')==-1" :src="closeCircle" @click="tagDictRemove(tag)"></ion-icon></ion-chip>
                </ion-text>
            </ion-item>
            <ion-item>
                <ion-text>
                    <ion-chip v-for="tagHolder in tagMissingNames" :key="tagHolder" @click="tagDictPick(tagHolder)" color="medium">
                        <ion-icon :src="addOutline"/><ion-label>Добавить #{{tagHolderNames[tagHolder]}}</ion-label>
                    </ion-chip>
                </ion-text>
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
  IonChip,
  IonText,
  modalController,
}                          from '@ionic/vue';
import {
    trashOutline,
    searchOutline,
    addOutline,
    closeCircle,
}                          from 'ionicons/icons'
import jquery              from 'jquery'
import User                from '@/scripts/User.js'
import Utils               from '@/scripts/Utils.js'
import ItemPicker          from '@/components/ItemPicker.vue'

const transTypes=[
    {
        'trans_role':'capital.profit->transit',
        'holder':['order','store','courier'],
        'trans_name':'Сайт Доход от доставки',
        'trans_description':'Доход от доставки. Заказ №{{order_id}}',
    },
    {
        'trans_role':'transit->supplier',
        'holder':['order','store'],
        'trans_name':'Продавец Возврат средств покупателю',
        'trans_description':'Средства взимаемые с Продавца для воврата оплаты Покупателю. Заказ №{{order_id}}',
    },
    {
        'trans_role':'supplier->transit',
        'holder':['order','store'],
        'trans_name':'Продавец Отгрузка заказа',
        'trans_description':'Стоимость товара, отгруженного Покупателю. Заказ №{{order_id}}',
    },
    {
        'trans_role':'capital.profit->supplier',
        'holder':['order','store'],
        'trans_name':'Продавец Комиссия сайта',
        'trans_description':'Комиссия сайта за предоставленные услуги. Заказ №{{order_id}}',
    },
    {
        'trans_role':'capital.account->supplier',
        'holder':['store'],
        'trans_name':'Продавец Выплата',
        'trans_description':'Выплата по договору за выполненные заказы',
    },
    {
        'trans_role':'supplier->capital.account',
        'holder':['store'],
        'trans_name':'Продавец Получение аванса',
        'trans_description':'Аванс за услуги сайта',
    },
    {
        'trans_role':'supplier->capital.profit',
        'holder':['store'],
        'trans_name':'Продавец Начисление бонуса при регистрации',
        'trans_description':'Начисление бонуса на услуги при регистрации на сайте',
    },
    {
        'trans_role':'capital.account->courier',
        'holder':['courier'],
        'trans_name':'Курьер Выплата',
        'trans_description':'Выплата по договору за оказанные услуги',
    },
    {
        'trans_role':'courier->capital.profit',
        'holder':['order','courier'],
        'trans_name':'Курьер Начисление бонуса',
        'trans_description':'Начисление бонуса за Заказ №{{order_id}}',
    },
    {
        'trans_role':'capital.profit->courier',
        'holder':['order','courier'],
        'trans_name':'Курьер Штраф',
        'trans_description':'Штраф за не выполнение Заказа №{{order_id}}',
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
        IonChip,
        IonText,
    },
    setup(){
        return {
            trashOutline,
            searchOutline,
            addOutline,
            closeCircle,
            }
    },
    data(){
        return{
            transactionId: this.$route.params.id,
            transaction:null,
            transTypes,
            tagDict:{},
            tagHolderNames:{
                order:'заказ',
                store:'продавец',
                courier:'курьер',
                acc:'счет',
            },
            tagOptionNames:{
                debit:"(+)",
                credit:"(-)",
            },
        }
    },
    computed:{
        tagRequired(){
            return this.transTypeCurrent?.holder||[]
        },
        tagMissingNames(){
            return this.tagRequired?.filter(holder=>!Object.keys(this.tagDict).join(':').includes(holder))||''
        },
        transTypeCurrent(){
            return this.transTypes.find(trans_type => trans_type.trans_role==this.transaction.trans_role)||[];
        }
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
                this.transaction.trans_date=this.transaction.trans_date?.substring(0,10)
                this.tagDictFill(this.transaction.tags)
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
        // async holderLabelGet(){
        //     try{
        //         this.transaction.trans_holder_label=''
        //         if( this.transaction.trans_holder=='order' ){
        //             const request={
        //                 name_query:this.transaction.trans_holder_id,
        //                 name_query_fields:'order_id'
        //             }
        //             const result=await jquery.post(`${this.$heap.state.hostname}Order/listGet`,request)
        //             const item=result[0]
        //             this.transaction.trans_holder_label=`заказ#${item.order_id} ${item.store_name} > ${item.user_name}`
        //         }
        //         if( this.transaction.trans_holder=='store' ){
        //             const request={
        //                 name_query:this.transaction.trans_holder_id,
        //                 name_query_fields:'store_id'
        //             }
        //             const result=await jquery.post(`${this.$heap.state.hostname}Store/listGet`,request)
        //             const item=result[0]
        //             this.transaction.trans_holder_label=`продавец ${item.store_name}`
        //         }
        //         if( this.transaction.trans_holder=='courier' ){
        //             const request={
        //                 name_query:this.transaction.trans_holder_id,
        //                 name_query_fields:'courier_id'
        //             }
        //             const result=await jquery.post(`${this.$heap.state.hostname}Courier/listGet`,request)
        //             const item=result[0]
        //             this.transaction.trans_holder_label=`курьер ${item.user_name} ${item.user_phone}`
        //         }
        //     }catch{/** */}
        // },
        // async holderIdPick(){
        //     if(!this.transaction.trans_holder){
        //         return
        //     }
        //     const itemType=this.transaction.trans_holder
        //     const modal = await modalController.create({
        //         component: ItemPicker,
        //         componentProps:{itemType},
        //         initialBreakpoint: 0.75,
        //         breakpoints: [0.75, 1],
        //         canDissmiss:true,
        //     });
        //     modal.present()
        //     this.$topic.on('dismissModal',()=>{
        //         modal.dismiss()
        //     });
        //     const item=await modal.onDidDismiss();
        //     if(!item.data){
        //         return
        //     }
        //     this.transaction.trans_holder_id=item.data.id
        //     this.transaction.trans_holder_label=item.data.name
        //     this.itemRender()
        // },
        validate(){
            if( this.tagMissingNames.length>0 ){
                this.$flash("Не выбраны все родительские элементы")
                return false
            }
            if( !(this.transaction.trans_role) ){
                this.$flash("Тип проводки не выбран")
                return false
            }
            if( !(this.transaction.trans_date) ){
                this.$flash("Дата не выбрана")
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
            const tags=Object.keys(this.tagDict??{}).join(' ')
            const request={
                tags,
                trans_id:this.transaction.trans_id,
                trans_date:this.transaction.trans_date,
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
            if( !this.transTypeCurrent ){
                this.$flash("Неверный тип проводки")
                return
            }
            this.tagDictTruncate()
        },
        itemDescriptionRender(){
            if(!this.transTypeCurrent.trans_description){
                return
            }
            const template=this.transTypeCurrent.trans_description
            let context=this.transaction
            for(let tag in this.tagDict){
                const tag_label=this.tagDict[tag]
                const tag_array=tag.split(':');
                const tag_name=tag_array[0]
                context[`${tag_name}_id`]=tag_array[1]//order_id,courier_id etc
            }
            this.transaction.trans_description=Utils.render(template,context)
        },
        async itemDelete(){
            if(!confirm("Вы уверенны?")){
                return
            }
            try{
                await jquery.post(`${this.$heap.state.hostname}Transaction/itemDelete`,{trans_id:this.transactionId})
                this.$router.go(-1);
            }catch{/** */}
        },
        async tagDictPick( itemType ){
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
                this.tagDictAdd([`order:${item.data.order_id}`,`заказ ${item.data.order_id}`])
                const order=await jquery.post(`${this.$heap.state.hostname}Order/itemGet`,{order_id:item.data.order_id})
                if( this.tagRequired.includes('store') && order.order_store_id ){
                    this.tagDictNameRemove('store')
                    item.data.store_id=order.order_store_id
                    item.data.store_name=order?.store?.store_name
                }
                if( this.tagRequired.includes('courier') && order.order_courier_id ){
                    const courier=await jquery.post(`${this.$heap.state.hostname}Courier/itemGet`,{courier_id:order.order_courier_id})
                    this.tagDictNameRemove('courier')
                    item.data.courier_id=courier.courier_id
                    item.data.courier_name=courier.courier_name
                }
            }
            if(item.data.store_id??0){
                this.tagDictAdd([`store:${item.data.store_id}`,`продавец ${item.data.store_name??'?'}`])
            }
            if(item.data.courier_id??0){
                this.tagDictAdd([`courier:${item.data.courier_id}`,`курьер ${item.data.courier_name??'?'}`])
            }
            if(item.data.type??0){
                this.tagDictAdd([`acc::${item.data.type}`,`счет ${item.data.name??'?'}`])
            }
        },
        tagDictAdd(tag){
            let dict=this.tagDict??{}
            dict[tag[0]]=tag[1]
            this.tagDict=dict
            this.itemDescriptionRender()
        },
        tagDictRemove(tag){
            let dict=this.tagDict??{}
            dict[tag] && delete dict[tag]
            const size = Object.keys(dict).length
            this.tagDict=size?dict:{}
            this.itemDescriptionRender()
        },
        tagDictNameRemove(tag_name){
            let dict=this.tagDict??{}
            const tag=Object.keys(dict)?.find(tag=>tag.indexOf(tag_name)>-1)
            this.tagDictRemove(tag)
        },
        tagDictTruncate(){
            this.tagDict={}
            this.itemDescriptionRender()
        },
        tagDictFill(tags){
            let dict={}
            if(tags){
                for(let tag of tags){
                    dict[`${tag.tag_name}:${tag.tag_id}:${tag.tag_type}:${tag.tag_option}`]=`${this.tagHolderNames[tag.tag_name]} ${this.tagOptionNames[tag.tag_option]??''} ${tag.tag_label??'(?)'}`
                }
            }
            this.tagDict=dict
            this.itemDescriptionRender()
        }
    },
}
</script>