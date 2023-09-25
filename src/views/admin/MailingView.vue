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
            <ion-content class="ion-padding" @change="itemSave($event)">
                <ion-accordion-group v-model="openedAccordion" style="overflow: hidden;border-radius:10px">
                    <ion-accordion value="message">
                        <ion-item slot="header" color="light">
                            <ion-label>Сообщение</ion-label>
                        </ion-item>
                        <ion-list slot="content">
                            <ion-item>
                                <ion-input v-model="currentMailing.subject_template" label="Тема" label-placement="stacked"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-textarea v-model="currentMailing.text_template" label="Сообщение" label-placement="stacked"></ion-textarea>
                            </ion-item>
                            <ion-item>
                                <ion-input v-model="currentMailing.start_at" type="datetime-local" label="Начало запуска" label-placement="stacked"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-select label="Транспорт" label-placement="stacked" v-model="currentMailing.transport">
                                    <ion-select-option value="-">-</ion-select-option>
                                    <ion-select-option value="push">Push</ion-select-option>
                                </ion-select>
                            </ion-item>
                        </ion-list>
                    </ion-accordion>
                    <ion-accordion value="recievers">
                        <ion-item slot="header" color="light">
                            <ion-label>Получатели ({{currentMailing.recieverCount.sent}}/{{currentMailing.recieverCount.all}})</ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <ion-list>
                                <ion-item>
                                    <ion-input v-model="currentMailing.user_filter.phones" name="user_filter.phones" label="Телефоны получателей" label-placement="stacked"></ion-input>
                                </ion-item>

                                <ion-item lines="none">
                                    <ion-label>Локация клиентов</ion-label>
                                </ion-item>
                                <ion-item lines="none" v-if="currentMailing.user_filter.location">
                                    <ion-icon slot="start" :src="locationOutline"/>
                                    <ion-label style="white-space:normal;cursor:pointer;">{{ currentMailing.user_filter.location.location_address }}</ion-label>
                                    <ion-icon slot="end" :icon="trash" @click="locationDelete(`${currentMailing.user_filter.location.location_id}`)"></ion-icon>
                                </ion-item>
                                <ion-button v-else @click="modalLocationCreate()" color="light" expand="block">
                                    <ion-icon :src="locationOutline"/> Добавить адрес
                                </ion-button>
                                <ion-item v-if="currentMailing.user_filter.location">
                                    <ion-input v-model="currentMailing.user_filter.radius" name="user_filter.radius" label="Радиус вокруг локации км" label-placement="stacked"></ion-input>
                                </ion-item>

                                <ion-item lines="none">
                                    <ion-chip v-if="currentMailing.recieverCount.all>0">Всего {{currentMailing.recieverCount.all}}</ion-chip>
                                    <ion-chip v-if="currentMailing.recieverCount.sent>0" color="success">Послано {{currentMailing.recieverCount.sent}}</ion-chip>
                                    <ion-chip v-if="currentMailing.recieverCount.failed>0" color="danger">Ошибка {{currentMailing.recieverCount.failed}}</ion-chip>
                                </ion-item>
                            </ion-list>
                        </div>
                    </ion-accordion>
                    <ion-accordion value="push_options" v-if="currentMailing.transport=='push'">
                        <ion-item slot="header" color="light">
                            <ion-label>Настройки пуш</ion-label>
                        </ion-item>
                        <ion-list slot="content">
                            <image-tile-comp :images="currentMailing?.images" image_holder="mailing" :image_holder_id="currentMailing?.mailing_id" hide_if_empty="true" controller="Admin/Mailing" ref="mailingImgs"/>
                            <ion-item lines="none" @click="this.$refs.mailingImgs.take_photo()">
                                <ion-icon :src="addOutline" slot="start"/>
                                Добавить фото
                            </ion-item>
                            <ion-item>
                                <ion-input v-model="currentMailing.link" label="Link" label-placement="stacked"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-select @ionChange="itemSave()" label="Рингтон" label-placement="stacked" v-model="currentMailing.sound" value="default">
                                    <ion-select-option value="">-</ion-select-option>
                                    <ion-select-option value="default">стандарт</ion-select-option>
                                    <ion-select-option value="short.wav">Короткий</ion-select-option>
                                    <ion-select-option value="medium.wav">Средний</ion-select-option>
                                    <ion-select-option value="long.wav">Длинный</ion-select-option>
                                </ion-select>
                            </ion-item>
                        </ion-list>
                    </ion-accordion>
                </ion-accordion-group>
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-button @click="itemDelete()" color="danger" fill="clear" expand="block">Удалить</ion-button>
                        </ion-col>
                        <ion-col>
                            <ion-button @click="itemStart()" expand="block" color="light">
                                <ion-icon slot="start" :src="playOutline"></ion-icon>
                                Запустить
                            </ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-content>
        </ion-modal>

    </base-layout>
</template>
<script>
import {
  modalController,
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
  IonAccordionGroup,
  IonAccordion,
  IonChip,
 }                          from '@ionic/vue';
 import {
    addOutline,
    refreshOutline,
    imageOutline,
    closeOutline,
    playOutline,
    locationOutline,
    trash,
 }                          from "ionicons/icons";
import Utils                from '@/scripts/Utils'
import jQuery               from 'jquery'
import ImageTileComp        from '@/components/ImageTileComp.vue'
import UserAddressPicker    from '@/components/UserAddressPicker.vue'


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
        IonAccordionGroup,
        IonAccordion,
        IonChip,
    },
    setup(){
        return {
            addOutline,
            refreshOutline,
            imageOutline,
            closeOutline,
            playOutline,
            locationOutline,
            trash,
        }
    },
    data(){
        return{
            openedAccordion:'message',
            currentMailing:{},
            mailingList:null,
            isMailingOpen:false,
            saveClock:null
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
        async itemSave(e){
            clearTimeout(this.saveClock)
            this.saveClock=setTimeout(async ()=>{
                await this.itemUpdate()
                if( e && e.target?.name?.indexOf('user_filter')>-1 ){
                    this.recieverListCreate()
                }
            },500)
        },
        async itemUpdate(){
            const request=this.currentMailing
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemUpdate`,JSON.stringify(request))
                this.$flash("💾 сохранено")
                //this.listGet()
            }catch{
                this.$flash("Ошибка сохранения")
            }
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
            //await this.$alert(this.currentMailing.text_template,this.currentMailing.subject_template)
            if(!this.itemValidate() || !confirm(`Запустить рассылку в ${this.currentMailing.start_at}?`)){
                return
            }
            const request={
                mailing_id:this.currentMailing.mailing_id
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemStart`,request)
                //this.isMailingOpen=false
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
            
        },
        async modalLocationCreate() {
            if(!this.$heap.state.user.user_id){
                this.$flash('Чтобы добавленные адреса сохранились, пожалуйста войдите в систему');
                this.$go({name: 'UserSignIn'});
                return;
            }
            var location_group_name_low="рабочий";
            const modal = await modalController.create({
                component: UserAddressPicker,
                showBackdrop:true,
                backdropDismiss:true,
                componentProps:{
                location_group_name_low
                },
            });
            await modal.present()
            const location=await modal.onDidDismiss()
            if(location){
                this.currentMailing.user_filter.location=location.data
                this.recieverListCreate()
            }
        },
        async locationDelete( location_id ){
            try{
                this.currentMailing.user_filter.location=null
                this.recieverListCreate()
            }catch{
                this.$flash("Удалить адрес не удалось")
            }
        },
        async recieverListCreate(){
            try{
                const request={
                    mailing_id:this.currentMailing.mailing_id,
                }
                await this.itemUpdate()
                const recieverCount=await jQuery.post(this.$heap.state.hostname + "Admin/Mailing/recieverListCreate",request)
                this.$flash(`В список получателей добавлено ${recieverCount} запись`)
                this.itemGet(this.currentMailing.mailing_id)
            }catch{
                this.$flash("Создать список получателей не удалось")
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