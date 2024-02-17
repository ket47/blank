import { CapacitorUpdater }     from '@capgo/capacitor-updater'
import { isPlatform }           from "@ionic/vue";
const Capgo={
    async init( App, flash ){
        CapacitorUpdater.notifyAppReady()
        
        if( !isPlatform('capacitor') ){
            return null
        }
        const latest=await this.latestGet()
        if( !latest ){
            return null
        }
        let update=await this.latestDownloadedGet(latest.version)
        if( !update ){
            flash("Доступно обновление "+latest.version);//console.log('CAPGO download started ',latest.url,latest.version )
            update = await CapacitorUpdater.download({url: latest.url,version: latest.version,})
            flash("Приложение обновится после перезапуска")
        }
        App.addListener('appStateChange', async (state) => {
            if ( !state.isActive && update ) {
                try{
                    await CapacitorUpdater.set(update)
                    update=null//console.log('CAPGO set Succeded')
                } catch(err){
                    console.log('CAPGO set Failed')
                }
            }
        })
    },
    /**
     * check for latest update bundle on server
     * @returns latest update bundle or null
     */
    async latestGet(){
        const now=Date.now()/1000
        const skipUntil=now+1*60*60//1h
        if( localStorage.appUpdateSkipUntil>now ){
            return null
        }
        localStorage.appUpdateSkipUntil= skipUntil
        try{
            const latest = await CapacitorUpdater.getLatest()
            if(latest.url??null){
                console.log('CAPGO getLatest',JSON.stringify(latest))
                return latest
            }
        } catch(err){
            console.log('CAPGO getLatest No UPDATE')
            return null
        }
        return null
    },
    /**
     * check for latest update bundle on disk
     * @returns latest update bundle or null
     */
    async latestDownloadedGet(version){
        let downloadedUpdates=await  CapacitorUpdater.list()
        if( downloadedUpdates?.bundles ){//console.log('CAPGO downloadedUpdates ',JSON.stringify(downloadedUpdates.bundles))
            for( let i in downloadedUpdates.bundles ){
                let update=downloadedUpdates.bundles[i]
                if(update.version==version && update.status!="error"){
                    return update
                }
            }
        }
        return null
    }
}
export default Capgo;