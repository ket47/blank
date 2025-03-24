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
        <ion-segment value="blank" scrollable swipe-gesture="true" v-model="filter.mailing_type.value">
            <ion-segment-button value="blank">
                <ion-label>Неопубликованные <ion-badge >{{mailingListGrouped.blank?.length}}</ion-badge></ion-label>
            </ion-segment-button>
            <ion-segment-button value="finished">
                <ion-label>Завершённые <ion-badge>{{mailingListGrouped.finished?.length}}</ion-badge></ion-label>
            </ion-segment-button>
            <ion-segment-button value="repeated">
                <ion-label>Регулярные <ion-badge slot="end" color="primary">{{mailingListGrouped.repeated?.length}}</ion-badge></ion-label>
            </ion-segment-button>
        </ion-segment>
        <ion-list>
                    <ion-list slot="content">
                        <ion-item >
                            <ion-input placeholder="Название" show-clear-button="always" v-model="filter.subject_template.value" @ionInput="listFilter()"/>
                        </ion-item>
                        <ion-item>
                            <ion-select placeholder="Транспорт" label="Транспорт" v-model="filter.transport.value" @ionChange="listFilter()" :multiple="filter.transport.multiple">
                                <ion-select-option value="push">Push</ion-select-option>
                                <ion-select-option value="email">Email</ion-select-option>
                                <ion-select-option value="telegram">Telegram</ion-select-option>
                                <ion-select-option value="sms">Sms</ion-select-option>
                            </ion-select>
                        </ion-item>
                        <ion-item v-if="filter.mailing_type.value == 'repeated'">
                            <ion-select placeholder="Группа рассылок" label="Группа рассылок"  v-model="filter.regular_group.value" @ionChange="listFilter()" :multiple="filter.regular_group.multiple">
                                <ion-select-option v-for="(translation, code) in regularGroupTranslation" :value="code" :key="translation">{{ translation }}</ion-select-option>
                            </ion-select>
                        </ion-item>
                    </ion-list>
            <ion-item v-for="mailing in mailingListActive" :key="`${mailing.subject_template}_${mailing.mailing_id}`">
                <ion-label  @click="$go(`/admin/mailing-edit-${mailing.mailing_id}`)">
                    <ion-note v-if="mailing.mailing_type == 'finished'" color="medium" class="ion-text-wrap"  style="font-size: 12px">{{ mailing.start_at_humanized }}</ion-note><br />
                    <ion-text>{{mailing.subject_template}}</ion-text>
                    <div>
                        <ion-chip v-if="mailing.transport == 'push'" :icon="phonePortraitOutline" style="--background: #6030ff;--color: white; font-size: 12px;">push</ion-chip>
                        <ion-chip v-else-if="mailing.transport == 'email'" :icon="mailOutline" style="--background: #ff6810;--color: white; font-size: 12px;">e-mail</ion-chip>
                        <ion-chip v-else-if="mailing.transport == 'sms'" :icon="sendOutline" style="--background: #00213f;--color: white; font-size: 12px;">sms</ion-chip>
                        <ion-chip v-else-if="mailing.transport == 'telegram'" :icon="sendOutline" style="--background: #0163aa;--color: white; font-size: 12px;">telegram</ion-chip>
                        <ion-chip v-if="mailing.recieverCount?.all>0">Всего {{mailing.recieverCount.all}}</ion-chip>
                        <ion-chip v-if="mailing.regular_group !== '0'" :icon="sendOutline" style="--background: var(--ion-color-primary);--color: white; font-size: 12px;">{{ regularGroupTranslation[mailing.regular_group] }}</ion-chip>
                    </div>
                    
                </ion-label>
                <div  slot="end">
                    <ion-button :id="`click-trigger-${mailing.mailing_id}`" fill="clear">
                        <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
                    </ion-button>
                    <ion-popover :trigger="`click-trigger-${mailing.mailing_id}`" trigger-action="click" :dismiss-on-select="true" :show-backdrop="false">
                        <ion-content>
                            <ion-list lines="full" class="ion-no-padding">
                                <ion-item button @click="$go(`/admin/mailing-edit-${mailing.mailing_id}`)">
                                    <ion-icon slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>Редактировать</ion-label>
                                </ion-item>
                                <ion-item button @click="itemCopy(mailing.mailing_id)">
                                    <ion-icon slot="end" :icon="copyOutline"></ion-icon>
                                    <ion-label>Дублировать</ion-label>
                                </ion-item>
                                <ion-item button @click="itemDelete(mailing.mailing_id)">
                                    <ion-icon slot="end" :icon="trash" color="danger"></ion-icon>
                                    <ion-label color="danger">Удалить</ion-label>
                                </ion-item>
                            </ion-list>
                        </ion-content>
                    </ion-popover>
                </div>
            </ion-item>
        </ion-list>
    </base-layout>
</template>
<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonNote,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonPopover,
  IonContent,
  IonBadge,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonInput
 }                          from '@ionic/vue';
 import {
    addOutline,
    playOutline,
    locationOutline,
    checkmarkCircleOutline,
    ellipseOutline,
    phonePortraitOutline,
    copyOutline,
    mailOutline,
    repeatOutline,
    sendOutline,
    ellipsisVertical,
    pencil,
    trash
 }                          from "ionicons/icons";
import Utils                from '@/scripts/Utils'
import jQuery               from 'jquery'


export default {
    components: {
        IonList,
        IonItem,
        IonLabel,
        IonIcon,
        IonNote,
        IonText,
        IonButton,
        IonSegment,
        IonSegmentButton,
        IonPopover,
        IonContent,
        IonBadge,
        IonChip,
        IonSelect,
        IonSelectOption,
        IonInput
    },
    setup(){
        return {
            addOutline,
            checkmarkCircleOutline,
            ellipseOutline,
            playOutline,
            locationOutline,
            phonePortraitOutline,
            copyOutline,
            mailOutline,
            repeatOutline,
            sendOutline,
            ellipsisVertical,
            pencil,
            trash,
        }
    },
    data(){
        return{
            openedAccordion:'message',
            filter: {
                transport: {
                    value: '',
                    multiple: true
                },
                mailing_type: {
                    value: 'blank'
                },
                subject_template: {
                    value: ''
                },
                regular_group: {
                    value: '',
                    multiple: true
                },
            },
            mailingList:[],
            mailingListGrouped: [],
            mailingListActive: [],
            isMailingOpen:false,
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
    computed:{
    },
    methods:{
        async itemCreate(){
            const request={
                subject_template:''
            }
            try{
                const mailing_id=await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemCreate`,request)
                this.$go(`/admin/mailing-edit-${mailing_id}`)
            }catch{/** */}
        },
        async itemCopy(mailing_id){
            const request={
                mailing_id
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemCopy`,request)
                this.listGet()
            }catch{/** */}
        },
        async itemDelete(mailing_id){
            if(!confirm('Вы уверены?')){
                return
            }
            const request={
                mailing_id:mailing_id
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemDelete`,request)
                this.isMailingOpen=false
                this.listGet()
            }catch{/** */}
        },
        async listGet(){
            this.mailingList=await Utils.prePost(`${this.$heap.state.hostname}Admin/Mailing/listGet`,{})
            try{
                this.mailingList=await Utils.post(`${this.$heap.state.hostname}Admin/Mailing/listGet`,{})
                for(var i in this.mailingList){
                    this.mailingList[i].start_at_humanized = this.dateHumanize(this.mailingList[i].start_at)
                    this.mailingList[i].mailing_type = this.mailingList[i].regular_group != 0 ? 'repeated' : (this.mailingList[i].is_started == '1' ? 'finished' : 'blank');
                }
                this.mailingList.sort(function (a, b) {
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                this.listGroup()
                this.listFilter()
            }catch(err){
                /** console.log(err) **/
            }
        },
        listGroup(){
            this.mailingListGrouped = this.mailingList.reduce(function(rv, x) {
                (rv[x['mailing_type']] = rv[x['mailing_type']] || []).push(x);
                return rv;
            }, {});
        },
        listFilter(){
            this.mailingListActive = this.mailingListGrouped[this.filter.mailing_type.value] 
            for(var i in this.filter){
                if(this.filter[i] && this.filter[i].value){
                    if(this.filter[i].multiple){
                        if(this.filter[i].value.length == 0) continue
                        var mailingList = []
                        for(const k in this.filter[i].value){
                            mailingList = mailingList.concat(this.mailingListActive.filter((el) => el[i] == this.filter[i].value[k]))
                        }
                        this.mailingListActive = mailingList
                    } else {
                        this.mailingListActive = this.mailingListActive.filter((el) => el[i].toLowerCase().indexOf(this.filter[i].value.toLowerCase()) !== -1)
                    }
                    
                }
            }
        },
        dateHumanize(date){
            var delta = Math.round((+new Date() - new Date(date)) / 1000);
            var minute = 60,
                hour = minute * 60,
                day = hour * 24
            var fuzzy;
            if (delta < 30) {
                fuzzy = 'Только что.';
            } else if (delta < minute) {
                fuzzy = delta + ' сукунд назад.';
            } else if (delta < 2 * minute) {
                fuzzy = 'минуту назад.'
            } else if (delta < hour) {
                fuzzy = Math.floor(delta / minute) + ' минут назад.';
            } else if (Math.floor(delta / hour) == 1) {
                fuzzy = 'Час назад.'
            } else if (delta < day) {
                fuzzy = Math.floor(delta / hour) + ' часов назад.';
            } else if (delta < day * 2) {
                fuzzy = 'Вчера';
            } else {
                fuzzy = new Date(date).toLocaleString("ru", {day: 'numeric', month: 'long'})
            }
            return fuzzy
        }
    },
    ionViewDidEnter(){
        this.listGet()
    },
    watch:{
        'filter.mailing_type.value'(){
            this.filter.transport.value = ''
            this.filter.regular_group.value = ''
            this.filter.subject_template.value = ''
            this.listFilter()
        }
    },
}
</script>