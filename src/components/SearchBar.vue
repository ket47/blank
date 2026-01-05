<style scoped>
.search-popover ion-backdrop{
    display: none;
}
</style>
<template>
    <div>
    <ion-card style="position: relative; z-index: 11; border-radius: 10px">
        <ion-item lines="none">
            <ion-button  v-if="query.trim() != ''" @click.prevent="clearInput()" fill="clear" slot="start" style="margin-inline-end: 12px;">
                <ion-icon :icon="arrowBackOutline" aria-hidden="true"/>
            </ion-button> 
            <ion-button v-else fill="clear" slot="start" style="margin-inline-end: 12px;">
                <ion-icon :icon="searchOutline" aria-hidden="true"/>
            </ion-button> 
            <ion-input class="search-container" ref="searchbar" enterkeyhint="search" v-model="query"  :debounce="this.debounce" @ionInput="suggestionListGet($event)" @ionFocus="suggestionListGet($event)" @keyup.enter="search(query)" placeholder="Поиск">
             </ion-input>
        </ion-item>
        <div v-if="isActiveSearch">
            <ion-list lines="none" v-if="suggestions?.length > 0">
                <div v-for="item in suggestions"  :key="item.suggestion" @click="search(item.suggestion)">
                    <ion-item v-if="item.is_query==1" button detail="false">
                        <ion-label color="primary">{{ item.suggestion }}</ion-label>
                    </ion-item>
                    <ion-item v-else button detail="false">
                        <ion-icon slot="start" :src="searchOutline"></ion-icon>
                        <ion-label><b>{{ item.suggestion }}</b></ion-label>
                    </ion-item>
                </div>
            </ion-list>
            <ion-list lines="none" v-if="history?.length > 0">
                <ion-list-header>
                    Вы уже искали
                </ion-list-header>
                <div v-for="item in history"  :key="item.suggestion" @click="search(item.suggestion)">
                    <ion-item button>
                        <ion-icon slot="start" :src="timeOutline"></ion-icon>
                        <ion-label>{{ item.suggestion }}</ion-label>
                    </ion-item>
                </div>
            </ion-list>
        </div>
    </ion-card>
    <div style="position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: 10" v-show="isActiveSearch" @click="isActiveSearch = false"></div>
    </div>
</template>
<script>
import {
  arrowBackOutline,
  searchOutline,
  timeOutline,
}                       from 'ionicons/icons'
import {
  IonLabel,
  IonCard,
  IonList,
  IonListHeader,
  IonItem,
  IonButton,
  IonIcon,
  IonInput
}                           from '@ionic/vue'
import jQuery           from 'jquery'



export default {
    props: ['value', 'debounce'],
    components:{
        IonLabel,
        IonCard,
        IonList,
        IonListHeader,
        IonItem,
        IonButton,
        IonIcon,
        IonInput
    },
    setup(){
        return {
            arrowBackOutline,
            searchOutline,
            timeOutline,
        }
    },
    data(){
        return {
            query: '',
            suggestions: [],
            history:null,
            result: '',
            isActiveSearch: false
        }
    },
    methods:{
        async suggestionListGet(event){
            let query = event.target.value ?? ''
            this.isActiveSearch = true
            this.historyRestore()
            if( !String(query).trim().length ){
                this.suggestions = []
                return
            }
            const request={
                query,
                location_id:this.locMainGet()
            }
            try{
                let response=await jQuery.post(`${this.$heap.state.hostname}Search/suggestionListGet`,request, 0)
                this.suggestions = response.suggestions
                this.suggestions.unshift({suggestion: query, is_query:1})
            }catch(err){
                console.log(err)
                this.suggestions=[]
            }
        },
        historyRestore(){
            if(!localStorage.searchHistory){
                this.history=null
                return
            }
            try{
                this.history=JSON.parse(localStorage.searchHistory)
            } catch{/** */}
        },
        historyPush( query ){
            try{
                if( !String(query).trim().length ){
                    return
                }
                let history=JSON.parse(localStorage.searchHistory||'[]').slice(0,2)
                for( let h of history){
                    if(h.suggestion==query){
                        return
                    }
                }
                history.unshift({suggestion:query})
                localStorage.searchHistory=JSON.stringify(history)
            } catch{/** */}
        },
        search(suggestion){
            this.query = suggestion.trim()
            this.isActiveSearch = false
            this.$emit('onSearch', this.query)
            this.historyPush(this.query)
        },
        clearInput(){
            this.query = ""
            this.isActiveSearch = false
            this.$emit('onSearch', this.query)
            
        },
        locMainGet(){
            return this.$heap.state.user.location_main?this.$heap.state.user.location_main.location_id:null
        }
    },
    watch:{
        'value'(){
            this.query = this.value
        },
        'isActiveSearch'(){
            if(!this.activeSearch) {
                this.suggestions = []
            }
            this.$emit('onFocusChange', this.isActiveSearch)
            if(this.query == ''){
                this.$emit('onSearch', this.query)
            }
        },
    }
}
</script>