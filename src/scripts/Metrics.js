import jQuery from "jquery"
import heap from '@/heap';
import Topic from '@/scripts/Topic';
const Metrics={
    async init(){
        await this.recordIncomingUser()
    },
    async recordIncomingUser(){
        const metric_id=await Utils.pref.get('metric_id')
        if(metric_id){
            return
        }
        const url = new URL(location.href);
        const come_media_id = url.searchParams.get("m");
        const come_inviter_id = url.searchParams.get("inviter_user_id")||localStorage.inviter_user_id;
        const come_referrer=document.referrer;
        const request={
            come_media_id,
            come_inviter_id,
            come_referrer,
            come_url:url.href
        }
        try{
            const new_metric_id= await jQuery.post(`${heap.state.hostname}Metric/itemCreate`,request)
            await Utils.pref.set('metric_id',new_metric_id)
        }catch{/** */}
    },
};
export default Metrics;