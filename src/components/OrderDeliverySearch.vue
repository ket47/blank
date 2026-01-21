<style scoped>
  ion-card{
    margin: 10px 16px;
    overflow: visible;
    contain: initial;
    border-radius: 10px;
  }
  ion-card-content.card-content{
    display: flex;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--ion-color-light-shade);
  }
  ion-card-content.card-content img{
    margin-left: -5px;
    margin-top: -15px;
    scale: 1.15;
  }
  ion-card-header{
      padding: 8px;
  }
  ion-chip.button {
    --background: var(--ion-color-primary);
    --color: white;
  }
  ion-chip.tip-button {
    --background: var(--ion-color-success);
    --color: white;
  }
</style>
<template>
  <ion-card class="delivery-search-card" color="light">
    <ion-card-content class="card-content">
        <div class="card-section">
            <img width="100px" src="/img/searching_wolf.png"/>
        </div>
        <div class="card-section">
            <ion-card-header>
                <h3 style="color: var(--ion-color-dark)"><b>Ищем курьера...</b></h3>
                <p style="color: var(--ion-color-primary)">
                    <span>Текущее ускорение: <b>{{ currentPromisedTip }}₽</b></span>
                </p>
                <div>
                    <ion-chip color="success" v-if="currentPromisedTip > 0">
                        <ion-label>+{{ currentPromisedTip }}₽</ion-label>
                    </ion-chip>
                    <ion-chip class="button" @click="promisedTipModal = true">
                        <ion-label><b>⚡ Ускорить</b></ion-label>
                    </ion-chip>
                </div>
            </ion-card-header>
        </div>
    </ion-card-content>
    <ion-card-content class="card-action">
        <span style="font-size: 12px; color: var(--ion-color-medium)">Поиск прекратится автоматически через <b>{{ deliverySearchUntill }}</b></span>
    </ion-card-content>
  </ion-card>
  <ion-modal :is-open="promisedTipModal" :initialBreakpoint="0.35" @didDismiss="promisedTipModal = false">
        <ion-content class="ion-padding" style="text-align: center">
            <h3>Ускорение поиска</h3>
            <p>Текущие обещанные чаевые: <b>{{ currentPromisedTip }}₽</b></p>
            <p style="font-size: 14px;">Обещанные чаевые повышают интерес курьеров к вашему заказу</p>
            <div style="margin: 12px 0; display: flex; justify-content: center;">
                <ion-chip class="tip-button" @click="addTip(20)">
                    <ion-label style="font-size: 16px"><b>+20₽</b></ion-label>
                </ion-chip>
                <ion-chip class="tip-button" @click="addTip(30)">
                    <ion-label style="font-size: 16px"><b>+30₽</b></ion-label>
                </ion-chip>
                <ion-chip class="tip-button" @click="addTip(50)">
                    <ion-label style="font-size: 16px"><b>+50₽</b></ion-label>
                </ion-chip>
            </div>
            <ion-button expand="block" color="light" @click="promisedTipModal = false">Закрыть</ion-button>
        </ion-content>
      </ion-modal>
</template>

<script>
import {
    IonContent,
    IonButton,
    IonLabel,
    IonChip,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonModal
} from '@ionic/vue';

export default {
    props:['orderData'],
    components: {
        IonContent,
        IonButton,
        IonLabel,
        IonChip,
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonModal
    },
    computed: {
        deliverySearchUntill() {
            const diff = this.orderData.delivery_search_until - this.now;
            if (diff <= 0) return '00:00';

            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            const m = String(minutes).padStart(2, '0');
            const s = String(seconds).padStart(2, '0');

            return `${m}:${s}`;
        }
    },
    data(){
        return {
            currentPromisedTip: 0,
            promisedTipModal: false,
            now: Math.floor(Date.now() / 1000),
            timerInterval: null
        }
    },
    methods: {
        addTip(quantity) {
            this.currentPromisedTip += quantity
            this.promisedTipModal = false
        }
    },
    mounted() {
        this.timerInterval = setInterval(() => {
            this.now = Math.floor(Date.now() / 1000);
        }, 1000);
    },

    beforeUnmount() {
        clearInterval(this.timerInterval);
    }
};
</script>