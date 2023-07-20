<template>
    <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="closeModal()" color="primary">
                <ion-icon :icon="closeOutline" slot="start"/>
                Закрыть
            </ion-button>
          </ion-buttons>
          <ion-label size="large">Добавление адреса</ion-label>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="pickAddress()" color="primary">
                <ion-icon :src="checkmark" slot="start"/>
                Ок
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-searchbar id="suggest" placeholder="название улицы, номер дома"/>
    </ion-header>
  <ion-content>
    <yandex-map :coords="coords" :zoom="16" @click="onClick($event)" style="height:100%" :settings="settings">
        <ymap-marker :coords="coords" marker-id="1" :properties="placemarkProperties"/>
    </yandex-map>
  </ion-content>
</template>

<script>
import { 
    IonContent,
    IonToolbar,
    IonButton,
    IonButtons,
    IonSearchbar,
    IonHeader,
    IonIcon,
    modalController
}                           from "@ionic/vue";
import { yandexMap,ymapMarker,loadYmap }         from "vue-yandex-maps";
import { locationOutline,closeOutline,checkmark }  from 'ionicons/icons';

export default({
    components: {
    IonContent,
    IonToolbar,
    IonButton,
    IonButtons,
    IonSearchbar,
    IonHeader,
    IonIcon,
    yandexMap,
    ymapMarker,
    },
    setup() {
        const closeModal = function(){
            modalController.dismiss();
        };
        return { closeModal, locationOutline,closeOutline,checkmark };
    },
    props: {
		location_group_name_low: String,
        location_group_id: Number
    },
    data(){
        let locationType=this.location_group_name_low+" адрес"
        let locSettings=this.$heap.state.settings.location;
        let mapCenter=JSON.parse(locSettings.mapCenter)

        return {
            settings: {
                apiKey: locSettings.ymapApiKey,
                lang: "ru_RU",
                coordorder: "latlong",
                version: "2.1",
            },
            placemarkProperties:{
                iconCaption:locationType
            },
            locationType,
            locSettings,
            selectedPlacemark:0,
            selectedAddress:'',
            selectedCoords:[],
            coords: mapCenter
        };
    },
    methods:{
        async pickAddress(){
            try{
                const result=await window.ymaps.geocode(this.coords)
                this.selectedAddress=result.geoObjects.get(0)?.getAddressLine();
            } catch(err){
                //console.log(err)
            }
            var location={
                location_address:this.filterAddress(this.selectedAddress),
                location_latitude:this.coords[0],
                location_longitude:this.coords[1],
            };
            modalController.dismiss(location);
        },
        filterAddress( address ){
            const bannedParts=this.locSettings.addressErase.split(', ')
            const parts=address.split(', ')
            let filtered=[]
            for(const part of parts){
                if(bannedParts.find(pt=>pt==part)){
                    continue
                }
                filtered.push(part)
            }
            return filtered.reverse().join(', ')
        },
        onClick(e) {
            if( !e || !e.get ){
                return
            }
            this.coords=e.get('coords')
        }
    },
    async mounted(){
        await loadYmap();
        let ymaps=window.ymaps
        const mapBoundaries = JSON.parse('['+this.locSettings.mapBoundaries[0]+']');
        const suggestView = new ymaps.SuggestView('suggest',{boundedBy:mapBoundaries});
        suggestView.events.add('select',(e)=>{
            this.selectedAddress=e.get('item').displayName;
            ymaps.geocode(this.selectedAddress).then(res=>{
                this.coords=res.geoObjects.get(0).geometry.getCoordinates();
            });
        });
        this.$flash("Получаем местоположение устройства")
        ymaps.geolocation.get().then(res => {
            this.coords = res.geoObjects.position;
            this.$flash("На карте отмечено ваше местоположение")
        });
    }
});
</script>