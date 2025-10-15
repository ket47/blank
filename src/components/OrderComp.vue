<style scoped>
    .entry-deleted{
        color:var(--ion-color-danger);
    }
</style>
<template>
    <div v-if="orderData">
        <ion-item detail button @click="storeOpen()" lines="none">
            <ion-avatar v-if="orderData?.store?.image_hash" slot="start">
                <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData?.store?.image_hash}.80.80.webp`" style="border-radius:100px"/>
            </ion-avatar>
            <ion-icon v-else slot="start" :icon="storefrontOutline"></ion-icon>
            <ion-label>{{orderData?.store?.store_name}}</ion-label>
        </ion-item>

        <ion-list>
            <ion-item lines="none">
                <ion-chip :color="arrivalTimeColor" v-if="orderData?.time_plan?.start_plan" @click="timePlanInfo()" >
                    <!-- <ion-icon :icon="flagOutline"></ion-icon> -->
                    <ion-label>{{ arrivalTime }}</ion-label>
                </ion-chip>
                
                <!-- <ion-label v-if="orderData.order_id>0" color="medium"></ion-label>

                <ion-label v-else color="medium">Корзина</ion-label> -->

                <ion-chip color="primary" slot="end" v-if="orderData.stage_current && orderData.stage_current!='customer_cart' ">
                    <ion-icon :icon="checkmarkOutline"></ion-icon>
                    <ion-label>{{orderData.stage_current_name}}</ion-label>
                </ion-chip>
            </ion-item>
            <ion-item v-for="entry in orderData?.entries"  :key="entry.product_id" :class="entry.deleted_at?'entry-deleted':''" lines="full" style="padding-top:10px;">
                <ion-thumbnail slot="start" v-if="entry.image_hash" @click="productOpen(entry.product_id)">
                    <ion-img :src="`${$heap.state.hostname}image/get.php/${entry.image_hash}.150.150.webp`" style="border-radius:10px" alt=""/>
                </ion-thumbnail>
                <div style="display:grid;grid-template-columns:auto 135px;width:100%;gap:5px;">
                    <div style="grid-column: 1 / span 2">
                        {{ entry.entry_text }}
                    </div>
                    <div>
                        <ion-label color="primary">
                            {{ entry.entry_price }}{{$heap.state.currencySign}}
                        </ion-label>
                    </div>
                    <div v-if="entry.product_id"  style="position:relative;min-height:40px;">
                        <cart-add-buttons v-if="isEditable" buttonLayout="horizontal" :entry="entry" :orderData="orderData"></cart-add-buttons>
                        <ion-text v-else color="primary"> 
                            <b style="font-size:16px">{{entry.entry_quantity}}</b>
                            <span v-if="entry.product_unit=='порция'"> по {{entry.product_weight*1000}}г</span>
                            <span v-else-if="entry.product_unit=='порция мл'"> по {{entry.product_weight*1000}}мл</span>
                            <span v-else> {{entry.product_unit}}</span>
                        </ion-text>
                    </div>


                    <div v-if="atCorrection" style="grid-column: 1 / span 2">
                        <ion-chip v-if="entry.entry_discount>0" color="success">
                            <ion-label @click="itemDiscountEdit(entry)">-{{entry.entry_discount}}{{$heap.state.currencySign}} скидка</ion-label>
                            <ion-icon color="medium" :src="trash" @click="itemDiscountEdit(entry,'remove')"/>
                        </ion-chip>
                        <ion-chip v-else color="success" @click="itemDiscountEdit(entry)">+ Сделать скидку</ion-chip>
                    </div>
                    <div v-else-if="entry.entry_discount>0" style="grid-column: 1 / span 2">
                        <ion-label color="success">-{{entry.entry_discount}}{{$heap.state.currencySign}} скидка</ion-label>
                    </div>

                    <div v-if="isEditable" style="grid-column: 1 / span 2">
                        <ion-chip v-if="entry.entry_comment" color="medium">
                            <ion-icon color="medium" :src="chatboxEllipsesOutline"/> <ion-note @click="itemCommentEdit(entry)">{{ entry.entry_comment }}</ion-note>
                            <ion-icon color="medium" :src="trash" @click="itemCommentEdit(entry,'remove')"/>
                        </ion-chip>
                        <ion-chip v-else color="light"  @click="itemCommentEdit(entry)">+ Комментарий</ion-chip>
                    </div>
                    <div v-else-if="entry.entry_comment" style="grid-column: 1 / span 2">
                        <ion-icon color="medium" :src="chatboxEllipsesOutline"/> <ion-note>{{ entry.entry_comment }}</ion-note>
                    </div>

                    
                </div>
            </ion-item>
            <ion-accordion-group>
                <ion-accordion>
                    <ion-item slot="header">
                        <ion-icon :icon="walletOutline" slot="start" color="medium"></ion-icon>
                        <ion-text color="medium">Итого: </ion-text>
                        <ion-label slot="end" color="primary"><b>{{ orderData.order_sum_total||orderTotal }}{{$heap.state.currencySign}}</b></ion-label>
                    </ion-item>
                    <ion-list slot="content">
                        <ion-item lines="none">
                            <ion-icon :icon="cubeOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Стоимость заказа </ion-text>
                            <ion-label slot="end" color="medium">{{ orderTotal }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                        <ion-item lines="none" v-if="orderData.order_sum_promo>0">
                            <ion-icon :icon="giftOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Скидка </ion-text>
                            <ion-label slot="end" color="medium">-{{ orderData.order_sum_promo }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                        <ion-item lines="none" v-if="orderData.order_sum_delivery>0">
                            <ion-icon :icon="rocketOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Доставка </ion-text>
                            <ion-label slot="end" color="medium">{{ orderData.order_sum_delivery }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                        <!-- <ion-item lines="none" v-if="orderData?.info?.payment_card_fixate_sum>0">
                            <ion-icon :icon="cardOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Предоплата </ion-text>
                            <ion-label slot="end" color="medium"><b>{{ orderData?.info?.payment_card_fixate_sum }}{{$heap.state.currencySign}}</b></ion-label>
                        </ion-item> -->
                    </ion-list>
                </ion-accordion>
            </ion-accordion-group>
        </ion-list>

        <ion-card v-if="orderData?.stage_current=='supplier_start' && ['supplier','admin'].includes(orderData?.user_role)" color="medium">
            <ion-card-header>
                <ion-card-title>Фото заказа</ion-card-title>
            </ion-card-header>
            <ion-card-content>Рекомендуем делать фотографии товара до упаковки.  Ответственность, в случае претензий лежит на <b>Вас</b>.</ion-card-content>
        </ion-card>

        <ion-card v-if="orderData?.stage_current=='customer_disputed' && ['supplier','admin'].includes(orderData?.user_role)" color="medium">
            <ion-card-header>
                <ion-card-title>Спор</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p>
                    Вы можете откорректировать заказ, если согласны с возражением клиента <b>{{ orderData.customer.user_name }}</b> <ion-chip><a :href="`tel:+${orderData.customer.user_phone}`" style="color:white">+{{ orderData.customer.user_phone }}</a></ion-chip>
                </p>
            </ion-card-content>
        </ion-card>

        <ion-card v-if="orderData?.stage_current=='supplier_corrected' && ['supplier','admin'].includes(orderData?.user_role)" color="medium">
            <ion-card-header>
                <ion-card-title>Корректировка заказа</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p>
                    Вы можете <ion-icon slot="start" :src="addCircle" size="small" style="vertical-align: bottom;" />добавлять, 
                    <ion-icon slot="start" :src="trashSharp" size="small" style="vertical-align: bottom;" />удалять товар а так же 
                    <ion-icon slot="start" :src="backspaceSharp" size="small" style="vertical-align: bottom;" />изменять количество в заказе. 
                </p>
                <p>
                    Созвонитесь с клиентом <b>{{ orderData.customer.user_name }}</b> <ion-chip><a :href="`tel:+${orderData.customer.user_phone}`" style="color:white">+{{ orderData.customer.user_phone }}</a></ion-chip>
                </p>
                <p v-if="orderData?.info?.payment_card_fixate_sum">
                    Предоплата клиента {{ orderData?.info?.payment_card_fixate_sum }}{{$heap.state.currencySign}}.
                </p>
            </ion-card-content>
        </ion-card>
        <ion-card v-if="orderData?.stage_current=='system_start' && ['supplier','admin'].includes(orderData?.user_role)" color="medium">
            <ion-card-header>
                <ion-card-title>Начните подготовку</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p>
                    Нажмите кнопку "Начать подготовку". Клиент все еще может отменить заказ.
                </p>
            </ion-card-content>
        </ion-card>

        <ion-card v-if="orderData?.info?.payment_card_fixate_sum>orderData?.order_sum_total && ['customer'].includes(orderData?.user_role)" color="medium">
            <ion-card-header>
                <ion-card-title>Сдача</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p>
                    {{ orderData.customer.user_name }}, сдача по этому заказу {{Number(orderData?.info?.payment_card_fixate_sum-orderData?.order_sum_total).toFixed(2)}}{{$heap.state.currencySign}} вернется на вашу карту после нажатия кнопки ✅Принять.
                </p>
            </ion-card-content>
        </ion-card>


        <div class="ion-padding" v-if="isEditable">
            <ion-textarea style="background-color:var(--ion-color-light-tint);border-radius:10px" label="" rows="2" placeholder="комментарий к заказу" @ionChange="orderDescriptionChanged($event.target.value)" :value="orderData.order_description"></ion-textarea>
        </div>
        <ion-card color="primary"  v-else-if="orderData.order_description">
            <ion-card-header>
                <ion-card-title>Комментарий</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{orderData.order_description}}</ion-card-content>
        </ion-card>

        <ion-card color="warning"  v-if="orderData.order_objection">
            <ion-card-header>
                <ion-card-title>Проблема с заказом</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{orderData.order_objection}}</ion-card-content>
        </ion-card>

        <ion-card color="light"  v-if="orderData?.info?.tariff_info">
            <ion-card-header>
                <ion-card-title>Оплата и доставка</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-text v-html="orderData.info.tariff_info"></ion-text>
            </ion-card-content>
        </ion-card>

        <ion-grid>
            <ion-row>
                <ion-col  v-for="(stage_title, order_stage_code) in nextStageButtons" :key="order_stage_code" >
                    <ion-button 
                    v-if="stage_title[0]" 
                    @click="stageCreate(orderData.order_id, order_stage_code, stage_title[1])" 
                    expand="block" 
                    :color="stage_title[1]??'primary'"
                    :fill="stage_title[2]??'solid'"
                    style="white-space: nowrap;"
                    >
                        <ion-icon slot="start" :src="stage_title.icon"></ion-icon>
                        {{ stage_title[0] }}
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-grid>
    </div>
    <div v-else>
        <ion-item detail button lines="none">
            <ion-icon slot="start" :icon="storefrontOutline"></ion-icon>
            <ion-skeleton-text animated style="width: 200px"></ion-skeleton-text>
        </ion-item>
        <ion-list>
            <ion-item v-for="i in [1,2,3]" :key="i">
                <ion-thumbnail style="background-color:var(--ion-color-light)"></ion-thumbnail>
                <ion-grid>
                    <ion-col>
                        <ion-row><ion-skeleton-text animated style="width: 100%"></ion-skeleton-text></ion-row>
                        <ion-row><ion-label color="primary"><ion-skeleton-text animated style="width: 100px"></ion-skeleton-text></ion-label></ion-row>
                    </ion-col>
                </ion-grid>
                <div slot="end" style="position:relative;width:120px;min-height:48px;background-color:var(--ion-color-light)">
                </div>
            </ion-item>
        </ion-list>
        <ion-grid>
            <ion-row>
                <ion-col  v-for="i in [1,2]" :key="i">
                    <ion-button color="light" style="width:100%"></ion-button>
                </ion-col>
            </ion-row>
        </ion-grid>
    </div>

</template>

<script>
import {
    IonIcon,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonChip,
    IonImg,
    IonThumbnail,
    IonNote,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonSkeletonText,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonAvatar,
    IonAccordionGroup,
    IonAccordion,
    IonTextarea,
    alertController,
}                       from '@ionic/vue';
import { 
    addCircle,
    trashSharp,
    backspaceSharp,
    remove, 
    rocketOutline, 
    storefrontOutline,
    checkmarkOutline,
    cubeOutline,
    walletOutline,
    banOutline,
    giftOutline,
    cardOutline,
    ribbonOutline,
    chatboxEllipsesOutline,
    flagOutline
}                       from 'ionicons/icons';
import CartAddButtons   from '@/components/CartAddButtons.vue';
import jQuery           from "jquery";
import Order            from "@/scripts/Order.js"
import Utils        from '@/scripts/Utils.js'
export default({
    props:['orderData'],
    components: {
    CartAddButtons,
    IonIcon,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonChip,
    IonImg,
    IonThumbnail,
    IonNote,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonSkeletonText,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonAvatar,
    IonAccordionGroup,
    IonAccordion,
    IonTextarea,
    },
    setup() {
        return { 
            addCircle,
            trashSharp,
            backspaceSharp,
            remove, 
            rocketOutline, 
            storefrontOutline, 
            checkmarkOutline,    
            cubeOutline, 
            banOutline,
            walletOutline,
            giftOutline,
            cardOutline,
            ribbonOutline,
            chatboxEllipsesOutline,
            flagOutline
        };
    },
    data(){
        return {
        };
    },
    computed:{
        orderTotal(){
            let total=0;
            for(let k in this.orderData?.entries){
                let entry=this.orderData?.entries[k];
                if( !entry || !entry.entry_quantity || !entry.entry_price ){
                    continue;
                }
                total+= (entry.entry_quantity) * (entry.entry_price) - (entry.entry_discount||0);
            }
            return Math.round(total);
        },
        isEditable(){
            return this.atCorrection || this.atCart
        },
        atCorrection(){
            if( 
                (this.orderData.user_role=='supplier' || this.orderData.user_role=='admin') 
                && ['supplier_corrected'].includes(this.orderData.stage_current) 
                ){
                return true
            }
            return false;
        },
        atCart(){
            if(
                (this.orderData.user_role=='customer' || this.orderData.user_role=='admin')
                && ['customer_cart'].includes(this.orderData.stage_current) 
                ){
                return true
            }
            return false
        },
        nextStageButtons(){
            let buttons={};
            for(let i in this.orderData.stage_next){
                if(this.orderData.stage_next[i][0]){
                    buttons[i]=this.orderData.stage_next[i];
                    buttons[i].icon=checkmarkOutline
                    if(i.includes('admin') || i.includes('system')){
                        buttons[i].icon=ribbonOutline
                    } else 
                    if(i.includes('delivery')){
                        buttons[i].icon=rocketOutline
                    } else 
                    if(i.includes('supplier')){
                        buttons[i].icon=storefrontOutline
                    }
                }
            } 
            return buttons;
        },
        arrivalTimeStatusCorrect(){
            let arrival_time=this.orderData?.time_plan?.start_plan + this.orderData?.time_plan?.finish_arrival_time;
            if( this.orderData.stage_current!=='delivery_start' ){
                const now = Math.floor(Date.now() / 1000);
                const delivery_offset=20*60//if delivery not started show delivery_finish as 20 min away
                arrival_time=Math.max(arrival_time,now+delivery_offset)
            }
            return arrival_time
        },
        arrivalTime(){
            return Utils.date.humanize(this.arrivalTimeStatusCorrect, "future")
        },
        arrivalTimeColor(){
            const now = Math.floor(Date.now() / 1000);
            if( this.arrivalTimeStatusCorrect > (now+120*60) ){
                return 'danger'
            }
            if( this.arrivalTimeStatusCorrect > (now+90*60) ){
                return 'warning'
            }
            if( this.arrivalTimeStatusCorrect < (now+30*60) ){
                return 'success'
            }
            return 'medium'
        }
    },
    methods:{
        storeOpen(){
            this.$go(`/catalog/store-${this.orderData.order_store_id}`);
            this.parentClose();
        },
        productOpen(product_id){
            this.$go(`/catalog/product-${product_id}`);
            this.parentClose();
        },
        parentClose(){
            this.$topic.publish('dismissModal')
        },
        stageCreate(order_id, order_stage_code, severity){
            if( severity=='danger' ){
                if(!confirm("Вы уверены?")){
                    return
                }
            }
            this.$emit('stageCreate',order_id, order_stage_code);
        },
        async itemCommentEdit(entry, mode="edit"){
            let new_comment=''
            if(mode=="edit"){
                new_comment=prompt("Комментарий к товару",entry.entry_comment??'')
                if(new_comment===null){
                    return
                }
            }
            if(this.orderData.order_id>0){
                const request={
                    order_id:entry.order_id,
                    entry_id:entry.entry_id,
                    entry_comment:new_comment
                }
                try{
                    const result=await jQuery.post( `${this.$heap.state.hostname}Entry/itemUpdate`, JSON.stringify(request) );
                    this.$emit('orderRefresh');
                }catch{/** */}
            } else {
                entry.entry_comment=new_comment
                Order.cart.entryUpdate(entry)
            }
        },
        async itemDiscountEdit(entry, mode="edit"){
            let new_discount=0
            if(mode=="edit"){
                new_discount=prompt(`Скидка на товар в ${this.$heap.state.currencySign}`,entry.entry_discount??'')??0
            }
            if(new_discount){
                new_discount=new_discount.replace(',','.').replace(/[^\d.]/img,'')
            }
            const request={
                order_id:entry.order_id,
                entry_id:entry.entry_id,
                entry_discount:new_discount
            }
            try{
                await jQuery.post( `${this.$heap.state.hostname}Entry/itemUpdate`, JSON.stringify(request) );
                this.$emit('orderRefresh');
            }catch{
                this.$flash("Не удалось изменить скидку")
            }
        },
        async orderDescriptionChanged( val ){
            if( this.atCart ){
                Order.cart.itemUpdate(this.orderData.order_store_id,null,{order_description:val})
            }
            if( !this.orderData?.order_id ){
                return
            }
            const request={
                order_id:this.orderData.order_id,
                order_description:val
            };
            Order.api.itemUpdate(request);
        },
        async timePlanInfo(){
            const alert = await alertController.create({
                header: 'Время доставки',
                message:'Указано приблизительное время. На него влияют длительность приготовления заказа, пробки и другие факторы.',
                buttons: [
                  {
                    text: 'Ок',
                    role: 'confirm',
                  },
                ],
            });
            await alert.present();
            const { role } = await alert.onDidDismiss();
            if( role=='confirm' ){
                return true
            }
            return false
        },
    }
})
</script>
