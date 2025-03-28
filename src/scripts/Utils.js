import heap             from '@/heap';
import jquery           from 'jquery'
import { Storage }      from '@ionic/storage';
import { Preferences }  from '@capacitor/preferences';



const Utils={
    pref:{
        async set(key,value){
            navigator?.storage?.persist()
            await Preferences.set({key:key,value:value})
        },
        async get(key){
            const prefValue=await Preferences.get({key:key})
            return prefValue?.value || localStorage[key]
        },
        async remove(key){
            await Preferences.remove({key:key})
            localStorage.removeItem(key);
        }
    },
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
        for(const i in context){
            template=template.replace(`{{${i}}}`,context[i])
        }
        template=template.replace(/{{\.}}/,'-')
        return template
    },
    date:{
        today(){
            const today = new Date();
            today.setHours(-today.getTimezoneOffset()/60)
            return today
        },
        firstDay( monthOffset=0 ){
            const firstDay = this.today()
            firstDay.setDate(1)
            firstDay.setMonth(firstDay.getMonth()+monthOffset)
            return firstDay
        },
        toIso( date ){
            return date.toISOString().slice(0, 10)
        },
        isoToDmy( iso ){
            return iso.split('-').reverse().join('.')
        },
        humanize( unixTime, mode = 'both' ){
            const now = Math.floor(Date.now() / 1000);
            const diff = unixTime - now;
            if (mode === 'future' && diff <= 0) {
                return 'Почти на месте';
            } else if (mode === 'past' && diff > 0) {
                return 'Ожидание';
            }
            const date = new Date(unixTime * 1000);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            if (diff > 0) {
                const minutes = diff / 60;
                const hours = diff / 3600;
                const days = diff / 86400;

                if (days >= 1) {
                    return date.toLocaleString();
                } else if (hours >= 3) {
                    return `Через ${Math.floor(hours)} ч.`;
                } else if (hours >= 2.5) {
                    return 'Менее 3 часов';
                } else if (hours >= 2) {
                    return 'Менее 2,5 часов';
                } else if (hours >= 1.5) {
                    return 'Менее 2 часов';
                } else if (hours >= 1) {
                    return 'Менее 1,5 часов';
                } else if (minutes >= 30) {
                    return 'Менее часа';
                } else if (minutes >= 10) {
                    return 'Менее 30 минут';
                } else {
                    return 'Менее 10 минут';
                }
            } else {
                const pastDiff = Math.abs(diff);
                const pastMinutes = pastDiff / 60;
                const pastHours = pastDiff / 3600;
                const pastDays = pastDiff / 86400;
                if (pastDays >= 1) {
                    if (pastDays < 2) {
                        return `Вчера, в ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                    } else {
                        return `${day}.${month}.${year}`;
                    }
                } else if (pastHours >= 1) {
                    return `${Math.floor(pastHours)} час${Math.floor(pastHours) === 1 ? '' : 'а'} назад`;
                } else if (pastMinutes >= 1) {
                    return `${Math.floor(pastMinutes)} минут${Math.floor(pastMinutes) === 1 ? 'у' : 'ы'} назад`;
                } else {
                    return 'Меньше минуты назад';
                }
            }
        }
    },
    //////////////////////////////////////////////////////
    //CACHE STORAGE SECTION
    //////////////////////////////////////////////////////
    storage:null,
    async storageCreate(){
        if(!Utils.storage){
            this.storage = new Storage()
            await this.storage.create()
        }
        return this.storage
    },
    stringToHash(string) {
        let hash = 0;
        if (string.length == 0) return hash;
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    },
    requestIdGet( url, request ){
        return url+'~'+Utils.stringToHash(JSON.stringify(request))
    },
    debounceDictionary:{},
    debounceControl(requestId,debounce=2000){//rejects subsequent requests if interval is smaller than debounce
        const now=Date.now()
        this.debounceCheck(requestId,debounce)
        this.debounceDictionary[requestId]=now
    },
    debounceCheck(requestId,debounce=2000){
        const now=Date.now()
        if( this.debounceDictionary[requestId] && (this.debounceDictionary[requestId]+debounce)>now ){
            throw new Error('Too many requests')
        }
    },
    /**
     * Makes post request and caches response
     * @param {*} url 
     * @param {*} request 
     * @returns 
     */
    async post( url, request, debounce=2000 ){
        const requestId=Utils.requestIdGet(url,request)
        this.debounceControl(requestId,debounce)
        const response=await jquery.post(url,request)
        const responseStamp=Date.now()
        const cache={response,responseStamp}
        await this.storageCreate()
        await this.storage.set(requestId, cache)
        return response
    },
    /**
     * Looks for cached requests in storage. Cache max uses 2 times
     * @param {*} url of request to look for cache
     * @param {*} request to calculate hash
     * @returns cache
     */
    async prePost( url, request, debounce=2000 ){
        const requestId=Utils.requestIdGet(url,request)
        this.debounceCheck(requestId,debounce)
        await this.storageCreate()
        const cache=await this.storage.get(requestId)
        if( !cache ){
            return null
        }
        // if(cache?.is_used){
        //     await this.storage.remove(requestId)//some time stuck on old cache
        // } else {
        //     cache.is_used=true
        //     await this.storage.set(requestId, cache)
        // }
        if( Math.random()<0.01 ){//1% chance to get here
            setTimeout(()=>this.clearPost(),5000)
        }
        return cache?.response
    },
    /**
     * Clears stalled cache records
     * @returns promise
     */
    async clearPost(){
        const storedLastClearance=await this.storage.get('lastClearance')
        const lastClearance=storedLastClearance||0
        const cacheLifetime=24*60*60*1000*14//14 days
        const now=Date.now()
        if( now-lastClearance<cacheLifetime ){
            return
        }
        this.storage.forEach((value, key, index) => {
            if( value && value.responseStamp && now-value.responseStamp>cacheLifetime ){
                this.storage.remove(key)
            }
        })
        await this.storage.set('lastClearance',now)
    }
  };
  export default Utils;