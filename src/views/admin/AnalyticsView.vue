<template>
    <base-layout pageTitle="Статистика продавца" pageDefaultBackLink="/user">
        
    </base-layout>
</template>

<script>
import StatisticsCard          from "@/components/StatisticsCard.vue";

import jQuery       from "jquery";

export default {
    components:{
        StatisticsCard
    },
    setup(){
        return {}
    },
    data(){
        return {
            analysis:null,
        }
    },
    mounted(){
        this.analysisGet()
    },
    methods:{
        async analysisGet(){
            this.analysis = await jQuery.post(`${this.$heap.state.hostname}Statistics/totalOrderAnalysisGet`, {point_span: 7, point_num: 10})
        },
    },
}
</script>