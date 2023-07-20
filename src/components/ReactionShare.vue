<template>
    <ion-chip @click="itemShare()" color="medium"><ion-icon :src="arrowRedoOutline"/><ion-label>Поделиться</ion-label></ion-chip>
</template>
<script>
import {
  arrowRedoOutline,
}                           from 'ionicons/icons'
import {
  IonIcon,
  IonChip,
  IonLabel,
}                           from '@ionic/vue'
import { Share }            from '@capacitor/share';



export default {
    components:{
        IonChip,
        IonIcon,
        IonLabel,
    },
    props:['targetUrl','targetTitle','targetText'],
    setup(){
        return {
          arrowRedoOutline,
        }
    },
    methods:{
      async itemShare(){
        try{
            const canshare=await Share.canShare()
            const fullUrl=this.$heap.getters.settings.app.frontendUrl+this.targetUrl
            if(canshare){
              await Share.share({
                title: this.targetTitle,
                text: this.targetText,
                url: fullUrl,
                dialogTitle: this.targetTitle,
              });
            } else if(navigator.clipboard){
                await navigator.clipboard.writeText(this.targetUrl);
                this.$alert("Теперь вы можете поделиться ей с друзьями в социальных сетях или мессенджерах.","Ссылка на страницу скопирована");
            } else {
              this.$alert("Устройство не поддерживает функцию поделиться",""); 
            }
        }catch(err){
            //console.log(err)
        }
      },
    }
}
</script>