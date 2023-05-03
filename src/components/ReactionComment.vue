<template>
<div style="--ion-color-light:rgba(222, 222, 222,0.2);">
    <ion-item v-if="itemCommentCount>0" color="light" lines="none" style="border-radius:10px;margin:10px" @click="reactionCommentView()">
      <ion-label position="stacked" color="medium">
        <b>Отзывы {{itemCommentCount}}</b>
      </ion-label>
      <ion-text style="margin-top:15px;margin-bottom:10px;" color="dark">
        {{reactionSummary?.last_comment}}
      </ion-text>
      <ion-icon :src="chevronDownOutline" slot="end" size="small"/>
    </ion-item>
    <ion-item v-else color="light" lines="none" @click="reactionTargetPick()" style="border-radius:10px;margin:10px">
      <ion-label position="stacked" color="medium">
        <b>Отзывы</b>
      </ion-label>
      <ion-chip color="medium" style="border-radius:10px;width:99%">
          <ion-icon :src="addOutline" color="medium" size="small"/><ion-text>добавить отзыв</ion-text>
      </ion-chip>
    </ion-item>
</div>
</template>
<script>
import {
  addOutline,
  chevronDownOutline,
}                             from 'ionicons/icons'
import {
  modalController,
  IonIcon,
  IonItem,
  IonChip,
  IonLabel,
  IonText,
}                             from '@ionic/vue'
import ReactionTargetPicker   from '@/components/ReactionTargetPicker.vue'
import ReactionCommentViewer  from '@/components/ReactionCommentViewer.vue'



export default {
    components:{
        IonChip,
        IonIcon,
        IonLabel,
        IonItem,
        IonText,
    },
    props:['reactionSummary','targetType','targetId'],
    setup(){
        return {
        addOutline,
        chevronDownOutline,
        }
    },
    computed:{
      
      itemCommentCount(){
        if(! this.reactionSummary?.sum_comment??0 ){
          return ''
        }
        if(this.reactionSummary?.sum_comment>1000){
          return Math.round(this.reactionSummary?.sum_comment/100)/10+'k'
        }
        return this.reactionSummary?.sum_comment
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
      async reactionCommentView(){
        const targetId=this.targetId
        const targetType=this.targetType
        const targetTitle='-'
        const modal = await modalController.create({
            component: ReactionCommentViewer,
            componentProps:{targetType,targetId,targetTitle},
            initialBreakpoint: 0.8,
            breakpoints: [0.8, 1],
            handleBehavior:"cycle",
            canDissmiss:true,
        });
        modal.present()
        this.$topic.on('dismissModal',()=>modal.dismiss())
        const target=await modal.onDidDismiss();
        if(target?.data=='commentAdd'){
          this.reactionTargetPick()
        }
      },
    }
}
</script>