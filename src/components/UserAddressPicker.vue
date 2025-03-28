<style scoped>
    ion-searchbar.search{
        --background:#fff;
        --padding:15px;
        --icon-color: var(--ion-color-primary);
        --placeholder-color: var(--ion-color-primary);
        --border-radius:0px !important;
        margin-top: -11px;
    }
</style>

<template>
    <ion-content>
        <yandex-map v-if="showed" @click="onClick($event);" style="height:100%" 
            :coords="coords"
            :zoom="16"
            :settings="settings"
            :controls="['zoomControl']"
        >
            <ymap-marker :coords="coords" marker-id="1" :properties="placemarkProperties"/>
        </yandex-map>
        <div style="position: absolute;bottom: 10px;width:100%;">
            <div style="margin-left:12px;margin-right:12px;background-color: #ffffffdd;--ion-item-background: #ffffff00;border-top-left-radius:10px;border-top-right-radius:10px;">
                <ion-item v-for="(row,i) in suggestions" :key="i" @click="suggestionSelect(`${row.subtitle.text}, ${row.title.text}`,row.uri)" lines="full">
                    <p v-if="i==0">
                        <b>{{row.subtitle.text}} {{row.title.text}} </b>
                    </p>
                    <p v-else>
                        {{row.subtitle.text}} {{row.title.text}} 
                    </p>
                    <span slot="end" style="color:#666">{{row.distance.text}}</span>
                </ion-item>
            </div>
            <ion-searchbar debounce="500" v-model="addressSearchQuery" @ionInput="suggestionsGet()" @keyup.enter="pickAddress()" placeholder="поиск по адресу" class="search"/>
        </div>
    </ion-content>
    <ion-toolbar style="--background: white">
        <div style="width:100%;">
            <ion-segment v-if="locationGroups" mode="ios" v-model="locationGroup">
                <ion-segment-button v-for="location in locationGroups" :key="location.group_id" :value="location">
                    <ion-img :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.40.40.png`" style="height:18px"/>
                    <ion-label>{{ location.group_name }}</ion-label>
                </ion-segment-button>
            </ion-segment>
            <ion-input label="комментарий к адресу" label-placement="floating" v-model="addressComment"></ion-input>
            <div style="display:grid;grid-template-columns:1fr 1fr">
                <ion-button @click="closeModal()" color="light" expand="block">
                    <ion-icon :src="closeOutline" slot="start"/>
                    Закрыть
                </ion-button>                
                <ion-button :strong="true" @click="pickAddress()" color="primary" expand="block">
                    <ion-icon :src="checkmark" slot="start"/>Ок
                </ion-button>
            </div>
        </div>
    </ion-toolbar>
</template>

<script>
import { 
    modalController,
    IonContent,
    IonToolbar,
    IonButton,
    IonSearchbar,
    IonIcon,
    IonItem,
    IonInput,
    IonSegment,
    IonSegmentButton,
    IonImg,
    IonLabel,
}                           from "@ionic/vue";
import { 
    yandexMap,
    ymapMarker,
    loadYmap,
}
                            from "vue-yandex-maps";
import { 
    locationOutline,
    closeOutline,
    checkmark,
}
                            from 'ionicons/icons';
import User 
                            from '@/scripts/User.js'

export default({
    components: {
    IonContent,
    IonToolbar,
    IonButton,
    IonSearchbar,
    IonIcon,
    IonItem,
    IonInput,
    IonSegment,
    IonSegmentButton,
    IonImg,
    IonLabel,
    yandexMap,
    ymapMarker,
    },
    setup() {
        const closeModal = function(){
            modalController.dismiss();
        };
        return { closeModal, locationOutline,closeOutline,checkmark };
    },
    props: [
		"location_group_name_low",
        "locationGroupList"
    ],
    data(){
        let locSettings=this.$heap.state.settings.location;
        let mapCenter=JSON.parse(locSettings.mapCenter)

        return {
            settings: {
                apiKey: locSettings.ymapApiKey,
                lang: "ru_RU",
                coordorder: "latlong",
                version: "2.1",
            },
            suggestions:[],
            addressSearchQuery:null,
            markDeviceOnMap:true,
            locationGroup:this.locationGroupList?.[0]??null,
            locationGroups:this.locationGroupList??null,
            locSettings,
            selectedPlacemark:0,
            selectedAddress:'',
            selectedCoords:[],
            coords: mapCenter,
            addressComment:'',
            showed:1,
        };
    },
    computed:{
        locationType(){
            if(this.locationGroup){
                return this.locationGroup.group_name+" адрес"
            }
            return this.location_group_name_low??"адрес"
        },
        placemarkProperties(){
            return {
                iconCaption:this.locationType
            }
        }
    },
    methods:{
        async pickAddress(){
            try{
                if( this.suggestions[0]??0 ){
                    console.log(this.coords)
                    await this.suggestionSelect( this.suggestions[0].title.text, this.suggestions[0].uri )
                    console.log(this.coords)
                }
                if( !this.selectedAddress ){
                    const result=await window.ymaps.geocode(this.coords)
                    this.selectedAddress=result.geoObjects.get(0)?.getAddressLine();                    
                }
            } catch(err){
                console.log(err)
            }

            var location={
                location_group_id:this.locationGroup?.group_id??null,
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
            this.markDeviceOnMap=false
            this.suggestions=[]
            this.selectedAddress=null
            this.coords=e.get('coords')
        },
        async suggestionsGet(){
            this.markDeviceOnMap=false
            if( !this.addressSearchQuery ){
                this.suggestions=[]
                return
            }
            try{
                const sapikey=this.$heap.state.settings.location.ymapSuggestionApiKey
                const ll=this.coords.slice().reverse().join(',')
                const response= await fetch(`https://suggest-maps.yandex.ru/v1/suggest?apikey=${sapikey}&results=3&lang=ru_RU&ll=${ll}&spn=1,1&attrs=uri&types=house&results=5&text=${this.addressSearchQuery}`)
                const responseData=await response.json()
                this.suggestions=responseData.results||[]
            }catch{
                /** */
            }
        },
        async suggestionSelect( address, uri ){
            this.selectedAddress=address
            this.addressSearchQuery=address
            await this.geocode(uri)
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
        this.showed=0
        setTimeout(async ()=>{
            await loadYmap();
            this.showed=1
            document.querySelectorAll(".search input")[0].focus() 
            const lastStoredPosition=User.geo.lastStoredGet()
            if( lastStoredPosition?.location_latitude ){
                this.coords=[lastStoredPosition.location_latitude,lastStoredPosition.location_longitude]
            }
            /**
             * device location got with delay so dont use it if user started search
             */
            const geo=await User.geo.get()
            if(this.markDeviceOnMap && geo){
                const {coords}=geo
                this.coords=[coords.latitude,coords.longitude]
                this.$flash("На карте отмечено ваше местоположение")
            }
        },100)
    }
});
</script>