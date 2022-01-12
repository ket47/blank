<template>
  <ion-content>
    <ion-item detail button @click="selectDeliveryAddress()">
      <ion-icon
        slot="start"
        style="color: var(--ion-color-primary)"
        :icon="location"
      />
      <ion-label> Выбрать адрес доставки </ion-label>
    </ion-item>
  </ion-content>
</template>

<script>
import { IonIcon } from "@ionic/vue";
import { location } from "ionicons/icons";
import store from "../store";

export default {
  name: "HomePage",
  components: {
    IonIcon,
  },
  setup() {
    return { location };
  },
  data() {
    return {
      error: "",
      user: store.state.user,
    };
  },
  methods: {
    selectDeliveryAddress() {
      console.log("Select address");
    },
  },
  computed: {
    isSignedIn() {
      return store.state.user.user_id && store.state.user.user_id > -1;
    },
  },
};
</script>