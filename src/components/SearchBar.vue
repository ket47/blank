<style scoped>
.search-popover ion-backdrop{
    display: none;
}
</style>
<template>
    <div>
    <ion-card style="position: relative; z-index: 11; border-radius: 10px">
        <ion-item lines="full">
            <ion-button  v-if="query.trim() != ''" @click.prevent="clearInput()" fill="clear" slot="start" style="margin-inline-end: 12px;">
                <ion-icon :icon="arrowBackOutline" aria-hidden="true"/>
            </ion-button> 
            <ion-button v-else fill="clear" slot="start" style="margin-inline-end: 12px;">
                <ion-icon :icon="searchOutline" aria-hidden="true"/>
            </ion-button> 
            <ion-input class="search-container" ref="searchbar" :value="query"  :debounce="this.debounce" @ionInput="suggestionListGet($event)" @ionFocus="suggestionListGet($event)" @keyup.enter="search(query)" placeholder="Поиск">
             </ion-input>
        </ion-item>
        <ion-list lines="none" v-if="isActiveSearch && suggestions?.length > 0">
            <ion-item v-for="item in suggestions"  :key="item.suggestion" button detail="true" @click="search(item.suggestion)">
                <ion-label>{{ item.suggestion }}</ion-label>
            </ion-item>
        </ion-list>
    </ion-card>
    <div style="position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: 10" v-show="isActiveSearch" @click="isActiveSearch = false"></div>
    </div>
</template>
<script>
import {
  arrowBackOutline,
  searchOutline
}                       from 'ionicons/icons'
import {
  IonLabel,
  IonCard,
  IonList,
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
        IonItem,
        IonButton,
        IonIcon,
        IonInput
    },
    setup(){
        return {
            arrowBackOutline,
            searchOutline
        }
    },
    data(){
        return {
            query: '',
            suggestions: [],
            result: '',
            isActiveSearch: false
        }
    },
    methods:{
        async suggestionListGet(event){
            if(event){
                this.query = event.target.value || ''
            } else {
                this.query = ""
            }
            this.isActiveSearch = true
            const request={
                query: this.query
            }
            if(request.query == ""){
                this.suggestions = []
                return true;
            }
            try{
                let response=await jQuery.post(`${this.$heap.state.hostname}Search/suggestionListGet`,request, 0)
                this.suggestions = response.suggestions		
                if(this.suggestions.length == 0) this.suggestions.push({suggestion: this.query})
            }catch(err){
                console.log(err)
                this.suggestions=[]
            }
        },
        search(suggestion){
            this.query = suggestion.trim()
            this.isActiveSearch = false
            this.$emit('onSearch', this.query)
        },
        clearInput(){
            this.query = ""
            this.isActiveSearch = false
            this.$emit('onSearch', this.query)
            
        }
    },
    watch:{
        'value'(){
            this.query = this.value
        },
        'isActiveSearch'(){
            if(!this.activeSearch) this.suggestions = []
            console.log('focus:'+this.isActiveSearch)
            this.$emit('onFocusChange', this.isActiveSearch)
            if(this.query == ''){
                this.$emit('onSearch', this.query)
            }
        },
    }
}
</script>