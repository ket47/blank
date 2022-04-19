<style scoped>
    .entry-deleted{
        color:var(--ion-color-danger);
    }
</style>
<template>
    <ion-item detail button @click="storeOpen()" lines="none">
        <ion-icon slot="start" :icon="storefrontOutline"></ion-icon>
        <ion-title v-if="orderData.store">{{orderData.store.store_name}}</ion-title>
    </ion-item>

    <ion-list>
      <div v-for="entry in orderEntries"  :key="entry.product_id" >
        <ion-item :class="entry.deleted_at?'entry-deleted':''">
            <ion-thumbnail v-if="entry.image_hash" @click="productOpen(entry.product_id)">
                <ion-img :src="`${$heap.state.hostname}image/get.php/${entry.image_hash}.150.150.webp`"/>
            </ion-thumbnail>
            <ion-grid>
                <ion-col>
                    <ion-row>{{ entry.entry_text }}</ion-row>
                    <ion-row><ion-label color="primary">{{ entry.entry_price }}{{$heap.state.currencySign}}</ion-label></ion-row>
                </ion-col>
            </ion-grid>
            <div slot="end" v-if="entry.product_id" style="position:relative;width:120px;min-height:48px">
            <cart-add-buttons buttonLayout="horizontal" :entry="entry" :orderData="orderData"></cart-add-buttons>
            </div>
        </ion-item>
      </div>

      <ion-item lines="none">
          <ion-col  v-for="(stage_title, order_stage_code) in orderData.stage_next" :key="order_stage_code" >
            <ion-button 
            v-if="stage_title[0]" 
            @click="stageCreate(orderData.order_id, order_stage_code)" 
            expand="block" 
            :color="(stage_title[1]=='negative') ? 'danger' : (stage_title[1]=='positive' ? 'success' : 'primary')"
            >
                {{ stage_title[0] }}
            </ion-button>
          </ion-col>
          <ion-col size="3">
            <h3>{{ orderTotal }}{{$heap.state.currencySign}}</h3>
          </ion-col>
      </ion-item>

    </ion-list>
</template>

<script>
import { add, remove, trash, storefrontOutline }   from 'ionicons/icons';
import router from '@/router';
import CartAddButtons from '@/components/CartAddButtons.vue';

export default({
    inject:['$Order'],
    props:['order'],
    components: {CartAddButtons},
    data(){
        return {
            orderData:this.order,
            orderEntries:this.order.entries
        };
    },
    computed:{
        orderTotal(){
            if( this.orderData.order_sum_total ){
                return this.orderData.order_sum_total;
            }
            let total=0;
            for(let k in this.orderEntries){
                let entry=this.orderEntries[k];
                if( !entry || !entry.entry_quantity || !entry.entry_price ){
                    continue;
                }
                total+= (entry.entry_quantity) * (entry.entry_price);
            }
            return total;
        },
    },
    setup() {
        return {add, remove, trash, storefrontOutline };
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
            const self=this;
            this.$Order.itemStageCreate(order_id, order_stage_code)
            /*.fail((xhr)=>{
                if(xhr.status==403){
                    //closing cart modal to show signin page 
                    self.parentClose();
                }
            });*/
        }
    }
})
</script>
