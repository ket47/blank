
<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 90px; /* space for input */
  background: var(--ion-color-light);
}

.message-bubble {
  max-width: 78%;
  display: flex;
  flex-direction: column;
  margin: 2px 12px;
}

.mine {
  align-self: flex-end;
}

.theirs {
  align-self: flex-start;
}

.bubble-content {
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
  font-size: 0.98rem;
  line-height: 1.4;
}

.mine .bubble-content {
  background: var(--ion-color-primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.theirs .bubble-content {
  background: var(--ion-color-light-tint);
  color: var(--ion-notice_text-color);
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.68rem;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
  text-align: right;
}

.date-separator {
  text-align: center;
  margin: 20px 0;
  color: var(--ion-color-medium);
  font-size: 0.8rem;
}

.date-separator span {
  background: var(--ion-background-color);
  padding: 6px 14px;
  border-radius: 20px;
}

/* Input area */
.message-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(var(--ion-background-color-rgb), 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 10px 12px 16px;
  z-index: 10;
}

.input-wrapper {
  --background: rgba(255,255,255, 0.65);
  --border-radius: 26px;
  overflow: hidden;
}

ion-notice_textarea {
  --padding-top: 10px;
  --padding-bottom: 10px;
  font-size: 1rem;
}
</style>

<template>
  <base-layout :page-title="room?.notice_holder_name ?? 'Сообщения'" hideBottomSpacer="1">
    <div class="chat-wrapper">
      <div class="messages-container" ref="messagesContainer">
        <div v-for="msg in messages_computed" :key="msg.notice_id" :class="['message-bubble', msg.is_owner==undefined?'':(msg.is_owner==1 ? 'mine' : 'theirs')]">

            <div v-if="msg.type=='text'" class="bubble-content">
              <div>
                <p v-if="msg.is_owner==0">vasya</p>
                <p class="message-notice_text">{{ msg.notice_text }}</p>
                <span class="message-time">{{ msg.time }}</span>
              </div>
            </div>


            <div v-else-if="msg.type=='separator'" class="date-separator">
              <span>{{ msg.notice_text }}</span>
            </div>

        </div>
        <div ref="bottomAnchor"></div>
      </div>

      <!-- Message input (fixed at bottom) -->
      <div class="message-input-container">
        <ion-item lines="none" class="input-wrapper">
          <ion-textarea
            v-model="newMessage"
            placeholder="Сообщение"
            auto-grow
            rows="1"
            @keydown.enter.prevent="sendMessage"
            style="--padding-top:15px"
          ></ion-textarea>

          <ion-buttons slot="end">
            <ion-button
              fill="clear"
              color="primary"
              :disabled="!newMessage.trim()"
              @click="sendMessage"
            >
              <ion-icon :icon="sendIcon" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </div>
    </div>
  </base-layout>
</template>

<script>
import { send } from "ionicons/icons";

import { 
  IonItem, 
  IonTextarea, 
  IonButtons, 
  IonButton, 
  IonIcon 
} from '@ionic/vue'

export default {
  name: "ChatMessages",

  props: {
    // You can later pass chatId, contact info, etc.
  },
    components: {
    IonItem,
    IonTextarea,
    IonButtons,
    IonButton,
    IonIcon
    },
  data() {
    return {
      messages: null,
      newMessage: "",
      sendIcon: send,


      notice_holder_id:this.$route.params.id,
      last_notice_id:0
    };
  },

  mounted() {
    this.scrollToBottom(false)
    this.chatListGet()
    // clearInterval(localStorage.chatautoreload)
    // localStorage.chatautoreload=setInterval(()=>this.chatListGet(),10000)
  },

  computed:{
    messages_computed(){
      let current_time_section
      const messages=[]
      for(let i in this.messages){
        const msg=this.messages[i]
        const date=new Date(msg.updated_at)
        const relative=this.miniRelativeDate(msg.updated_at)


        if( current_time_section!=relative ){
          current_time_section=relative
          messages.push({notice_text:current_time_section,type:'separator'})
        }
        msg.time=date.toLocaleTimeString([], {hour: "2-digit",minute: "2-digit",})
        msg.type='text'
        messages.push(msg)
      }
      return messages
    }
  },

  methods: {
    scrollToBottom(smooth = true) {
      this.$nextTick(() => {
        if (this.$refs.bottomAnchor) {
          this.$refs.bottomAnchor.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block: "end",
          });
        }
      });
    },
    miniRelativeDate(isoOrDate) {
      const d = new Date(isoOrDate);
      if (isNaN(d)) return "...";

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const inputDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

      const diffDays = Math.floor((today - inputDay) / 86400000);

      if (diffDays === 0) return "сегодня";
      if (diffDays === 1) return "вчера";
      if (diffDays <= 7)  return "на этой неделе";
      if (diffDays <= 14) return "на прошлой неделе";
      return diffDays + " дней назад";
    },

    sendMessage() {
      const notice_text=this.newMessage.trim()
      if (!notice_text) return;

      this.messages.push({
        id: this.messages.length + 1,
        notice_text: notice_text,
        is_owner: true,
        updated_at: new Date(),
      });

      this.newMessage = "";

      // Small delay to let DOM update
      setTimeout(() => this.scrollToBottom(true), 80);


      this.chatItemCreate(notice_text)
    },


    async itemGet() {
      try {
        const request = {
          notice_holder_id: this.notice_holder_id,
        };
        this.room = await this.$post(`${this.$heap.state.hostname}Talk/roomItemGet`,request)
      } catch {
        /** */
      }
    },
    async chatListGet() {
      try {
        const request = {
          notice_holder_id: this.notice_holder_id,
          last_notice_id: this.last_notice_id,
        };
        this.messages = await this.$post(`${this.$heap.state.hostname}Talk/chatListGet`,request);
      } catch {
        /** */
      }
    },
    async chatItemCreate(notice_text){
      try {
        const request = {
          notice_holder_id: this.notice_holder_id,
          notice_text: notice_text,
        };
        await this.$post(`${this.$heap.state.hostname}Talk/chatItemCreate`,request);
      } catch {
        /** */
      }
    }
  },

  watch: {
    messages: {
      handler() {
        // Auto-scroll only when new messages arrive
        this.scrollToBottom(true);
      },
      deep: true,
    },
  },
};
</script>
