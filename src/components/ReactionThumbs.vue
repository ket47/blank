<template>
    <ion-chip color="medium" @click="reactionTargetPick()">
        <ion-icon :src="thumbsUpSharp" :color="reactionSummary?.reaction_is_like==1?'dark':'medium'"/>
        <ion-label v-if="reactionSummary?.sum_is_like>0">{{reactionSummary?.sum_is_like??''}}</ion-label>
        <ion-label color="medium">&nbsp;|&nbsp;</ion-label> 
        <ion-icon :src="thumbsDownSharp" :color="reactionSummary?.reaction_is_dislike==1?'dark':'medium'"/>
    </ion-chip>
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
import ReactionTargetPicker from '@/components/ReactionTargetPicker.vue'



export default {
    components:{
        IonChip,
        IonIcon,
        IonLabel,
    },
    props:['reactionSummary','targetType','targetId'],
    setup(){
        return {
            thumbsUpSharp,
            thumbsDownSharp,
        }
    },
    methods:{
      async reactionTargetPick(){
        const modal = await modalController.create({
            component: ReactionTargetPicker,
            componentProps:{targetType:this.targetType,targetId:this.targetId},
            initialBreakpoint: 0.8,
            breakpoints: [0.8, 1],
            handleBehavior:"cycle",
            canDissmiss:true,
        });
        modal.present()
        this.$topic.on('dismissModal',()=>modal.dismiss())
        const target=await modal.onDidDismiss()
        this.$emit('react',target.data)
      },
    }
}
</script>