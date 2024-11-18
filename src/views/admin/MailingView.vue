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
        <ion-segment value="blank" scrollable swipe-gesture="true" v-model="mailingType">
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
            <ion-searchbar placeholder="Фильтр" show-clear-button="always" v-model="filter" @ionInput="listFilter()"/>
            <ion-item v-for="mailing in mailingListActive" :key="mailing.mailing_id">
                <ion-label  @click="$go(`/admin/mailing-edit-${mailing.mailing_id}`)">
                    <ion-note v-if="mailing.mailing_type == 'finished'" color="medium" class="ion-text-wrap"  style="font-size: 12px">{{ mailing.start_at_humanized }}</ion-note><br />
                    <ion-text>{{mailing.subject_template}}</ion-text>
                    <div>
                        <ion-chip v-if="mailing.transport == 'push'" :icon="phonePortraitOutline" style="--background: #6030ff;--color: white; font-size: 12px;">push</ion-chip>
                        <ion-chip v-else-if="mailing.transport == 'email'" :icon="mailOutline" style="--background: #ff6810;--color: white; font-size: 12px;">e-mail</ion-chip>
                        <ion-chip v-else-if="mailing.transport == 'sms'" :icon="sendOutline" style="--background: #00213f;--color: white; font-size: 12px;">sms</ion-chip>
                        <ion-chip v-else-if="mailing.transport == 'telegram'" :icon="sendOutline" style="--background: #0163aa;--color: white; font-size: 12px;">telegram</ion-chip>

                        
                        <ion-chip v-if="mailing.recieverCount?.all>0">Всего {{mailing.recieverCount.all}}</ion-chip>
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
  IonSearchbar,
  IonPopover,
  IonContent,
  IonBadge,
  IonChip
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
        IonSearchbar,
        IonPopover,
        IonContent,
        IonBadge,
        IonChip
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
            filter:'',
            mailingType: 'blank',
            mailingList:[],
            mailingListGrouped: [],
            mailingListActive: [],
            isMailingOpen:false,
            saveClock:null
        }
    },
    computed:{
    },
    methods:{
        async itemCreate(){
            const request={
                subject_template:'Без названия'
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
                const mailing_id=await jQuery.post(`${this.$heap.state.hostname}Admin/Mailing/itemCopy`,request)
                this.listGet()
            }catch{/** */}
        },
        async itemDelete(mailing_id){
            if(!confirm('Вы уверенны?')){
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
            var response
            const filter = {
                'mailing_type': this.mailingType,
                'name_query': this.filter
            }
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
            this.mailingListActive = this.mailingListGrouped[this.mailingType]
            if(this.filter){
                this.mailingListActive = this.mailingListActive.filter((el) => el.subject_template.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1)
            }
        },
        dateHumanize(date){
            var delta = Math.round((+new Date() - new Date(date)) / 1000);
            var minute = 60,
                hour = minute * 60,
                day = hour * 24,
                week = day * 7;
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
        'mailingType'(){
            this.listFilter()
        }
    },
}
</script>