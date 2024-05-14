import jQuery from "jquery"
import heap from '@/heap';
const Metrics={
    async init(){
        await this.recordIncomingUser()
    },
    async recordIncomingUser(){
        if( sessionStorage.metric_come_data_set ){
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
            await jQuery.post(`${heap.state.hostname}Metric/itemCreate`,request)
            sessionStorage.metric_come_data_set=1
        }catch{/** */}
    },
};
export default Metrics;