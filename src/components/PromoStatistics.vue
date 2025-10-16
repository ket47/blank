<style scoped>
.promo-total{
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #23b94f;
  margin: 15px;
  color: white;
  padding: 15px;
  border-radius: 15px;
  animation: blinkColor 1.5s ease infinite alternate;
}
.promo-text{

}
.promo-text p{
  font-size: 12px;
}
.promo-value{
  display: flex;
  flex-wrap: nowrap;
  gap: 5px;
  align-items: flex-start;
}
.promo-value img{
  filter: drop-shadow(0px 1px 2px #0000008c);
}
.promo-value h2{
    text-shadow: 0px 1px 3px #00000078;
}
.promo-total h2,
.promo-total h4{
  margin: 0;
}
.promo-total p{
  margin-bottom: 0;
  margin-top: 7px;
}

.bonus-chip{
    vertical-align: top; 
    filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.466));
}
@keyframes blinkColor {
    0%{
        background: #238eb9;
    }
    100%{
        background: #23b94f;
    }
}
</style>

<template>
  <div>
    <div class="promo-total">
      <div class="promo-text">
        <h4>Мои кристалы</h4>
        <p>За последние 30 дней</p>
      </div>
      <div class="promo-value">
        <h2 slot="start">{{ bonusTotal }}</h2>
        <img src="/img/crystal.png" width="25px"/>
      </div>
    </div>
  </div>
  <ion-accordion-group>
    <ion-accordion value="first">
      <ion-item slot="header" color="light">
        <ion-label>Как <b>получить</b> изумруды?</ion-label>
      </ion-item>
      <div class="ion-padding" slot="content">
        <p style="font-size: 12px; margin: 0px;">
          При <b>покупке</b> товаров со значком изумруда <span><img class="bonus-chip" src="/img/crystal.png" width="14px"/></span> вы получаете на свой счёт соответствующее количество изумрудов.
        </p>
      </div>
    </ion-accordion>
    <ion-accordion value="second">
      <ion-item slot="header" color="light">
        <ion-label>Как <b>потратить</b> изумруды?</ion-label>
      </ion-item>
      <div class="ion-padding" slot="content">
        <p style="font-size: 12px; margin: 0px;">
          Вы можете <b>потратить</b> изумруды на реальные покупки. При этом <b>1 изумруд = 1 рубль</b>. Так вы можете оплатить до <b>100%</b> следующего заказа!
        </p>
      </div>
    </ion-accordion>
  </ion-accordion-group>
  <div class="ion-padding-horizontal"> 
    <h5>Статистика бонусов</h5>
    <p style="margin-top: 0">За последние 30 дней</p>
  </div>
  <ion-grid>
    <ion-row>
      <ion-col size="12" size-sm="4"><statistics-card v-if="dataset.bonus_gained" label="Заработано" :data="dataset.bonus_gained" format="integer" color="#008FFB" :dates="statisticsDates"/></ion-col>
      <ion-col size="12" size-sm="4"><statistics-card v-if="dataset.bonus_spent" label="Потрачено" :data="dataset.bonus_spent" format="integer" color="#04e398" :dates="statisticsDates"/></ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import {
  IonAccordionGroup,
  IonAccordion,
  IonLabel,
  IonChip,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
}                   from "@ionic/vue";
import {  
  timeOutline, 
  searchOutline
 }                  from 'ionicons/icons'
 
import jQuery           from 'jquery'
import StatisticsCard          from "@/components/StatisticsCard.vue";

export default {
  components: {
    IonAccordionGroup,
    IonAccordion,
    IonLabel,
    IonChip,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    StatisticsCard
  },
  setup(){
      return {
        timeOutline,
        searchOutline
      }
  },
  data() {
    return {
      dataset: {},
      bonusTotal: 0,
      statisticsDates: []
    };
  },
  computed: {
  },
  methods: {
    async listGet(){
        try{
            const request = {
                user_id: this.$heap.state.user.user_id,
                point_span: 3,
                point_num: 10
            }
            const response = await jQuery.post(`${this.$heap.state.hostname}Statistics/bonusParametersGet`, request)
            response.body.reverse()
            this.bonusTotal = response.head.bonus_total
            this.statisticsDates = this.parseDates(response)
            this.parseStatisticResponse(response)
            console.log(this.dataset)
        }catch{/** */}
    },
    parseStatisticResponse(response){
        const bars = {
          bonus_gained: true,
          bonus_spent: true
        }
        for(var param in bars){
          this.dataset[param] = {
            value: 0,
            series: []
          }
          for(var i in response.body){
            if(response.body[i][param]){
              this.dataset[param].series.push(response.body[i][param])
              this.dataset[param].value += response.body[i][param]*1
            }
          }
        }
    },
    parseDates(response){
        let result = [];
        for(var i in response.body){
            result.unshift(response.body[i].point_finish)
        }
        return result
    }
  },
  mounted(){
    this.listGet();
  },
  activated(){
    this.listGet();
  }
};
</script>

