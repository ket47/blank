import Topic                    from '@/scripts/Topic';
import heap                     from '@/heap';

const SSE = {
    init(){

    },
    listenServerSideEvents( target_user_id ){
        last_event_id=0
        const evtSource = new EventSource(`${heap.state.hostname}/Talk/eventSource?target_user_id=${target_user_id}&last_event_id=${last_event_id}`);
        evtSource.addEventListener("chat", function(e) {
            const data = JSON.parse(e.data);
            Topic.publish('chatEvent',data)
        });

        evtSource.onerror = function() {
            console.log("SSE connection error");
        };


        const eventList = document.querySelector("ul");

        evtSource.onmessage = (e) => {
            console.log("SSE onmessage"+e.data);
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);
        };
    }
}
SSE.init();
export default SSE;