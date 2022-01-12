<template>
  <base-layout page-title="Home">
    <ion-page ref="Home">
        <home-slider></home-slider>
        <user-address-widget></user-address-widget>
        <order-slider></order-slider>
        <store-list></store-list>
    </ion-page>
  </base-layout>
</template>

<script>
  import HomeSlider from '../components/HomeSlider';
  import StoreList from '../components/StoreList';
  import OrderSlider from '../components/OrderSlider';
  import UserAddressWidget from '../components/UserAddressWidget';

  export default  {
    name: 'HomePage',
    components: { 
          HomeSlider, 
          StoreList,
          OrderSlider,
          UserAddressWidget
      }
  }
</script>