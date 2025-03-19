<style scoped>
.order-segment {
  box-shadow: 0px -5px 5px #ddd;
  margin-top: 25px;
}
.order-segment:first-of-type {
  margin-top: 0px !important;
}
</style>

<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-item lines="none" color="primary">
        <ion-icon :icon="cartOutline" slot="start" />
        <ion-title>Корзина</ion-title>
        <ion-icon
          slot="end"
          @click="clearCart()"
          :icon="closeOutline"
          size="large"
        ></ion-icon>
      </ion-item>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div v-if="cartList.length">
      <div v-for="cart in cartList" :key="cart.order_id" class="order-segment">
        <order-comp :orderData="cart" @stageCreate="onStageCreate"></order-comp>
      </div>
    </div>
    <div
      v-else
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      "
    >
      <div style="width: max-content; text-align: center">
        <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
        <ion-label>Корзина пуста </ion-label><br />
        <a href="/catalog">на главную</a>
      </div>
    </div>
  </ion-content>
</template>

<script>
import {
  modalController,
  IonContent,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonItem,
} from "@ionic/vue";
import { closeOutline, sparklesOutline, cartOutline } from "ionicons/icons";
import heap from "@/heap";
import OrderComp from "@/components/OrderComp.vue";
import Order from "@/scripts/Order.js";

export default {
  components: {
    OrderComp,
    IonContent,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonItem,
  },
  setup() {
    const closeModal = function () {
      if (modalController && modalController.isOpen) {
        modalController.dismiss();
      }
    };
    return { closeModal, closeOutline, cartOutline, sparklesOutline };
  },
  data() {
    return {
      cartList: heap.state.cartList,
    };
  },
  created() {
    this.$topic.on("dismissModal", () => {
      this.closeModal();
    });
  },
  methods: {
    clearCart(order_id, mode) {
      this.closeModal();
      this.clearHighlightedProducts();
      return Order.cart.itemDelete(order_id, mode);
    },
    clearHighlightedProducts() {
      document
        .querySelectorAll(".incart")
        .forEach((item) => item.classList.remove("incart"));
    },
    async itemSync(order_id, order_stage_code) {
      try {
        const syncedOrder = await Order.cart.itemSync(order_id);
        const stateChangeResult = await Order.api.itemStageCreate( syncedOrder.order_id, order_stage_code );

        if (stateChangeResult == "ok" && order_stage_code != "customer_cart") {
          this.clearCart(syncedOrder.order_id);
        }
        if ( stateChangeResult == "ok" && order_stage_code == "customer_confirmed" ) {
          // const confirmedOrder = await Order.api.itemGet(syncedOrder.order_id);
          // this.$heap.commit("setCurrentOrder", confirmedOrder);
          await this.$router.push(`/order/order-${syncedOrder.order_id}`);
          await this.$router.push( `/modal/order-checkout-${syncedOrder.order_id}` );
          return;
        }
        this.$go("/order/order-" + syncedOrder.order_id);
      } catch (err) {
        const exception = err?.responseJSON;
        if (!exception) {
          return false;
        }
        const exception_code = exception.messages.error;
        switch (exception_code) {
          case "order_is_empty":
            this.$alert("К сожалению, товара не осталось в наличии ☹️","Заказ пуст");
            break;
          case "address_not_set":
            this.$flash("Необходимо добавить адрес доставки");
            this.$topic.publish("dismissModal");
            this.$go("/modal/user-addresses");
            this.$heap.state.next_route = "/order/order-" + order_id;
            break;
        }
        return false;
      }
    },
    onStageCreate(order_id, order_stage_code) {
      if (
        order_stage_code == "customer_purged" ||
        order_stage_code == "customer_deleted"
      ) {
        return this.clearCart(order_id, "purge_on_server");
      }
      if (order_stage_code == "customer_action_confirm") {
        order_stage_code = "customer_confirmed";
      }
      if (heap.state.user.user_id > 0) {
        //User is logged in;
        return this.itemSync(order_id, order_stage_code)
      }
      //User is not logged in;
      localStorage.unsyncedOrderId=order_id//ensuring that sync occur once
      this.$topic.on("userGet",(user)=>{
        if( user.user_id>0 && localStorage.unsyncedOrderId==order_id ){
          localStorage.unsyncedOrderId=null
          this.itemSync(order_id, order_stage_code)
          this.$flash("Продолжаем оформление заказа")
        }
      })

      this.$flash("Необходимо войти в профиль")
      this.$go("/modal/user-authorize");
    },
  },
};
</script>