<style scoped>
.deleted{
    border: 3px red solid;
}
</style>
<template>
    <base-layout pageDefaultBackLink="/user" page-title="Рассылка">

        <ion-list>
            <ion-item button @click="itemCreate()">
                <ion-icon slot="start" :src="addOutline"/>
                <ion-label>Добавить Рассылку</ion-label>
            </ion-item>
        </ion-list>
        <ion-list v-if="mailingList?.length>0">
            <ion-item v-for="mail in mailingList" :key="mail.mailing_id" @click="itemGet(mail.mailing_id)">
                <ion-label>#{{mail.mailing_id}} {{mail.subject_template}}</ion-label>
            </ion-item>
        </ion-list>








        <ion-modal ref="modal" @willDismiss="isMailingOpen=false" :is-open="isMailingOpen" :initial-breakpoint="0.75" :breakpoints="[0.75, 1]">
            <ion-header>
                <ion-toolbar>
                    <ion-title>Рассылка #{{currentMailing.mailing_id}}</ion-title>
                    <ion-buttons slot="end">
                        <ion-button @click="isMailingOpen=false">
                            <ion-icon :src="closeOutline"/>
                        </ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <ion-list>
                    <ion-item>
                        <ion-input v-model="currentMailing.user_filter.phones" label="Телефоны получателей" label-placement="stacked"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input v-model="currentMailing.subject_template" label="Тема" label-placement="stacked"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-textarea v-model="currentMailing.text_template" label="Сообщение" label-placement="stacked"></ion-textarea>
                    </ion-item>
                    <image-tile-comp :images="currentMailing?.images" image_holder="mailing" :image_holder_id="currentMailing?.mailing_id" hide_if_empty="true" controller="Admin/Mailing" ref="mailingImgs"/>
                    <ion-item lines="none" @click="this.$refs.mailingImgs.take_photo()">
                        <ion-icon :src="addOutline" slot="start"/>
                        Добавить фото
                    </ion-item>

                    <ion-item>
                        <ion-input v-model="currentMailing.link" label="Link" label-placement="stacked"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-select label="Транспорт" label-placement="stacked" v-model="currentMailing.transport">
                            <ion-select-option value="push">Push</ion-select-option>
                        </ion-select>
                    </ion-item>
                    <ion-item>
                        <ion-select label="Рингтон" label-placement="stacked" v-model="currentMailing.sound" value="default">
                            <ion-select-option value="">-</ion-select-option>
                            <ion-select-option value="default">стандарт</ion-select-option>
                            <ion-select-option value="short.wav">Короткий</ion-select-option>
                            <ion-select-option value="medium.wav">Средний</ion-select-option>
                            <ion-select-option value="long.wav">Длинный</ion-select-option>
                        </ion-select>
                    </ion-item>
                    <ion-item>
                        <ion-input v-model="currentMailing.start_at" type="datetime-local" label="Начало запуска" label-placement="stacked"></ion-input>
                    </ion-item>
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-button @click="itemDelete()" color="danger" fill="clear" expand="block">Удалить</ion-button>
                            </ion-col>
                            <ion-col>
                                <ion-button @click="itemUpdate()" expand="block">Сохранить</ion-button>
                            </ion-col>
                            <ion-col>
                                <ion-button @click="itemStart()" expand="block" color="light">
                                    <ion-icon slot="start" :src="playOutline"></ion-icon>
                                    Запустить
                                </ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-list>


            </ion-content>
        </ion-modal>

    </base-layout>
</template>
<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
 }                          from '@ionic/vue';
 import {
    addOutline,
    refreshOutline,
    imageOutline,
    closeOutline,
    playOutline,
 }                          from "ionicons/icons";
import Utils                from '@/scripts/Utils'
import jQuery               from 'jquery'
import ImageTileComp        from '@/components/ImageTileComp.vue'


export default {
    components: {
        ImageTileComp,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
    },
    setup(){
        return {
            addOutline,
            refreshOutline,
            imageOutline,
            closeOutline,
            playOutline,
        }
    },
    data(){
        return{
            currentMailing:{},
            mailingList:null,
            isMailingOpen:false,
        }
    },
    computed:{
    },
    methods:{
        async itemCreate(){
            const request={
                subject_template:'new mailing'
            }
            try{
                const mailing_id=await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemCreate`,request)
                this.itemGet(mailing_id)
            }catch{/** */}
        },
        async itemGet(mailing_id){
            const request={
                mailing_id
            }
            try{
                const result=await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemGet`,request)
                result.user_filter??={}
                this.currentMailing=result
                this.isMailingOpen=true
            }catch{/** */}
        },
        async itemUpdate(){
            const request=this.currentMailing
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemUpdate`,JSON.stringify(request))
                this.isMailingOpen=false
                this.listGet()
            }catch{/** */}
        },
        async itemDelete(){
            if(!confirm('Вы уверенны?')){
                return
            }
            const request={
                mailing_id:this.currentMailing.mailing_id
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemDelete`,request)
                this.isMailingOpen=false
                this.listGet()
            }catch{/** */}
        },
        itemValidate(){
            if(!this.currentMailing.start_at){
                alert(`Начало рассылки не заполнено`)
                return
            }
            if(!this.currentMailing.user_filter.phones){
                alert(`Получатели не заполнены`)
                return
            }
            if(!this.currentMailing.subject_template){
                alert(`Заголовок не заполнен`)
                return
            }
            if(!this.currentMailing.text_template){
                alert(`Содержание не заполнено`)
                return
            }
            if(!this.currentMailing.transport){
                alert(`Транспорт не заполнен`)
                return
            }
            return true
        },
        async itemStart(){
            if(!this.itemValidate() || !confirm(`Запустить рассылку в ${this.currentMailing.start_at}?`)){
                return
            }
            const request={
                mailing_id:this.currentMailing.mailing_id
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemStart`,request)
                this.isMailingOpen=false
                this.listGet()
            }catch{/** */}
        },
        async listGet(){
            this.mailingList=await Utils.prePost(`${this.$heap.state.hostname}Admin/Mailing/listGet`,{})
            try{
                this.mailingList=await Utils.post(`${this.$heap.state.hostname}Admin/Mailing/listGet`,{})
            }catch(err){
                console.log(err)
            }
            
        }
    },
    ionViewDidEnter(){
        this.listGet()
    },
    mounted(){
        this.listGet()
    }
}
</script>