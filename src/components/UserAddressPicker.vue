<template>
    <ion-header>
        <ion-toolbar color="light">
            <ion-button slot="start" @click="pickAddress" :disabled="!selectedPlacemark" color="success">
                <ion-icon :icon="locationOutline" /> Добавить адрес
            </ion-button>
            <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
        </ion-toolbar>
        <ion-searchbar id="suggest" placeholder="Поиск адреса"></ion-searchbar>
    </ion-header>
  <ion-content>
        <div id="map" style="width: 100%; height: 100%;"></div>
  </ion-content>
</template>

<script>
import { 
    IonContent,
    IonToolbar,
    IonButton,
    IonSearchbar,
    IonHeader,
    IonIcon,
    modalController
}                           from "@ionic/vue";
import { loadYmap }         from "vue-yandex-maps";
import { locationOutline,closeOutline }  from 'ionicons/icons';

export default({
    components: {
    IonContent,
    IonToolbar,
    IonButton,
    IonSearchbar,
    IonHeader,
    IonIcon,
    },
    setup() {
        const closeModal = function(){
            modalController.dismiss();
        };
        return { closeModal, locationOutline,closeOutline };
    },
    props: {
		location_group_name_low: String,
        location_group_id: Number
    },
    data(){
        let locationType=this.location_group_name_low+" адрес"
        let locSettings=this.$heap.state.location;
        return {
            mapBoundaries:locSettings.mapBoundaries,
            mapCenter:locSettings.mapCenter,
            locationType,
            ymapApiKey:locSettings.ymapApiKey,
            addressErase:locSettings.addressErase,
            selectedPlacemark:0,
            selectedAddress:'',
            selectedCoords:[]
        };
    },
    methods:{
        pickAddress(){
            var coords=JSON.parse(JSON.stringify(this.selectedCoords)) || [];
            var location={
                location_address:this.clearAddress(this.selectedAddress),
                location_latitude:coords[0],
                location_longitude:coords[1],
            };
            modalController.dismiss(location);
        },
        clearAddress( address ){
            return String(address).replace(this.addressErase,'');
        }
    },
    async mounted() {
        var self=this;
        await loadYmap({
            apiKey: self.ymapApiKey,
            lang: 'ru_RU',
            coordorder: 'latlong',
            enterprise: false,
            version: '2.1'
        });
        var ymaps=window.ymaps;


        ymaps.geolocation.get().then((res) => {
            myMap.setCenter(res.geoObjects.position);
        });

        
        var myPlacemark;
        var myMap = new ymaps.Map('map', {
            center: self.mapCenter,
            zoom: 17,
            controls: []
        });
        var suggestView = new ymaps.SuggestView('suggest',{boundedBy:self.mapBoundaries});
        suggestView.events.add('select',function(e){
            self.selectedAddress=e.get('item').displayName;
            ymaps.geocode(self.selectedAddress).then(function (res) {
                var coords=res.geoObjects.get(0).geometry.getCoordinates();
                createPlacemark(coords);
                myMap.setCenter(coords);
            });
        });
        myMap.events.add('click', function (e) {
            var coords = e.get('coords');
            self.selectedCoords=coords;
            createPlacemark(coords);
            getAddress(coords);
        });
        function createPlacemark(coords) {
            self.selectedCoords=coords;
            self.selectedPlacemark=1;
            if (myPlacemark) {
                myPlacemark.geometry.setCoordinates(coords);
            }
            else {
                myPlacemark = new ymaps.Placemark(coords, {
                    iconCaption: self.locationType
                }, {
                    preset: 'islands#violetDotIconWithCaption',
                    draggable: true
                });
                myMap.geoObjects.add(myPlacemark);
                myPlacemark.events.add('dragend', function () {
                    self.selectedCoords=myPlacemark.geometry.getCoordinates();
                    getAddress(self.selectedCoords);
                });
            }
        }
        function getAddress(coords) {
            myPlacemark.properties.set('iconCaption', self.locationType);
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                myPlacemark.properties
                        .set({
                            iconCaption: self.locationType,
                            balloonContent: [
                                    firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                                ].filter(Boolean).join(', ')
                        });
                self.selectedAddress=firstGeoObject.getAddressLine();
            });
        }
    },
});
</script>