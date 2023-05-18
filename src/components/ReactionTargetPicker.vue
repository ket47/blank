<style>
  ion-backdrop {
    opacity: 0.3;
    background: #000;
  }

  .commentEdit {
    -position: absolute;
    -z-index: 100;
    background: var(--ion-background-color, #fff);
    width: 100%;
    padding-bottom: 5px;
  }
  @keyframes hideshow {
    0% { transform:scale(3);fill:var(--ion-color-primary);opacity:0.5; }
    50% { transform:scale(1);fill:red; }
    100% { transform:scale(3);fill:var(--ion-color-primary);opacity:0.5; }
  } 
  .like_animate:active{
    animation: hideshow 0.3s ease;
  }
</style>


<template>
<div class="ion-page">
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
            <ion-title>Ваши оценки на покупки</ion-title>
            <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <reaction-target-list :targetType="targetType" :targetId="targetId"/>
  </ion-content>
</div>
</template>
<script>
import 
{
  closeOutline,
  chatboxOutline,
  thumbsUpSharp,
  thumbsDownSharp,
  trashOutline,
  send,
  pencil,
}                         from 'ionicons/icons';
import {
    modalController,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonItem,

}                         from "@ionic/vue";
import jQuery             from 'jquery'
import ReactionTargetList from '@/components/ReactionTargetList.vue'

export default {
    props:['targetType','targetId'],
    components:{
      IonContent,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonIcon,
      IonItem,
      ReactionTargetList,
    },
    setup(){
        return {
            closeOutline,
        }
    },
    methods:{
        closeModal(){
            modalController.dismiss();
        }
    }
}
</script>