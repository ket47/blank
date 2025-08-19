<style>
    ion-item.reaction-block-customer::part(native) {
        margin: 10px 0px ;
        background: var(--ion-color-primary, #0054e9);
        color: #fff;
        border-radius: 10px;
        animation: blinkColor 1.5s ease infinite alternate;
    }
    ion-item.reaction-block-courier::part(native) {
        margin: 10px 0px ;
        background: var(--ion-color-primary, #0054e9);
        color: #fff;
        border-radius: 10px;
        animation: blinkColor 1.5s ease infinite alternate;
    }
    .img-group-container{
        display: flex; 
        justify-content: space-evenly; 
        margin-top: -200px; 
        z-index: 100
    }
    .img-container{
        position: relative;
        text-align: center;
        z-index: 100;
    }
    .img-container  ion-button{
        margin-top: 80px;
    }
    .img-container ion-img{
        transition: 0.5s all ease;
        filter: grayscale(1);
        scale: 0.9;
        width: 300px;
    }
    .img-container:hover ion-img{
        filter: grayscale(0);
        scale: 1.1;
    }
    .img-container.img-left:hover ion-img{
        translate: 0px;
    }
    .img-container.img-right:hover ion-img{
        translate: 0px;
    }
    @media screen and (max-width: 768px){

        .img-group-container{
            margin-top: -120px; 
        }
        .img-container ion-img{
            width: 100%;
            filter: grayscale(0);
            scale: 1;
        }
        .img-container.img-left ion-img{
            margin-left: 15px;
        }
        .img-container.img-right ion-img{
            margin-right: 15px;
        }   

    }
    
  
    ion-item.reaction-block-customer:after{
        content: "";
        position: absolute;
        background: linear-gradient(45deg, transparent 8%, white 8%, white 9%, transparent 9%, transparent 11%, white 11%, white 14%, transparent 14%);
        top: -25%;
        left: 0;
        width: 100%;
        height: 120%;
        z-index: 100;
        opacity: 0;
        background-size: 200%;
        background-position-y: -15%;
        animation: blinkButton 3s ease infinite;
    }
    @keyframes blinkButton {
        0%{
            opacity: 0;
            transform: translateX(0%)
        }
        30%{
            opacity: 0.2;
            transform: translateX(50%)
        }
        60%,100%{
            opacity: 0;
            transform: translateX(100%)
        }
    }
    @keyframes blinkColor {
        0%{
            background: var(--ion-color-primary, #0054e9);
        }
        100%{
            background: rgb(38, 0, 255);
        }
    }
</style>
<template>
<div v-if="isLoaded && has_delivery_finish">
    <div style="padding: 8px;" v-if="(is_customer || is_admin)">
        <ion-item button v-if="!done_reactions.includes('speed') || !done_reactions.includes('appearence')" class="reaction-block-customer" color="transparent" lines="none"  id="openOrderReactionModal">
            <ion-label color="white">
                <h3><b>Оцените курьера</b></h3>
                <p>И получите бонус!</p>
            </ion-label>
            <ion-icon :icon="arrowForwardOutline" slot="end"></ion-icon>
        </ion-item>
        <!-- <ion-item button v-else class="reaction-block-customer" color="transparent" lines="none" href="/user/user-promo">
            <ion-label color="white">
                <h3><b>Спасибо за вашу оценку!</b></h3>
                <p>Вам начислен бонус.</p>
            </ion-label>
            <ion-icon :icon="arrowForwardOutline" slot="end"></ion-icon>
        </ion-item> -->
    </div>
    <div style="padding: 8px;" v-else-if="is_courier && isLoaded">
        <ion-item v-if="done_reactions.includes('rating')" class="reaction-block-courier" color="transparent" lines="none" >
            <ion-label color="white">
                <h3><b>Клиент оставил чаевые!</b></h3>
                Это клёвый клиент!
            </ion-label>
       </ion-item>
        <ion-item v-else class="reaction-block-courier" color="transparent" lines="none" >
            <ion-label color="white">
                <h3><b>Клиент оставил чаевые?</b></h3>
            </ion-label>
            <ion-button :icon="arrowForwardOutline" slot="end" color="light"  @click="createReaction(1, 'Клиент оставил чаевые!', `order:${orderData.order_id}:customer:rating`)">❤️+1 Клёвый клиент!</ion-button>
        </ion-item>
    </div>
    <ion-modal ref="reactionModal" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75]" class="reaction-modal" :handle="false"
        trigger="openOrderReactionModal" style="--overflow: visible; --border-radius: 25px;">
        <div class="block" v-if="currentStep == 0">
            <div class="img-group-container">
                <div class="img-container img-left">
                    <ion-img src="/img/wolves/wolf_slow.png" style="transform: scaleX(-1);"/>
                    <ion-button @click="createReaction(0, '', `order:${orderData.order_id}:courier:speed`)" color="danger">🐌 Медленный</ion-button>
                </div>
                <div class="img-container img-right">
                    <ion-img src="/img/wolves/wolf_fast.png" style="transform: scaleX(-1);"/>
                    <ion-button @click="createReaction(1, '', `order:${orderData.order_id}:courier:speed`)">⚡ Быстрый</ion-button>
                </div>
            </div>
            <div>
                <h3 style="text-align: center; margin-top: -120px;">Быстрый ли был курьер?</h3>
                <h5 style="text-align: center;color:#666">Время доставки ⏱️ {{delivery_time}}</h5>
            </div>
        </div>
        <div class="block" v-else-if="currentStep == 1">
            <div class="img-group-container">
                <div class="img-container img-left">
                    <ion-img src="/img/wolves/wolf_good.png"/>
                <ion-button @click="createReaction(1, '', `order:${orderData.order_id}:courier:appearence`)">🙂 Да</ion-button>
                </div>
                <div class="img-container img-right">
                    <ion-img src="/img/wolves/wolf_bad.png"/>
                    <ion-button @click="createReaction(0, '', `order:${orderData.order_id}:courier:appearence`)" color="danger">😐 Нет</ion-button>
                </div>
            </div>
            <div>
                <h3 style="text-align: center; margin-top: -100px;">Курьер выглядел опрятно?</h3>
            </div>
        </div>
        <div class="block" v-else-if="currentStep == 2">
            <div style="display: flex; justify-content: center;  margin-top: -200px; z-index: 100">
                <ion-img src="/img/wolves/wolf_thinking.png" style="width: 300px; "/>
            </div>
            <div class="ion-padding-horizontal">
                <h3 style="text-align: center;">Что бы вы посоветовали?</h3>
                <ion-textarea placeholder="Напишите свои мысли..." v-model="reactionComment"></ion-textarea>
            </div>
            <div  style="display: flex; justify-content: space-evenly;">
                <ion-button @click="currentStep++" color="medium">Пропустить</ion-button>
                <div>
                    <ion-button :disabled="reactionComment.length == 0" @click="createReaction(null, reactionComment, `order:${orderData.order_id}:courier:speed`)" color="primary">Подтвердить</ion-button>
                </div>
                
            </div>
        </div>
        <div class="block" v-else>
            <div style="display: flex; justify-content: center; margin-top: -200px; z-index: 100">
                <ion-img src="/img/wolves/wolf_asking.png" style="width: 300px; "/>
            </div>
            <div>
                <h3 style="text-align: center;">Не забудьте отблагодарить курьера</h3>
            </div>
            <div  style="display: flex; justify-content: space-evenly;">
                <ion-button @click="closeModal()">Хорошо</ion-button>
            </div>
        </div>
    </ion-modal>
</div>

</template>
<script>
import { 
    IonList,
    IonChip,
    IonItem,
    IonLabel,
    IonCard,
    IonCardTitle,
    IonAccordionGroup,
    IonAccordion,
    IonThumbnail,
    IonImg,
    IonIcon,
    IonModal,
    IonButton,
    IonTextarea
}                   from '@ionic/vue';
import {
    arrowForwardOutline,
    }               from 'ionicons/icons';

import User         from '@/scripts/User.js';

export default({
    props:['orderData'],
    components:{
    IonList,
    IonChip,
    IonItem,
    IonCard,
    IonCardTitle,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
    IonThumbnail,
    IonImg,
    IonIcon,
    IonModal,
    IonButton,
    IonTextarea
    },
    setup() {
        return { 
            arrowForwardOutline,
        }
    },
    data(){
        return {
            currentStep: 0,
            reactionComment: '',
            isFinished: null,
            isLoaded: false,
            done_reactions:[]
        }
    },
    computed:{
        is_admin(){
            return User.isAdmin()
        },
        is_customer(){
            return this.$heap.state.user?.user_id == this.orderData?.owner_id
        },
        is_courier(){
            return User.isCourier()
        },
        is_supplier(){
            return User.isSupplier()
        },
        has_system_finish(){
            return this.orderData?.stages?.find(stage=>stage.group_type=='system_finish')
        },
        has_delivery_finish(){
            return this.orderData?.stages?.find(stage=>stage.group_type=='delivery_finish')
        },
        delivery_time(){
            const start_stage=this.orderData?.stages.find(stage=>stage.group_type=='delivery_start')
            const finish_stage=this.orderData?.stages.find(stage=>stage.group_type=='delivery_finish')
            const diff=Date.parse(finish_stage.created_at.replace(' ','T'))-Date.parse(start_stage.created_at.replace(' ','T'))
            const time = new Date();
            time.setTime(diff)
            if(time.getUTCHours()>0){
                return `${time.getUTCHours()}ч ${time.getUTCMinutes()}мин ${time.getUTCSeconds()}с`
            }
            return `${time.getUTCMinutes()}мин ${time.getUTCSeconds()}с`
        },

    },
    methods: {
        async listGet(){
            try{
                const request={
                    tagQuery:`order:${this.orderData.order_id}`
                }
                const response = await this.$post("Reaction/listGet", request)

                this.done_reactions=[]
                for( let reaction of response ){
                    this.done_reactions.push(reaction.tag_option)
                }
                if(response.find((reaction) => reaction.tag_option == 'speed')) this.currentStep = 1
                if(response.find((reaction) => reaction.tag_option == 'appearence')) this.currentStep = 2
                if(response.length >= 2) {
                    this.isFinished = true
                } else {
                    this.isFinished = false
                }
                this.isLoaded=true
            } catch{
                //
            }
        },
        async createReaction(is_like, comment, target){
            const request={
                comment: comment,
                tagQuery:target
            }
            if(is_like !== null){
                request.is_like = is_like
                request.is_dislike = (!is_like)*1
            }
            try{
                await this.$post("Reaction/itemSave", request)
            }catch(err){
                //
            }
            this.currentStep++
        },
        closeModal(){
            this.$refs.reactionModal.$el.dismiss();
            this.isFinished = true
        }
    },
    watch:{
        'orderData':async function(newval){
            this.listGet()
        },
    }
})
</script>
