<template>
  <base-layout :pageLogo="mainLogo">
      <home-slider/>
      <user-address-widget :deliveryTime="primaryDeliveryTime"/>
      <home-primary-category-widget @deliveryTimeGet="deliveryTime=>{primaryDeliveryTime=deliveryTime}"/>
      <store-list/>
  </base-layout>
</template>

<script>
import HomeSlider                 from "@/components/HomeSlider";
import StoreList                  from "@/components/StoreList";
import UserAddressWidget          from "@/components/UserAddressWidget";
import HomePrimaryCategoryWidget  from "@/components/HomePrimaryCategoryWidget";
import mainLogo             from "@/assets/icons/tezkel_logo.svg";

export default {
  setup() {
    return {
      mainLogo
    }
  },
  components: {
    HomeSlider,
    StoreList,
    UserAddressWidget,
    HomePrimaryCategoryWidget
  },
  data(){
    return {
      primaryDeliveryTime:null
    }
  }
};
</script>