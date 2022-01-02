<template>

<yandex-map
    :coords="[55.681576, 37.488467]"
    :controls="['fullscreenControl']"
    :zoom="10"
    :dragable="false"
    :scrollZoom="false"
    :map-events="['created','destroy']"
    @mapWasInitialized="mapCreated"
    @created="mapCreated"
    @destroy="mapDestroy"
    @click="onClick">
        <region-select
          button-text="Please select ..."
          :region="[[55.761104221485205, 37.589244608215324],[55.753360214866454, 37.519893411926276], [55.74329069752624, 37.57207847052001]]"
          @changed="regionChanged">
        </region-select>
</yandex-map>

</template>

<script>

   // import {yandexMap, ymapMarker } from "vue-yandex-maps";


    export default {
      name: 'app',
      data () {
        return {
          map: null,
          map_data: [],
          mapObjectManager: null
        }
      },
      methods: {
        yamapReady: function () {

        },
        mapCreated: function () {
          

          // add points on map
          // ...
        },
        mapDestroy: function() {
          console.info('mapDestroy')
        },
        regionChanged: function ($coordinates, $polygon) {

          console.info('regionChanged, coord=', $coordinates)

          let visibleID = [];

          if (typeof $polygon === 'undefined') {
            $polygon = null;
          }

          this.map.behaviors.disable('drag');

          // check points in region
          this.mapObjectManager.setFilter(function (object) {

            let in_poligon = $polygon === null ? false : $polygon.geometry.contains(object.geometry.coordinates);
            let visible = $polygon === null ? true :  in_poligon;

            if($polygon !== null && in_poligon) {
              visibleID.push(object.id)
            }

            return visible
          })

          console.log('map, selected point ID', visibleID)
        }
      }
    }
</script>