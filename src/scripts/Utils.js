import heap from '@/heap';
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
    }
  };
  export default Utils;