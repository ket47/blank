<template>
  <base-layout page-title="Home">
    <ion-page ref="Home">
        <order-slider></order-slider>
        <home-slider></home-slider>
        <user-address-picker></user-address-picker>
        <store-list></store-list>
    </ion-page>
  </base-layout>
</template>

<script>
  import HomeSlider from '../components/HomeSlider';
  import StoreList from '../components/StoreList';
  import OrderSlider from '../components/OrderSlider';

  export default  {
    name: 'HomePage',
    components: { 
          HomeSlider, 
          StoreList,
          OrderSlider
      }
  }
</script>