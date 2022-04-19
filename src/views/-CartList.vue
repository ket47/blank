<style scoped>
</style>
<template>
    <base-layout title="Корзина">
        <segment v-for="order in orderList" :key="order.order_id">
            <order-comp :order="order"></order-comp>
        </segment>
    </base-layout>
</template>
<script>
import BaseLayout           from '@/components/BaseLayout.vue';
import OrderComp            from '@/components/OrderComp.vue';
import heap                from '@/heap';

export default({
  components: { BaseLayout, OrderComp },
    inject:['$Order'],
    data(){
        return {
            orderList:heap.state.cartList
        };
    }
})
</script>
