<template>
  <base-layout page-title="Мой профиль">
    <ion-list>
      <ion-item>
        <ion-icon :icon="personOutline" slot="start" />
        <ion-input
          v-model="fields.user_name"
          name="user_name"
          type="text"
          @change="save('user_name', $event.target.value)"
          placeholder="как к вам обращаться?"
          label="Ваш псевдоним"
          label-placement="stacked"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-icon :icon="giftOutline" slot="start" />
        <ion-input
          v-model="fields.user_birthday"
          placeholder="День рождения"
          label="День рождения"
          label-placement="stacked"
          name="user_birthday"
          type="date"
          @change="save('user_birthday', $event.target.value)"
          :readonly="birthday_is_set"
        ></ion-input>
      </ion-item>
      <!-- <ion-item>
            <ion-icon :icon="personOutline" slot="start"/>
            <ion-input 
              v-model="fields.user_surname" 
              placeholder="Фамилия"
              label="Фамилия"
              label-placement="stacked"
              name="user_surname" 
              type="text" 
              @change="save('user_surname', $event.target.value)" 
            ></ion-input>
          </ion-item> -->
      <ion-item>
        <ion-icon :icon="callOutline" slot="start" />
        <ion-input
          readonly
          v-model="fields.user_phone"
          label="Телефон"
          label-placement="stacked"
        ></ion-input>
        <ion-button
          slot="end"
          v-if="
            fields.user_phone &&
            (!fields.user_phone_verified || fields.user_phone_verified === '0')
          "
          @click="phoneVerify"
          expand="block"
          >Подтвердить</ion-button
        >
        <ion-button
          slot="end"
          v-if="
            fields.user_phone &&
            fields.user_phone_verified &&
            fields.user_phone_verified !== '0'
          "
          expand="block"
          disabled="true"
          >Подтверждено</ion-button
        >
      </ion-item>

      <ion-item>
        <ion-icon :icon="atOutline" slot="start" />
        <ion-input
          v-model="fields.user_email"
          name="user_email"
          type="email"
          @change="save('user_email', $event.target.value)"
          placeholder="Электронная почта"
          label="Электронная почта"
          label-placement="stacked"
        ></ion-input>
      </ion-item>
      <ion-list-header>
        <ion-label>Аватар</ion-label>
      </ion-list-header>
      <ion-item lines="none">
        <ion-segment
          mode="ios"
          v-model="fields.user_avatar_name"
          @ionChange="save('user_avatar_name', $event.target.value)"
        >
          <ion-segment-button value="man">
            <ion-avatar
              ><img :src="$heap.state.hostname + 'img/avatar/man.png'"
            /></ion-avatar>
          </ion-segment-button>
          <ion-segment-button value="woman">
            <ion-avatar
              ><img :src="$heap.state.hostname + 'img/avatar/woman.png'"
            /></ion-avatar>
          </ion-segment-button>
        </ion-segment>
      </ion-item>
    </ion-list>
    <ion-item-divider>
      <ion-label>Пароль</ion-label>
    </ion-item-divider>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button @click="passwordReset()" expand="block"  color="medium" fill="outline"
          ><ion-icon :icon="keyOutline" slot="start" />Сбросить</ion-button
        >
      </ion-col>
      <ion-col>
        <ion-button @click="passwordPromptShow = true" expand="block"  color="medium" fill="outline">
          <ion-icon :icon="keyOutline" slot="start" />Изменить
        </ion-button>
      </ion-col>
    </ion-row>

    <ion-item-divider>
      <ion-label>Удаление профиля</ion-label>
    </ion-item-divider>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button
          @click="deletePromptShow = true"
          expand="block"
          fill="outline"
          color="danger"
          >
          <ion-icon :icon="trashOutline" slot="start" />
          Удалить профиль
        </ion-button>
      </ion-col>
      <ion-col> </ion-col>
    </ion-row>

    <ion-modal
      :isOpen="passwordPromptShow"
      :initial-breakpoint="0.8"
      :breakpoints="[0, 0.4, 0.8]"
    >
      <ion-header>
        <ion-toolbar>
          <ion-title>Новый пароль</ion-title>
          <ion-icon
            :icon="closeOutline"
            @click="passwordPromptShow = false"
            slot="end"
            size="large"
          ></ion-icon>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-input
            v-model="fields.user_pass_current"
            type="password"
            placeholder="нет пароля"
            label="Действующий пароль"
            label-placement="stacked"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            v-model="fields.user_pass"
            type="text"
            placeholder="пароль"
            label="Новый пароль"
            label-placement="stacked"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            v-model="fields.user_pass_confirm"
            type="text"
            placeholder="пароль (повтор)"
            label="Новый пароль (повтор)"
            label-placement="stacked"
          ></ion-input>
        </ion-item>
        <ion-button @click="passwordSave()" expand="block">Изменить</ion-button>
      </ion-content>
    </ion-modal>

    <ion-modal
      :isOpen="deletePromptShow"
      :initial-breakpoint="0.8"
      :breakpoints="[0, 0.4, 0.8]"
    >
      <ion-header>
        <ion-toolbar color="danger">
          <ion-title>Удаление учетной записи</ion-title>
          <ion-icon
            :icon="closeOutline"
            @click="deletePromptShow = false"
            slot="end"
            size="large"
          ></ion-icon>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item lines="none" style="margin-bottom: 15px">
          <div>
            <p>Ваши персональные данные будут безвозвратно удалены.</p>
            <p>
              Повторная регистрация по этому номеру телефона будет невозможна!
            </p>
          </div>
        </ion-item>
        <!-- <ion-item>
          <ion-input v-model="fields.user_pass_current" type="password" placeholder="пароль" label="Действующий пароль" label-placement="stacked"></ion-input>
        </ion-item> -->
        <ion-button @click="deleteAccount()" expand="block" color="danger"
          >Удалить аккаунт</ion-button
        >
        <ion-button
          @click="deletePromptShow = false"
          expand="block"
          color="light"
          >Закрыть</ion-button
        >
      </ion-content>
    </ion-modal>
  </base-layout>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonCol,
  IonRow,
  IonItemDivider,
  IonButton,
  IonModal,
  IonHeader,
  IonTitle,
  IonContent,
  IonIcon,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonAvatar,
  IonListHeader,
} from "@ionic/vue";
import {
  closeOutline,
  keyOutline,
  trashOutline,
  callOutline,
  personOutline,
  atOutline,
  giftOutline,
} from "ionicons/icons";
import jQuery from "jquery";
import User from "@/scripts/User";

export default {
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonCol,
    IonRow,
    IonItemDivider,
    IonButton,
    IonModal,
    IonHeader,
    IonTitle,
    IonContent,
    IonIcon,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonAvatar,
    IonListHeader,
  },
  setup() {
    return {
      closeOutline,
      keyOutline,
      trashOutline,
      callOutline,
      personOutline,
      atOutline,
      giftOutline,
    };
  },
  data() {
    return {
      config: {
        phoneMask: "+0(000)-000-00-00",
      },
      fields: this.$heap.state.user,
      passwordPromptShow: false,
      deletePromptShow: false,
      birthday_is_set: 0,
    };
  },
  computed: {
    isPhoneValid() {
      return this.fields.user_phone.replace(/\D/g, "").length == 11;
    },
  },
  methods: {
    async save(field_name, field_value) {
      if (field_name == "user_phone") {
        if (!this.isPhoneValid) {
          return false;
        }
        field_value = field_value.replace(/\D/g, "");
      }
      var requestData = {};
      requestData.user_id = this.$heap.state.user.user_id;
      requestData[field_name] = field_value;
      await this.itemUpdate(requestData);
      this.fields[field_name] = field_value;
    },
    async itemUpdate(requestData) {
      try {
        const resp = await jQuery.post(
          `${this.$heap.state.hostname}User/itemUpdate`,
          JSON.stringify(requestData)
        );
        if (resp == "ok") {
          this.$flash("Сохранено");
          return true;
        }
      } catch (err) {
        let exception_code = "unknown";
        try {
          const invalid_field = Object.keys(
            JSON.parse(err.responseJSON.messages.error)
          )[0];
          const invalid_reason = Object.values(
            JSON.parse(err.responseJSON.messages.error)
          )[0];
          exception_code = invalid_field + "_" + invalid_reason;
        } catch {
          /** */
        }
        switch (exception_code) {
          case "user_phone_notunique":
            this.$flash("Пользователь с таким телефоном уже зарегистрирован");
            break;
          case "user_phone_required":
          case "user_phone_invalid":
          case "user_phone_short":
            this.$flash("Проверьте номер телефона");
            break;
          case "user_name_required":
          case "user_name_short":
            this.$flash("Проверьте ваш псевдоним");
            break;
          case "user_email_invalid":
            this.$flash("Проверьте ваш е-маил");
            break;
          case "user_email_notunique":
            this.$flash("Такой е-маил уже используется");
            break;
          case "user_pass_short":
            this.$flash("Пароль слишком короткий");
            break;
          case "user_pass_wrong":
            this.$flash("Действующий пароль не верный");
            break;
          case "user_pass_notmatches":
            this.$flash("Пароль не совпадает с подтверждением");
            break;
        }
        return false;
      }
      User.get();
    },
    phoneVerify() {
      const user_phone = this.fields.user_phone.replace(/\D/g, "");
      try {
        jQuery.post(`${this.$heap.state.hostname}User/phoneVerificationSend`, {
          user_phone,
        });
        this.$go({ name: "UserVerifyPhone", params: { phone: user_phone } });
      } catch {
        /** */
      }
    },
    async passwordSave() {
      if (this.fields.user_pass != this.fields.user_pass_confirm) {
        this.$flash("Пароль и подтверждение не совпадают");
        return;
      }
      if (!this.fields.user_pass) {
        this.$flash("Пароль не заполнен");
        return;
      }
      const requestData = {
        user_id: this.$heap.state.user.user_id,
        user_pass: this.fields.user_pass,
        user_pass_current: this.fields.user_pass_current,
      };
      const updated = await this.itemUpdate(requestData);
      if (updated) {
        this.passwordPromptShow = false;
        this.$flash("Пароль изменен");
      }
    },
    async passwordReset() {
      if (!confirm("Выслать новый пароль на телефон и электронную почту?")) {
        return;
      }
      const request = {
        user_phone: this.fields.user_phone,
        user_email: this.fields.user_email,
        user_name: this.fields.user_name,
      };
      try {
        await jQuery.post(
          `${this.$heap.state.hostname}User/passwordReset`,
          request
        );
        this.$alert("Вам был выслан новый пароль", "Пароль сброшен");
      } catch {
        /** */
      }
    },
    async deleteAccount() {
      try {
        // if(!this.fields.user_pass_current){
        //   this.$flash("Действующий пароль обязателен")
        //   return
        // }
        const requestData = {
          user_id: this.$heap.state.user.user_id,
          //user_pass:this.fields.user_pass_current,
        };
        await jQuery.post(
          `${this.$heap.state.hostname}User/itemDelete`,
          requestData
        );
        this.deletePromptShow = false;
        await User.signOut();
        await this.$go("/user");
      } catch {
        this.$flash("Не удалось удалить аккаунт. Проверьте пароль");
      }
    },
    isPhoneValidate(ev) {
      this.fields.user_phone = ev.target.value;
      this.fields.user_phone = this.fields.user_phone.replace(/\D/g, "");
      if (this.fields.user_phone.length > 11) {
        this.fields.user_phone = this.fields.user_phone.substring(0, 11);
      }
      let result = "";
      let numberIndex = 0;
      for (let index in this.config.phoneMask) {
        if (!this.fields.user_phone[numberIndex]) {
          break;
        }
        let character = this.config.phoneMask[index];
        if (character == "0") {
          result += this.fields.user_phone[numberIndex];
          numberIndex++;
        } else {
          result += character;
        }
      }
      this.fields.user_phone = result;
      return this.fields.user_phone;
    },
  },
  created() {
    this.$topic.on("userGet", (user) => {
      this.fields = user;
      if (this.fields["user_birthday"]) {
        this.fields["user_birthday"] =
          this.fields["user_birthday"].split(" ")[0];
      }
      this.birthday_is_set = !!user.user_birthday;
    });
  },
};
</script>