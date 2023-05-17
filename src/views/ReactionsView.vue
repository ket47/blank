<template>
      <base-layout page-title="Мои отзывы">
        <reaction-target-list/>
    </base-layout>
</template>

<script>
import {
  thumbsUpSharp,
  thumbsDownSharp,
}                       from 'ionicons/icons'
import {
  modalController,
  IonIcon,
  IonChip,
  IonLabel,
}                           from '@ionic/vue'
import ReactionTargetList from '@/components/ReactionTargetList.vue'



export default {
    components:{
        IonChip,
        IonIcon,
        IonLabel,
        ReactionTargetList,
    },
    props:['reactionSummary','targetType','targetId'],
    setup(){
        return {
            thumbsUpSharp,
            thumbsDownSharp,
        }
    },
    methods:{
    }
}
</script>