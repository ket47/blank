<template>
      <base-layout page-title="Мои отзывы">
        <reaction-target-list/>
    </base-layout>
</template>

<script>
import ReactionTargetList from '@/components/ReactionTargetList.vue'



export default {
    components:{
        ReactionTargetList,
    },
    props:['reactionSummary','targetType','targetId'],
    setup(){
        return {
        }
    },
    methods:{
    }
}
</script>