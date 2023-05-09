import heap     from '@/heap';
import jquery   from 'jquery'
import { Storage } from '@ionic/storage';



const Utils={
    deliveryCalculate(Store){
        if( !Store.locations || !Store.locations[0] || !Store.locations[0].distance){
            return null;
        }
        const distance=Store.locations[0].distance;
        const preparation=Store.store_time_preparation||0;
        return Utils.deliveryTimeCalculate(distance,preparation);
    },
    deliveryTimeCalculate(distance,preparation){
        if(!heap.getters.settings.delivery){
            return {time:0,timeMin:0,timeMax:0}
        }
        preparation=parseInt(preparation??heap.getters.settings.delivery.timePreparationDefault)
        const delta=parseInt(heap.getters.settings.delivery.timeDelta)
        const speed=parseInt(heap.getters.settings.delivery.speed)
        const time=Math.round(distance/speed*60/5)*5+preparation
        const timeMin=time>delta?time-delta:time
        const timeMax=timeMin+delta
        return {time,timeMin,timeMax}
    },
    render(template,context){
        for(let i in context){
            template=template.replace(`{{${i}}}`,context[i])
        }
        template=template.replace(/{{\.}}/,'-')
        return template
    },
    //////////////////////////////////////////////////////
    //CACHE STORAGE SECTION
    //////////////////////////////////////////////////////
    storage:null,
    async storageCreate(){
        if(Utils.storage){
            return this.storage;
        }
        this.storage = new Storage()
        await this.storage.create()
        return this.storage
    },
    stringToHash(string) {
        let hash = 0;
        if (string.length == 0) return hash;
        for (let i = 0; i < string.length; i++) {
            let char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    },
    requestIdGet( url, request ){
        return url+'~'+Utils.stringToHash(JSON.stringify(request))
    },
    debounceDictionary:{},
    debounceControl(requestId,debounce=3000){//rejects subsequent requests if interval is smaller than debounce
        const now=Date.now()
        if( this.debounceDictionary[requestId] && this.debounceDictionary[requestId]+debounce>now ){
            throw new Error('Too many requests')
        }
        this.debounceDictionary[requestId]=now
    },
    async post( url, request, options={} ){
        const requestId=Utils.requestIdGet(url,request)
        this.debounceControl(requestId)
        const response=await jquery.post(url,request)
        const responseStamp=Date.now()
        const cache={response,responseStamp}
        await this.storageCreate()
        await this.storage.set(requestId, cache)

        if( Math.random()<0.01 ){//1% chance to get here
            setTimeout(()=>this.clearPost(),5000)
        }
        return response
    },
    async prePost( url, request ){
        const requestId=Utils.requestIdGet(url,request)
        await this.storageCreate()
        const cache=await this.storage.get(requestId)
        await this.storage.remove(requestId)//some time stuck on old cache
        return cache?.response||null
    },
    async clearPost(){
        const storedLastClearance=await this.storage.get('lastClearance')
        const lastClearance=storedLastClearance||0
        const cacheLifetime=24*60*60*1000*14//14 days
        const now=Date.now()
        if( now-lastClearance<cacheLifetime ){
            return
        }
        let i=0
        this.storage.forEach((value, key, index) => {
            if( value && value.responseStamp && now-value.responseStamp>cacheLifetime ){
                this.storage.remove(key)
            }
        })
        await this.storage.set('lastClearance',now)
    }
  };
  export default Utils;