<template>
    <ion-item v-if="isMainLocationSet" detail button @click="selectDeliveryAddress()">
      <ion-img slot="start" :src="$heap.state.hostname + 'image/get.php/'+user.location_main.image_hash+'.24.24.webp'"/>
      <ion-label>{{user.location_main.location_address}} </ion-label>
    </ion-item>
    <ion-item v-else detail button @click="selectDeliveryAddress()">
      <ion-icon
        slot="start"
        style="color: var(--ion-color-primary)"
        :icon="location"
      />
      <ion-label> Выбрать адрес доставки </ion-label>
    </ion-item>
</template>

<script>
import { IonIcon } from "@ionic/vue";
import { location } from "ionicons/icons";
import heap from "../heap";
import router from '../router';

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
      user: heap.state.user,
    };
  },
  methods: {
    selectDeliveryAddress() {
        router.push({name: 'UserAddresses'});
    },
  },
  computed: {
    isSignedIn() {
      return heap.state.user.user_id && heap.state.user.user_id > -1;
    },
    isMainLocationSet(){
        return heap.state.user && heap.state.user.location_main;
    }
  },
};
</script>