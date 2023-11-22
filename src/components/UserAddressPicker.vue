<template>
    <ion-content>
        <yandex-map @click="onClick($event)" style="height:100%" 
        :coords="coords"
        :zoom="16"
        :settings="settings"
        :controls="['zoomControl']"
        >
            <ymap-marker :coords="coords" marker-id="1" :properties="placemarkProperties"/>
        </yandex-map>
        <div style="position: absolute;top: 30px;width:100%;--ion-item-background: #ffffffdd;border-radius:10px;">
            <ion-searchbar debounce="500" v-model="addressSearchQuery" @ionInput="suggestionsGet()" placeholder="поиск по адресу" color="light"/>
            <ion-item v-for="(row,i) in suggestions" :key="i" @click="suggestionSelect(`${row.subtitle.text}, ${row.title.text}`,row.uri)" style="margin-right:10px;margin-left:10px">
                {{row.subtitle.text}} {{row.title.text}} 
                <span slot="end" style="color:#666">{{row.distance.text}}</span>
            </ion-item>
        </div>
    </ion-content>
    <ion-toolbar>
        <ion-textarea label="комментарий к адресу" label-placement="floating" v-model="addressComment"></ion-textarea>
        <ion-button :strong="true" @click="pickAddress()" color="primary" expand="block">
            <ion-icon :src="checkmark" slot="start"/>
            Ок
        </ion-button>
        <ion-button @click="closeModal()" color="light" expand="block">Закрыть</ion-button>
    </ion-toolbar>
</template>

<script>
import { 
    IonContent,
    IonToolbar,
    IonButton,
    IonSearchbar,
    IonIcon,
    IonItem,
    IonTextarea,
    modalController
}                           from "@ionic/vue";
import { yandexMap,ymapMarker,loadYmap }         from "vue-yandex-maps";
import { locationOutline,closeOutline,checkmark }  from 'ionicons/icons';
import User from '@/scripts/User.js'

export default({
    components: {
    IonContent,
    IonToolbar,
    IonButton,
    IonSearchbar,
    IonIcon,
    IonItem,
    IonTextarea,
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
            suggestions:[],
            addressSearchQuery:null,
            locationType,
            locSettings,
            selectedPlacemark:0,
            selectedAddress:'',
            selectedCoords:[],
            coords: mapCenter,
            addressComment:''
        };
    },
    methods:{
        async pickAddress(){
            try{
                if( !this.selectedAddress ){
                    const result=await window.ymaps.geocode(this.coords)
                    this.selectedAddress=result.geoObjects.get(0)?.getAddressLine();                    
                }
            } catch(err){
                //console.log(err)
            }
            var location={
                location_address:this.filterAddress(this.selectedAddress),
                location_latitude:this.coords[0],
                location_longitude:this.coords[1],
                location_comment:this.addressComment
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
            this.suggestions=[]
            this.selectedAddress=null
            this.coords=e.get('coords')
        },
        async suggestionsGet(){
            if( !this.addressSearchQuery ){
                this.suggestions=[]
                return
            }
            try{
                const sapikey=this.$heap.state.settings.location.ymapSuggestionApiKey
                const ll=this.coords.slice().reverse().join(',')
                const response= await fetch(`https://suggest-maps.yandex.ru/v1/suggest?apikey=${sapikey}&lang=ru_RU&ll=${ll}&spn=1,1&attrs=uri&types=house&results=5&text=${this.addressSearchQuery}`)
                const responseData=await response.json()
                this.suggestions=responseData.results||[]
            }catch{
                /** */
            }
        },
        async suggestionSelect( address, uri ){
            this.selectedAddress=address
            this.geocode(uri)
        },
        async geocode( uri ){
            try{
                this.suggestions=[]
                const apikey=this.$heap.state.settings.location.ymapApiKey
                const response= await fetch(`https://geocode-maps.yandex.ru/1.x?apikey=${apikey}&format=json&results=1&uri=${uri}`)
                const responseData=await response.json()
                const geoObject=responseData.response.GeoObjectCollection.featureMember[0].GeoObject
                this.coords=geoObject.Point.pos.split(" ").reverse()
            }catch(err){
                console.log(err)
            }
        }
    },
    async mounted(){
        await loadYmap();
        
        const lastStoredPosition=User.geo.lastStoredGet()
        if( lastStoredPosition?.location_latitude ){
            this.coords=[lastStoredPosition.location_latitude,lastStoredPosition.location_longitude]
        } else {
            const geo=await User.geo.get()
            if(geo){
                const {coords}=geo
                this.coords=[coords.latitude,coords.longitude]
                this.$flash("На карте отмечено ваше местоположение")
            }
        }
    }
});
</script>