import store from '../store';
const Utils={
    deliveryCalculate(Store){
        if( !Store.locations || !Store.locations[0] || !Store.locations[0].distance){
            return null;
        }
        const distance=Store.locations[0].distance;
        const preparation=Store.store_time_preparation||0;
        const delta=store.state.deliverySettings.deliveryTimeDelta;
        const time=Math.round(distance/store.state.deliverySettings.courierVelocity*60/5)*5+parseInt(preparation);
        const timeMin=time>delta?time-delta:time;
        const timeMax=timeMin+delta;
        return {time,timeMin,timeMax};
    }
  };
  export default Utils;