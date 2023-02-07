import jQuery from "jquery"
import heap from '@/heap';
const Metrics={
    async recordIncomingUser(){
        const deviceMetricId=localStorage.metric_id
        if(deviceMetricId){
            return
        }
        const url = new URL(location.href);
        const come_media_id = url.searchParams.get("m");
        const come_inviter_id = url.searchParams.get("inviter_user_id");
        const come_referrer=document.referrer;
        const request={
            come_media_id,
            come_inviter_id,
            come_referrer,
            come_url:url.href
        }
        try{
            localStorage.metric_id= await jQuery.post(`${heap.state.hostname}Metric/itemCreate`,request)
        }catch{/** */}
      }
};
export default Metrics;