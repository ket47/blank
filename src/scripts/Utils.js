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

        return response
    },
    async prePost( url, request ){
        const requestId=Utils.requestIdGet(url,request)
        await this.storageCreate()
        const cache=await this.storage.get(requestId)
        return cache?.response||null
    },





















    // async fetch(url,request={},options={}){
    //     if(window.caches){
	// 		if( typeof request === 'string' ){
	// 			options.body=request
	// 		} else if( options.is_json??null ){
	// 			options.body=JSON.stringify(request)
	// 		} else {
	// 			options.body=new URLSearchParams(request)
	// 		}            
	// 		return Utils.fetchAndCache(url,options)
    //     }
    //     return await jquery.post(url,request)
    // },
    // async preFetch(url){
    //     if(window.caches){
	// 		const cacheStorage = await caches.open(Utils.cacheName);
    //         const cachedResponse= await cacheStorage.match(url)
    //         return cachedResponse||null
    //     }
    //     return null
    // },
    // cacheName:`appcache`,
    // async fetchAndCache(url,options){
    //     options.method= 'POST'
    //     options.headers= {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Access-Control-Allow-Origin':'*'
    //     }
    //     options.mode='cors'
    //     try{
    //         const cacheStorage = await caches.open(Utils.cacheName);
    //         return await cacheStorage.add(url,options)
    //     } catch(err){
    //         console.log("fetchAndCache: no internet connection",err)
    //     }
    //     return null


    //     // try{
    //     //     const response=await fetch(url,options)
    //     // } catch(err){
    //     //     console.log("fetchAndCache: no internet connection",err)
    //     // }
        

    //     // const requestId=url+Utils.stringToHash(JSON.stringify(options))
    //     // const cacheStorage = await caches.open(requestId);
    //     // cacheStorage.put(url, response);



    //     // const cacheName = 55;

    // }
  };
  export default Utils;