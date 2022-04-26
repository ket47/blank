<style scoped>
    .entry-deleted{
        color:var(--ion-color-danger);
    }
</style>
<template>
    <div v-if="orderData">
        <ion-item detail button @click="storeOpen()" lines="none">
            <ion-icon slot="start" :icon="storefrontOutline"></ion-icon>
            <ion-label>{{orderData?.store?.store_name}}</ion-label>
        </ion-item>


        <ion-list>
            <ion-item lines="full">
                <ion-label v-if="orderData.order_id>0" color="medium">
                Заказ #{{orderData.order_id}}
                </ion-label>
                <ion-label v-else color="medium">
                Корзина
                </ion-label>

                <ion-chip color="primary" slot="end" v-if="orderData.stage_current_name">
                    <ion-icon :icon="checkmarkOutline"></ion-icon>
                    <ion-label color="dark">{{orderData.stage_current_name}}</ion-label>
                </ion-chip>
            </ion-item>
            <ion-item v-for="entry in orderData?.entries"  :key="entry.product_id" :class="entry.deleted_at?'entry-deleted':''" lines="full">
                <ion-thumbnail slot="start" v-if="entry.image_hash" @click="productOpen(entry.product_id)">
                    <ion-img :src="`${$heap.state.hostname}image/get.php/${entry.image_hash}.150.150.webp`"/>
                </ion-thumbnail>
                <div style="display:grid;grid-template-columns:auto 113px;width:100%;gap:5px;">
                    <div style="grid-column: 1 / span 2">
                        {{ entry.entry_text }}
                    </div>
                    <div>
                        <ion-label color="primary">{{ entry.entry_price }}{{$heap.state.currencySign}}</ion-label>
                    </div>
                    <div v-if="entry.product_id"  style="position:relative;min-height:38px;">
                        <cart-add-buttons v-if="isEditable" buttonLayout="horizontal" :entry="entry" :orderData="orderData"></cart-add-buttons>
                        <ion-text v-else color="primary">x {{entry.entry_quantity}}{{entry.product_unit}}</ion-text>
                    </div>
                    <div v-if="entry.entry_comment" style="grid-column: 1 / span 2">
                        <ion-note>{{ entry.entry_comment }}</ion-note>
                    </div>
                </div>
            </ion-item>
            <ion-item lines="none">
                <ion-text color="medium">Сумма заказа: </ion-text>
                <ion-label slot="end" color="primary"><b>{{ orderTotal }}{{$heap.state.currencySign}}</b></ion-label>
            </ion-item>
        </ion-list>


        <ion-grid>
            <ion-row>
                <ion-col  v-for="(stage_title, order_stage_code) in nextStageButtons" :key="order_stage_code" >
                    <ion-button 
                    v-if="stage_title[0]" 
                    @click="stageCreate(orderData.order_id, order_stage_code)" 
                    expand="block" 
                    :color="(stage_title[1]=='negative') ? 'danger' : (stage_title[1]=='positive' ? 'success' : 'primary')"
                    >
                        {{ stage_title[0] }}
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-grid>


        <ion-accordion-group v-if="orderData.stages">
            <ion-accordion>
                <ion-item slot="header">
                    <ion-label>История заказа</ion-label>
                </ion-item>
                <ion-list slot="content">
                    <ion-item v-for="stage in orderData.stages" :key="stage.group_id">
                        <ion-icon slot="start" :icon="checkmarkOutline" size="small" color="success"></ion-icon>
                        <ion-text>{{stage.group_name}}</ion-text>
                        <ion-note slot="end" style="width:80px">{{stage.created_at}}</ion-note>
                    </ion-item>
                </ion-list>
            </ion-accordion>
        </ion-accordion-group>
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
import { add, remove, trash, storefrontOutline,checkmarkOutline }   from 'ionicons/icons';
import router from '@/router';
import CartAddButtons from '@/components/CartAddButtons.vue';


export default({
    inject:['$Order'],
    props:['orderData'],
    components: {CartAddButtons},
    setup() {
        return { add, remove, trash, storefrontOutline, checkmarkOutline };
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
                total+= (entry.entry_quantity) * (entry.entry_price);
            }
            return total;
        },
        isEditable(){
            if(this.orderData.user_role=='customer'){
                return ['customer_cart'].includes(this.orderData.stage_current);
            }
            if(this.orderData.user_role=='supplier'){
                return ['supplier_corrected'].includes(this.orderData.stage_current);
            }
            return false;
        },
        nextStageButtons(){
            let buttons={};
            for(let i in this.orderData.stage_next){
                if(this.orderData.stage_next[i][0]){
                    buttons[i]=this.orderData.stage_next[i];
                }
            } 
            return buttons;
        }
    },
    methods:{
        storeOpen(){
            router.push({path: `/store-${this.orderData.order_store_id}`});
            this.parentClose();
        },
        productOpen(product_id){
            router.push({path: `/product-${product_id}`});
            this.parentClose();
        },
        parentClose(){
            if(this.$parent.closeModal){
                this.$parent.closeModal();
            }
        },
        stageCreate(order_id, order_stage_code){
            this.$emit('stageCreate',order_id, order_stage_code);
        },
    }
})
</script>
