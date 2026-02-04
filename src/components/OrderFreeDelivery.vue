<style scoped>

.free-delivery-block{
        padding: 8px 16px;
    }
.free-delivery-block ion-progress-bar{
    margin-top: 10px;
    height: 10px;
    border-radius: 20px;
}
</style>
<template>
    <div v-if="delivery_free" class="free-delivery-block">
        <ion-row>
            <ion-col>
                <h6 v-if="delivery_free.delivery_cost > 0" style="margin-bottom: 2px;">Стоимость доставки: <b>{{ delivery_free.delivery_cost }}{{$heap.state.currencySign}}</b></h6>
                <h6 v-else style="margin-bottom: 2px;"><ion-icon :icon="checkmark" color="success" style="font-size: 22px; vertical-align: text-bottom;"></ion-icon> Бесплатная доставка!</h6>
            
                <ion-label v-if="delivery_free.sum_left > 0" style="color: var(--ion-color-medium)">До бесплатной доставки осталось: <b>{{ delivery_free.sum_left }}{{$heap.state.currencySign}}</b></ion-label>
            </ion-col>
        </ion-row>
        <ion-progress-bar :value="delivery_free.progress" :color="delivery_free.color"></ion-progress-bar>
    </div>
</template>

<script>
import {
    IonIcon,
    IonLabel,
    IonRow,
    IonCol,
    IonProgressBar
}                       from '@ionic/vue';
import { 
    addCircle,
    checkmark
}                       from 'ionicons/icons';
import jQuery           from "jquery";
export default({
    props:['orderData', 'orderTotal'],
    components: {
        IonIcon,
        IonLabel,
        IonRow,
        IonCol,
        IonProgressBar
    },
    setup() {
        return { 
            checkmark,
            addCircle,
        };
    },
    data() {
        return {
            deliveryCost: null,
            deliveryFreeTreshold: null
        }
    },
    computed:{
        delivery_free(){
            if(!this.deliveryFreeTreshold) return null
            let sum_left = (this.deliveryFreeTreshold ?? 0) - this.orderTotal
            let progress =  1 - ((100 - Math.round(sum_left * 100 / this.deliveryFreeTreshold)) / 100)
            return {
                progress: progress,
                treshold: this.deliveryFreeTreshold,
                sum_left: sum_left,
                color: (progress > 0) ? ((progress >= 0.9) ? 'danger' : 'warning') : 'success',
                delivery_cost: this.deliveryCost
            }
        }
        
    },
    methods:{
        async load(){
            const request={
                store_id:this.orderData.order_store_id,
                order_sum_product:this.orderTotal
            }
            try{
                const result=await jQuery.post( `${this.$heap.state.hostname}Store/itemDeliveryCalculationGet`, request );
                this.deliveryFreeTreshold = result.delivery_free_treshold
                this.deliveryCost = result.customer_cost_total
            }catch{
                this.deliveryFreeTreshold = null
                this.deliveryCost = null
            }
        },
    },
    mounted(){
        this.load()
    },
    watch:{
        'orderTotal'(){
            this.load()
        }
    }
})
</script>
