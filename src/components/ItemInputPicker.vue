<style scoped>

</style>
<template>
<div class="ion-page">
  <ion-content>
    <ion-item lines="none">
        <ion-label>Введите {{ inputLabel }}</ion-label>
        <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
    </ion-item>
    <br>
    <div class="ion-padding">
        <ion-input :type="inputType" v-model="value" :label="inputLabel" label-placement="stacked" fill="outline" mode="md" ref="theinput" @keyup.enter="submitModal()"/>
    </div>
    <div class="ion-padding">
        <ion-button expand="block" @click="submitModal()">Ok</ion-button>
    </div>
  </ion-content>
</div>
</template>
<script>
import 
{
  closeOutline
}                         from 'ionicons/icons';
import {
    modalController,
    IonContent,
    IonHeader,
    IonLabel,
    IonIcon,
    IonItem,
    IonInput,
    IonButton,
}                         from "@ionic/vue";

export default {
    props:['inputType','inputValue','inputLabel'],
    components:{
    IonContent,
    IonHeader,
    IonLabel,
    IonIcon,
    IonItem,
    IonInput,
    IonButton,
    },
    setup(){
        return {closeOutline}
    },
    data(){
        return {
            value:null
        }
    },
    mounted(){
        this.value=this.inputValue
        setTimeout(()=>{
            this.$refs.theinput.$el.setFocus()
            this.$refs.theinput.$el.nativeInput.select()
        },50)
    },
    methods:{
        submitModal(){
            modalController.dismiss(this.value);
        },
        closeModal(){
            modalController.dismiss();
        }
    }
}
</script>