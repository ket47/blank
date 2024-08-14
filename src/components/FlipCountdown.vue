<template>
  <div class="flip-countdown">
    <div v-show="values.days !== false" style="margin-right: 10px;">
      <div ref="days" class="tick days"><div data-repeat="true" aria-hidden="true"><span data-view="flip"></span></div></div>
      <div class="delimiter">дн.</div>
    </div>
    <div v-show="values.hours !== false">
      <div ref="hours" class="tick hours"><div data-repeat="true" aria-hidden="true"><span data-view="flip"></span></div></div>
      <div class="delimiter">:</div>
    </div>
    <div v-show="values.minutes !== false">
      <div ref="minutes" class="tick minutes"><div data-repeat="true" aria-hidden="true"><span data-view="flip"></span></div></div>
      <div class="delimiter">:</div>
    </div>
    <div v-show="values.minutes !== false">
      <div ref="seconds" class="tick seconds"><div data-repeat="true" aria-hidden="true"><span data-view="flip"></span></div></div>
    </div>
  </div>
</template>

<script>
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";

export default {
  name: "FlipCountdown",
  props: ["deadline"],
  data(){
    return {
      second: 1000,
      minute: 0,
      hour: 0,
      day: 0,
      values: {
        days: false,
        hours: false,
        minutes: false,
        seconds: false
      },
      timer: null
    }
  },
  methods: {
    showRemaining() {
        var now = new Date();
        var end = new Date(this.deadline)
        var distance = end - now;
        if (distance < 0) {
            clearInterval(this.timer);
            this.values.days = false
            this.values.hours = false
            this.values.minutes = false
            this.values.seconds = false
            return;
        } 
        this.values.days = Math.abs(Math.floor(distance / this.day));
        this.values.hours = this.zeroPad(Math.floor((distance % this.day) / this.hour));
        this.values.minutes = this.zeroPad(Math.floor((distance % this.hour) / this.minute));
        this.values.seconds = this.zeroPad(Math.floor((distance % this.minute) / this.second));
        this._tick.days.value = this.values.days
        this._tick.hours.value = this.values.hours
        this._tick.minutes.value = this.values.minutes
        this._tick.seconds.value = this.values.seconds
    },
    createFlip(value, target){
      this._tick[target] = Tick.DOM.create(this.$refs[target], {
        value: value
      });
    },
    zeroPad(num){
      return ('0'+num).slice(-2);
    }
  },
  watch: {
    'deadline'(val, oldVal) { 
        clearInterval(this.timer);
        this.timer = setInterval(this.showRemaining, 1000);
    },
  },
  mounted() {
    this.minute = this.second * 60
    this.hour = this.minute * 60
    this.day =-this.hour * 24
    this._tick = {}
    this.createFlip(0, 'days')
    this.createFlip(0, 'hours')
    this.createFlip(0, 'minutes')
    this.createFlip(0, 'seconds')
    document.querySelectorAll('a.tick-credits').forEach((e)=> {e.remove()})
    this.timer = setInterval(this.showRemaining, 1000);
  },
  unmounted() {
    Tick.DOM.destroy(this.$refs.days);
    Tick.DOM.destroy(this.$refs.hours);
    Tick.DOM.destroy(this.$refs.minutes);
    Tick.DOM.destroy(this.$refs.seconds);
  },
  deactivated() {
    console.log('leave')
    clearInterval(this.timer);
    Tick.DOM.destroy(this.$refs.days);
    Tick.DOM.destroy(this.$refs.hours);
    Tick.DOM.destroy(this.$refs.minutes);
    Tick.DOM.destroy(this.$refs.seconds);

  }
};
</script>
<style>
.flip-countdown, 
.flip-countdown > div{
  display: flex;
  align-items: center;
}
.flip-countdown .delimiter{
  margin: 0 5px;
}

.flip-countdown .tick {
  font-size: 2.5em;
  font-size: 18px;
}
.flip-countdown .tick .tick-credits{
  display: none;
}
.flip-countdown .tick-flip-panel {
  color: white;
  background-color: #e80f08;
}
.flip-countdown .tick-flip-panel-back::after {
  z-index: 1;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(180deg,rgba(0, 0, 0, 0.199) 1px,rgba(0, 0, 0, 0.082) 0,transparent 30%);
}
</style>
