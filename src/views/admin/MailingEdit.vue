<style scoped>
.deleted{
    border: 3px red solid;
}

.preview-card ion-card-header{
    padding-bottom: 5px;
}
.preview-card ion-card-title{
    color: black;
}
ion-input.ion-invalid,
ion-textarea.ion-invalid{
    --highlight-color-invalid: var(--ion-color-danger);
    --color: red;
}
</style>
<template>
    <base-layout pageDefaultBackLink="/admin/mailing-list" page-title="Рассылка">
        <ion-loading message="Dismissing after 3 seconds..."> </ion-loading>
        <ion-item>
            <ion-select label="Транспорт" label-placement="stacked" v-model="mailing.transport" @ionChange="itemSave()">
                <ion-select-option value="push">Push</ion-select-option>
                <ion-select-option value="email">Email</ion-select-option>
                <ion-select-option value="sms">Sms</ion-select-option>
                <ion-select-option value="telegram">Telegram</ion-select-option>
            </ion-select>
        </ion-item>
        <ion-item>
            <ion-toggle @ionChange="(!$event.target.checked) ? mailing.regular_group = '0' : mailing.regular_group = 'signin'; mailing.is_delayed = false; itemSave()" 
                :checked="mailing.regular_group != '0'">
                Регулярная рассылка
            </ion-toggle>
        </ion-item>
        <div v-if="mailing.regular_group == '0'">
            <ion-item>
                <ion-toggle @ionChange="mailing.is_delayed = $event.target.checked" :checked="mailing.is_delayed">Отправить потом</ion-toggle>
            </ion-item>
            <ion-item v-if="mailing.is_delayed">
                <ion-input v-model="mailing.start_at" type="datetime-local" :min="new Date().toISOString().slice(0, -8)" label="Когда отправить?" label-placement="stacked" @ionChange="itemSave()"></ion-input>
            </ion-item>
        </div>
        <div v-else>
            <ion-item>
                <ion-select placeholder="Группа рассылок" label="Группа рассылок"  v-model="mailing.regular_group" @ionChange="itemSave()">
                    <ion-select-option v-for="(translation, code) in regularGroupTranslation" :value="code" :key="translation">{{ translation }}</ion-select-option>
                </ion-select>
            </ion-item>
            <ion-item>
                <ion-input v-model="mailing.start_at" type="time" label="Во сколько отправлять?" label-placement="stacked" @ionChange="itemSave()"></ion-input>
            </ion-item>
        </div>
        <div v-if="mailing.transport">
            <div v-if="mailing.regular_group == '0'" class="ion-text-center ion-margin-vertical">
                <ion-button v-if="mailing.is_started == '0'" @click="itemStart()">
                    <ion-icon slot="start" :src="playOutline"></ion-icon>
                    <span v-if="mailing.is_delayed">Запланировать</span>
                    <span v-else>Отправить</span>
                </ion-button>
                <ion-button v-else @click="itemStart()" color="warning">
                    <ion-icon slot="start" :src="refreshOutline"></ion-icon>
                    Перезапустить
                </ion-button>
            </div>
            <div v-else  class="ion-text-center ion-margin-vertical">
                <ion-button @click="itemStart()">
                    <ion-icon slot="start" :src="playOutline"></ion-icon>
                    Сохранить
                </ion-button>
            </div>
        </div>
        <ion-grid >
            <ion-row>
                <ion-col col="3" >
                    <ion-item lines="none">
                        <ion-label>Предварительный показ:</ion-label>
                    </ion-item>
                    <ion-card class="preview-card" v-if="mailing.transport == 'push' || mailing.transport == 'telegram'">
                        <ion-card-header>
                            <ion-item class="ion-no-padding" lines="none">
                                <ion-avatar slot="start" style="--border-radius: 5px; width: 25px; height: 25px">
                                    <img src="/img/logo-full.png" />
                                </ion-avatar>
                                <ion-label>
                                    <ion-note  style="font-size: 12px;">Tezkel</ion-note>
                                </ion-label>
                            </ion-item>
                        </ion-card-header>
                        <ion-card-content style="padding-left: 55px;">
                            <div>
                                <ion-card-title style="font-size: 14px;"><b>{{ mailing.subject_template }}</b></ion-card-title>
                                <span class="max-two-lines">{{ mailing.text_template }}</span>
                            </div>
                            <div style="max-height: 200px; overflow: hidden; border-radius: 5px; margin-top: 5px;">
                                <img v-if="mailing.image" :src="mailing.image"/>
                            </div>
                        </ion-card-content>
                    </ion-card>
                    <ion-card class="preview-card"  v-if="mailing.transport == 'email'">
                        <ion-card-header>
                            <ion-item class="ion-no-padding" lines="none">
                                <ion-avatar slot="start" style="--border-radius: 5px; width: 25px; height: 25px">
                                    <img src="/img/logo-full.png" />
                                </ion-avatar>
                                <ion-label>
                                    <ion-note  style="font-size: 12px;">Tezkel ○ {{ mailing.start_at }}</ion-note>
                                </ion-label>
                            </ion-item>
                        </ion-card-header>
                        <ion-card-content style="padding-left: 55px;">
                            <ion-row class="ion-justify-content-center">
                                <img :src="`${$heap.state.hostname}img/tezbanner.jpg`" width="450px"/>
                            </ion-row>
                            <ion-row class="ion-justify-content-center ion-margin-vertical">
                                <ion-card-title style="font-size: 14px;"><b>{{ mailing.subject_template }}</b></ion-card-title>
                            </ion-row>
                            <div class="ion-margin-vertical ion-text-center">
                                <div style="max-height: 200px; overflow: hidden; margin-bottom: 10px;">
                                    <img v-if="mailing.image" style="height: 200px; border-radius: 5px;" :src="mailing.image"/>
                                </div>
                                <span style=" margin-top: 10px;" class="max-two-lines">{{ mailing.text_template }}</span>
                            </div>
                            <ion-row class="ion-justify-content-center">
                                <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                            </ion-row>
                            <ion-row class="ion-justify-content-center">
                                <ion-skeleton-text :animated="true" style="width: 50%;"></ion-skeleton-text>
                            </ion-row>
                        </ion-card-content>
                    </ion-card>
                    <ion-card class="preview-card" v-if="mailing.transport == 'sms'">
                        <ion-card-header>
                            <ion-item class="ion-no-padding" lines="none">
                                <ion-label slot="start">
                                    <b>Tezkel</b>
                                </ion-label>
                                <ion-label slot="end">
                                    <ion-note  style="font-size: 12px;">{{ mailing.start_at }}</ion-note>
                                </ion-label>
                            </ion-item>
                        </ion-card-header>
                        <ion-card-content style="padding-top: 0;">
                            <ion-card-title style="font-size: 14px;">{{ mailing.text_template }}</ion-card-title>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
                <ion-col col="9">
                    <ion-item lines="none">
                        <ion-label>Содержимое:</ion-label>
                    </ion-item>
                    <ion-card>
                        <form @change="itemSave">
                            <ion-list lines="full">
                                <div >
                                <image-tile-comp :images="mailing?.images" image_holder="mailing" :image_holder_id="mailing?.mailing_id" hide_if_empty="true" controller="Admin/Mailing" ref="mailingImgs" @onChange="imageChange"/>
                                <ion-item lines="none" @click="this.$refs.mailingImgs.take_photo()">
                                    <ion-icon :src="addOutline" slot="start"/>
                                    Изменить фото
                                </ion-item>
                                </div>
                                <ion-item>
                                    <ion-input v-model="mailing.subject_template" ref="subject_template" 
                                        label="Заголовок" 
                                        label-placement="stacked" 
                                        :disabled="isSubjectDisabled" 
                                        ></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-textarea v-model="mailing.text_template" ref="text_template" label="Описание" 
                                        label-placement="stacked"
                                    ></ion-textarea>
                                </ion-item>
                                <ion-item>
                                    <ion-input v-model="mailing.link" label="Ссылка" ref="link" 
                                        label-placement="stacked" 
                                        :disabled="isLinkDisabled"
                                    ></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-select @ionChange="itemSave()" label="Рингтон" label-placement="stacked" v-model="mailing.sound" value="default"  :disabled="isRingtoneDisabled">
                                        <ion-select-option value="">-</ion-select-option>
                                        <ion-select-option value="default">стандарт</ion-select-option>
                                        <ion-select-option value="short.wav">Короткий</ion-select-option>
                                        <ion-select-option value="medium.wav">Средний</ion-select-option>
                                        <ion-select-option value="long.wav">Длинный</ion-select-option>
                                    </ion-select>
                                </ion-item>
                        </ion-list>
                        </form>  
                    </ion-card>  
                </ion-col>
            </ion-row>
        </ion-grid>
        <ion-grid  v-if="mailing.regular_group == 0">
            <ion-row>
                <ion-col>
                    <ion-card>
                        <form @change="itemSave">
                            <ion-list lines="full" v-if="mailing.user_filter">
                                <ion-list>
                                    <ion-item>
                                        <ion-input v-model="mailing.user_filter.phones" name="user_filter.phones" label="Телефоны получателей" label-placement="stacked"></ion-input>
                                    </ion-item>

                                    <ion-item>
                                        <ion-label>Локация клиентов</ion-label>
                                    </ion-item>
                                    <ion-item v-if="mailing.user_filter.location">
                                        <ion-icon slot="start" :src="locationOutline"/>
                                        <ion-label style="white-space:normal;cursor:pointer;">{{ mailing.user_filter.location.location_address }}</ion-label>
                                        <ion-icon slot="end" :icon="trash" @click="locationDelete(`${mailing.user_filter.location.location_id}`)"></ion-icon>
                                    </ion-item>
                                    <ion-button v-else @click="modalLocationCreate()" color="light" expand="block">
                                        <ion-icon :src="locationOutline"/> Добавить адрес
                                    </ion-button>
                                    <ion-item v-if="mailing.user_filter.location">
                                        <ion-input v-model="mailing.user_filter.radius" name="user_filter.radius" label="Радиус вокруг локации км" label-placement="stacked"></ion-input>
                                    </ion-item>
                                    <ion-item>
                                        <ion-chip v-if="mailing.recieverCount.all>0">Всего {{mailing.recieverCount.all}}</ion-chip>
                                        <ion-chip v-if="mailing.recieverCount.sent>0" color="success">Послано {{mailing.recieverCount.sent}}</ion-chip>
                                        <ion-chip v-if="mailing.recieverCount.failed>0" color="danger">Ошибка {{mailing.recieverCount.failed}}</ion-chip>
                                    </ion-item>
                                </ion-list>
                            </ion-list>
                        </form>
                    </ion-card>
                </ion-col>
            </ion-row>
        </ion-grid>
        <ion-card>
            <ion-button @click="itemDelete()" color="danger" fill="clear" expand="block">Удалить</ion-button>
        </ion-card>
    </base-layout>
</template>
<script>
import {
    modalController,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonGrid,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonRow,
    IonCol,
    IonChip,
    IonToggle,
    IonAvatar,
    IonNote,
    IonSkeletonText,
    IonLoading  
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
        IonButton,
        IonInput,
        IonTextarea,
        IonCard,
        IonCardTitle,
        IonCardHeader,
        IonCardContent,
        IonSelect,
        IonSelectOption,
        IonGrid,
        IonRow,
        IonCol,
        IonChip,
        IonToggle,
        IonAvatar,
        IonNote,
        IonSkeletonText,
        IonLoading 
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
            mailingId: this.$route.params.id,
            mailing:{},
            saveClock:null,
            regularGroupTranslation: {
                cart23: 'Корзина брошена сутки',
                'promo-10': 'До конца скидки 10 дней',
                'promo-3': 'До конца скидки 3 дня',
                'promo-1': 'До конца скидки 1 день',
                forgot14: 'Последний вход 2 недели назад',
                forgot30: 'Последний вход месяц назад',
                forgot90: 'Последний вход 3 месяца назад',
                every_monday: 'Каждый понедельник',
                every_tuesday: 'Каждый вторник',
                every_wednesday: 'Каждую среду',
                every_thursday: 'Каждый четверг',
                every_friday: 'Каждую пятницу',
                every_saturday: 'Каждую субботу',
                every_sunday: 'Каждое воскресенье',
            },
        }
    },
    computed: {
        isPhotoDisabled(){
            return this.mailing.transport == 'sms'
        },
        isSubjectDisabled(){
            return this.mailing.transport == 'sms'
        },
        isRingtoneDisabled(){
            return this.mailing.transport == 'sms' || this.mailing.transport == 'email'
        },
        isLinkDisabled(){
            return this.mailing.transport == 'sms'
        }
    },
    methods:{
        async itemGet(){
            let request={
                mailing_id:this.mailingId
            };
            try{
                const result=await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemGet`,request)
                result.user_filter??={}
                if(result.regular_group !== '0'){
                    result.start_at = new Date(result.start_at).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" });
                } else {
                    result.is_delayed = new Date(result.start_at) > new Date()
                }
                this.mailing=result
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
        async imageChange(image_list){
            if(!image_list) return
            this.mailing.image = ""
            var active_imgs = image_list.find((el) => { return el.deleted_at == null});
            if(active_imgs && active_imgs.length > 0){
                this.mailing.image = `${this.$heap.state.hostname}image/get.php/${active_imgs[0].image_hash}.500.500.webp`
            }
        },
        async itemUpdate(){
            let request=this.mailing
            if(request.regular_group !== '0' && request.start_at.length < 10){
                request.start_at = '1999-07-01 '+request.start_at+':00';
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemUpdate`,JSON.stringify(request))
                this.$flash("💾 сохранено")
                this.itemGet()
            }catch{
                this.$flash("Ошибка сохранения")
            }
        },
        async itemDelete(){
            if(!confirm('Вы уверенны?')){
                return
            }
            const request={
                mailing_id:this.mailing.mailing_id
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemDelete`,request)
                this.$go({name: 'MailingList'});
            }catch{/** */}
        },
        itemValidate(){
            if(!this.mailing.start_at){
                alert(`Начало рассылки не заполнено`)
                return
            }
            if(this.mailing.regular_group == 0 && !this.mailing.user_filter.phones){
                alert(`Получатели не заполнены`)
                return
            }
            if(!this.mailing.subject_template){
                alert(`Заголовок не заполнен`)
                return
            }
            if(!this.mailing.text_template){
                this.$refs.text_template.$el.classList.add('ion-invalid');
                alert(`Содержание не заполнено`)
                return
            }
            if(!this.mailing.transport){
                alert(`Транспорт не заполнен`)
                return
            }
            return true
        },
        async itemStart(){
            //await this.$alert(this.mailing.text_template,this.mailing.subject_template)
            if(!this.itemValidate() || !confirm(`Запустить рассылку в ${this.mailing.start_at}?`)){
                return
            }
            const request={
                mailing_id:this.mailing.mailing_id
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemStart`,request)
                this.itemGet()
            }catch{/** */}
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
                this.mailing.user_filter.location=location.data
                this.recieverListCreate()
            }
        },
        async locationDelete( location_id ){
            try{
                this.mailing.user_filter.location=null
                this.recieverListCreate()
            }catch{
                this.$flash("Удалить адрес не удалось")
            }
        },
        async recieverListCreate(){ 
            try{
                const request={
                    mailing_id:this.mailing.mailing_id,
                }
                await this.itemUpdate()
                const recieverCount=await jQuery.post(this.$heap.state.hostname + "Admin/Mailing/recieverListCreate",request)
                this.$flash(`В список получателей добавлено ${recieverCount} запись`)
                this.itemGet(this.mailing.mailing_id)
            }catch{
                this.$flash("Создать список получателей не удалось")
            }
        }
    },
    ionViewDidEnter(){
        this.itemGet()
    },
}
</script>