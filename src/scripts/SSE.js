import Topic                    from '@/scripts/Topic';
import heap                     from '@/heap';

const SSE = {
    init(){
        this.listenServerSideEvents( 0 )
    },
    listenServerSideEvents( target_user_id ){
        const last_event_id=0
        heap.sse= new EventSource(`${heap.state.hostname}/Talk/eventSource?target_user_id=${target_user_id}&last_event_id=${last_event_id}`);
        heap.sse.addEventListener("chat", function(e) {
            const data = JSON.parse(e.data);
            Topic.publish('chatEvent',data)
        });

        heap.sse.onerror = function() {
            console.log("SSE connection error");
        };


        const eventList = document.querySelector("ul");

        heap.sse.onmessage = (e) => {
            console.log("SSE onmessage"+e.data);
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);
        };
    }
}
SSE.init();
export default SSE;