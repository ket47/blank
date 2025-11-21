<style scoped>
  .schedule ion-item ion-label{
    width:130px
  }
  .disabled{
    background-color: var(--ion-color-light);
  }
  .deleted{
    background-color: var(--ion-color-danger-tint);
  }
  .notworking{
    background-color: var(--ion-color-light-shade);
  }
  .primary{
    background-color: var(--ion-color-primary-shade);
  }
  .active{
    background-color: var(--ion-color-success-shade);
  }
  ion-text{
    padding:20px 0px 20px 0px;
    font-style: italic;
  }
</style>

<template>
  <base-layout :page-title="this.storeItem?.store_name??'Мой магазин'"  :pageDefaultBackLink="`/catalog/store-${storeId}`">
  <div  v-if="storeItem">
    <ion-card :color="validity_perc<validity_min?'danger':''">
      <ion-card-header>
        <ion-label>Анкета заполнена на {{validity_perc}}%</ion-label>
        <ion-progress-bar :value="validity"></ion-progress-bar>
      </ion-card-header>
      <ion-card-content v-if="validity_perc<validity_min">
        <ion-text>
          Вам необходимо заполнить анкету не меньше чем на {{validity_min}}% для рассмотрения модератором
        </ion-text>
      </ion-card-content>
    </ion-card>
    <ion-card v-if="message&&validity_perc>validity_min">
      <ion-card-content :class="messageClass">
        <p class="ion-padding-bottom">
          {{message}}
        </p>
        <div v-if="storeItem.is_disabled==1">
          <b>Для запуска нового предприятия:</b>
          <ul>
            <li>➕ Заполните информацию о предприятии и товарах.</li>
            <li>✔️ Подпишите анкету о присоединении к договору в офисе {{$heap.state.settings?.app_title}}.</li>
            <li>🤩 Готово! Привлекайте новых и создавайте лояльную базу клиентов для стабильного количества заказов.</li>
          </ul>  
        </div>
      </ion-card-content>
    </ion-card>


    <ion-list v-if="storeItem">
      <ion-item>
        <ion-icon :src="checkmarkCircleOutline" color="primary" slot="start"/>
        Готово к заказам
        <ion-toggle slot="end" v-model="is_working" @ionChange="save('is_working',$event.target.checked?1:0)"></ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="trashOutline" color="primary" slot="start"/>
        Удалено
        <ion-toggle slot="end" v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)"></ion-toggle>
      </ion-item>
      <!-- <ion-item>
        <ion-icon :src="flagOutline" color="primary" slot="start"/>
        <ion-toggle slot="end" v-model="is_primary" @ionChange="save('is_primary',$event.target.checked?1:0)">Опорное</ion-toggle>
      </ion-item> -->
      <ion-item>
        <ion-icon :src="ribbonOutline" color="primary" slot="start"/>
        На модерации
        <ion-toggle slot="end" v-model="is_disabled" @ionChange="itemDisable($event.target.checked?1:0)"></ion-toggle>
      </ion-item>


      <ion-item-divider></ion-item-divider>
      <ion-item>
        <ion-icon :src="chevronBack" slot="start" color="medium"/>
        <router-link :to="`/catalog/store-${storeId}`">Показать {{storeItem.store_name}}</router-link>
        <ion-label slot="end">
          <a :href="` ${$heap.state.hostname}Store/qrGet?store_id=${storeId}&type=store`" target="_blank">
            <ion-icon :src="qrCode" color="primary"></ion-icon>
          </a>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-icon :src="chevronBack" slot="start" color="medium"/>
        <router-link :to="`/catalog/store-${storeId}/menu`">Электронное меню</router-link>
        <ion-label slot="end">
          <a :href="` ${$heap.state.hostname}Store/qrGet?store_id=${storeId}&type=menu`" target="_blank">
            <ion-icon :src="qrCode" color="primary"></ion-icon>
          </a>
        </ion-label>
      </ion-item>
      <ion-item @click="$go(`/user/supplier-statistics-${storeId}`)">
        <ion-icon :src="pieChartOutline" slot="start" color="medium"/>
        Аналитика продаж
      </ion-item>
      <ion-item @click="$go(`/catalog/store-edit-products-${storeId}`)">
        <ion-icon :src="listOutline" slot="start" color="medium"/>
        Быстрое управление товарами
      </ion-item>
      <ion-item @click="productItemCreate()">
        <ion-icon :src="addOutline" slot="start" color="medium"/>
        Добавить товар в {{storeItem.store_name}}
      </ion-item>
    </ion-list>

    <form @change="saveForm" v-if="storeItem">
      <ion-list lines="full">
      <ion-item-group>
        <ion-item-divider>
          <ion-label>Основные настройки</ion-label>
        </ion-item-divider>

        <ion-item v-if="storeItem.store_name">
          <ion-label position="stacked" color="primary">Название</ion-label>
          <ion-text>
            {{storeItem.store_name}}
            <div>
              <ion-button @click="is_name_edited=1;storeItem.store_name_new=storeItem.store_name;save('store_name_new',storeItem.store_name_new)">Изменить</ion-button>
            </div>
          </ion-text>
        </ion-item>
        <ion-item v-if="is_name_edited||!storeItem.store_name">
          <ion-input v-model="storeItem.store_name_new" name="store_name_new" label="Название непроверенное *" label-placement="stacked"/>
          <ion-icon v-if="isAdmin" :icon="checkmarkCircleOutline" slot="end" color="success" @click="fieldApprove('store_name')"/>
        </ion-item>

        <ion-item v-if="storeItem.store_description">
          <ion-label position="stacked" color="primary">Описание</ion-label>
          <ion-text>
            {{storeItem.store_description}}
            <div>
            <ion-button @click="is_desc_edited=1;storeItem.store_description_new=storeItem.store_description;save('store_description_new',storeItem.store_description_new)">Изменить</ion-button>
            </div>
          </ion-text>
        </ion-item>
        <ion-item v-if="is_desc_edited||!storeItem.store_description">
          <ion-textarea v-model="storeItem.store_description_new" name="store_description_new" rows="6" label="Описание непроверенное *" label-placement="stacked"></ion-textarea>
          <ion-icon v-if="isAdmin" :icon="checkmarkCircleOutline" slot="end" color="success" @click="fieldApprove('store_description')"/>
        </ion-item>

        <ion-item>
          <ion-input v-model="storeItem.store_tax_num" name="store_tax_num" label="ИНН *" label-placement="stacked"></ion-input>
        </ion-item>
        <ion-item v-if="storeItem.store_company_name">
          <ion-label position="stacked" color="primary">Юридическое название (ООО, ИП и т.д.)</ion-label>
          <ion-text>
            {{storeItem.store_company_name}}
            <div>
            <ion-button @click="storeItem.store_company_name_new=storeItem.store_company_name;save('store_company_name_new',storeItem.store_company_name_new)">Изменить</ion-button>
            </div>
          </ion-text>
        </ion-item>
        <ion-item v-if="storeItem.store_company_name_new||!storeItem.store_company_name">
          <ion-textarea v-model="storeItem.store_company_name_new" name="store_company_name_new" label="Юридическое название (ООО, ИП и т.д.) *" label-placement="stacked"></ion-textarea>
          <ion-icon v-if="isAdmin" :icon="checkmarkCircleOutline" slot="end" color="success" @click="fieldApprove('store_company_name')"/>
        </ion-item>
        <ion-item>
          <ion-input
            v-model="storeItem.store_phone"
            name="store_phone"
            type="tel"
            inputmode="tel"
            placeholder="x(xxx)-xxx-xx-xx"
            @ionChange="phoneFormat()"
            spellcheck="false"
            autocapitalize="off"
            label="Телефон *" label-placement="stacked"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="storeItem.store_email" name="store_email" label="Электронная почта" label-placement="stacked"/>
        </ion-item>
      </ion-item-group>
      </ion-list>

    <ion-list>
      <ion-item-divider>
          <ion-label>Заказы и своя доставка</ion-label>
      </ion-item-divider>
      <ion-item>
          <ion-icon :icon="cartOutline" slot="start" color="primary"></ion-icon>
          <ion-text>Подготовка (минут)*</ion-text>
          <ion-input slot="end" v-model="storeItem.store_time_preparation" name="store_time_preparation" style="width:100px;" label=""/>
      </ion-item>
      <ion-item>
          <ion-icon :icon="cartOutline" slot="start" color="primary"></ion-icon>
          <ion-text>Мин. заказ ({{$heap.state.currencySign}})*</ion-text>
          <ion-input slot="end" v-model="storeItem.store_minimal_order" name="store_minimal_order" style="width:100px;" label=""/>
      </ion-item>
      <ion-item>
          <ion-icon :icon="storefrontOutline" slot="start" color="primary"></ion-icon>
          <ion-text>Самовывоз разрешен</ion-text>
          <ion-toggle slot="end" v-model="storeItem.store_pickup_allow" @ionChange="save('store_pickup_allow',$event.target.checked?1:0)" name="store_pickup_allow"/>
      </ion-item>
      <ion-item>
          <ion-icon :icon="rocketOutline" slot="start" color="primary"></ion-icon>
          <ion-text>Своя доставка</ion-text>
          <ion-toggle slot="end" v-model="storeItem.store_delivery_allow" @ionChange="save('store_delivery_allow',$event.target.checked?1:0)" name="store_delivery_allow"/>
      </ion-item>
      <div v-if="storeItem.store_delivery_allow==1">
        <ion-item lines="none">
            <ion-text>Минимальная стоимость доставки ({{$heap.state.currencySign}})</ion-text>
            <ion-input slot="end" v-model="storeItem.store_delivery_cost" name="store_delivery_cost" placeholder="бесплатно" style="width:100px;" label=""/>
        </ion-item>
        <ion-item lines="none">
            <ion-text>Максимальный радиус доставки (км)</ion-text>
            <ion-input slot="end" v-model="storeItem.store_delivery_radius" name="store_delivery_radius" placeholder="по умолчанию" style="width:100px;" label=""/>
        </ion-item>
        <ion-item lines="none" :color="storeItem.store_delivery_methods?'':'warning'">
            <ion-text>Условия доставки</ion-text>
            <ion-button slot="end" @click="$go(`/catalog/store-edit-dmethods-${storeId}`)">Изменить</ion-button>
        </ion-item>
        <ion-item lines="none">
            <p v-if="storeItem.store_delivery_methods" v-html="storeItem.store_delivery_methods" style="display: -webkit-box;-webkit-line-clamp: 4;-webkit-box-orient: vertical;overflow: hidden;"></p>
            <ion-note v-else>Нажмите кнопку изменить и впишите ваши условия доставки</ion-note>
        </ion-item>
      </div>
    </ion-list>

      <ion-item-divider>
        <ion-label>Категории товаров и услуг *</ion-label>
      </ion-item-divider>
      <ion-list>
        <ion-item v-for="group in storeGroupListComp" :key="group.group_id">
          <ion-avatar slot="start">
            <ion-img :src="`${$heap.state.hostname}image/get.php/${group.image_hash}.50.50.webp`"/>
          </ion-avatar>
          {{group.group_name}}
          <ion-checkbox color="primary" slot="end" v-model="group.is_marked" @click="itemUpdateGroup($event.target.checked?0:1,group.group_id)"></ion-checkbox>
        </ion-item>
      </ion-list>

      <ion-item-divider>
        <ion-label>Адрес *</ion-label>
      </ion-item-divider>

      <ion-list v-if="storeItem?.locations?.length">
        <ion-item v-for="location in storeItem.locations" :key="location.location_id">
            <ion-img slot="start" :src="`${$heap.state.hostname}/image/get.php/${location.image_hash}.32.32.png`" />
            <ion-label style="white-space:normal;cursor:pointer;">{{ location.location_address }}</ion-label>
            <ion-icon slot="end" :icon="trash" @click="locationDelete(`${location.location_id}`)"></ion-icon>
        </ion-item>
      </ion-list>
      <ion-list v-else>
        <ion-item lines="none">
          <ion-text>Пока адреса не добавлены</ion-text>
        </ion-item>
        <ion-button @click="modalLocationCreate()" color="light" expand="block">
          <ion-icon :src="locationOutline"/> Добавить адрес
        </ion-button>
      </ion-list>
      <ion-list>
        <ion-item-divider>
          <ion-label>Изображения магазина в приложении *</ion-label>
        </ion-item-divider>

        <image-tile-comp :images="storeItem.images" :image_holder_id="storeItem.store_id" controller="Store" title="Витрина продавца 5 фото" ref="storeImgs"></image-tile-comp>
        <ion-button @click="$refs.storeImgs.take_photo()" color="light" expand="block">
          <ion-icon :src="cameraOutline" slot="start"/> Добавить фото на витрину
        </ion-button>
        <image-tile-comp :images="storeItem.avatar" :image_holder="'store_avatar'" :image_holder_id="storeItem.store_id" controller="Store" title="Логотип продавца 1 фото" ref="storeAvatar"></image-tile-comp>
        <ion-button @click="$refs.storeAvatar.take_photo()" color="light" expand="block">
          <ion-icon :src="cameraOutline" slot="start"/> Добавить логотип
        </ion-button>
      </ion-list>

      <ion-list lines="full">
      <ion-item-group class="schedule">
        <ion-item-divider>
          <ion-label>Время работы *</ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-label slot="start">
            Понедельник
            <ion-label v-show="!storeItem.store_time_opens_0&&!storeItem.store_time_closes_0">(выходной)</ion-label>
          </ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_0" name="store_time_opens_0" label=""/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_0" name="store_time_closes_0" label=""/>
          <ion-icon slot="end" :src="closeCircle" 
            @click="storeItem.store_time_opens_0=storeItem.store_time_closes_0=null;saveSchedule('0')" 
            v-show="storeItem.store_time_closes_0"
          />
        </ion-item>
        <ion-item>
          <ion-label slot="start">
            Вторник
            <ion-label v-show="!storeItem.store_time_opens_1&&!storeItem.store_time_closes_1">(выходной)</ion-label>
          </ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_1" name="store_time_opens_1" label=""/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_1" name="store_time_closes_1" label=""/>
          <ion-icon slot="end" :src="closeCircle" 
            @click="storeItem.store_time_opens_1=storeItem.store_time_closes_1=null;saveSchedule('1')" 
            v-show="storeItem.store_time_closes_1"
          />
        </ion-item>
        <ion-item>
          <ion-label slot="start">
            Среда
            <ion-label v-show="!storeItem.store_time_opens_2&&!storeItem.store_time_closes_2">(выходной)</ion-label>
          </ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_2" name="store_time_opens_2" label=""/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_2" name="store_time_closes_2" label=""/>
          <ion-icon slot="end" :src="closeCircle" 
            @click="storeItem.store_time_opens_2=storeItem.store_time_closes_2=null;saveSchedule('2')" 
            v-show="storeItem.store_time_closes_2"
          />
        </ion-item>
        <ion-item>
          <ion-label slot="start">
            Четверг
            <ion-label v-show="!storeItem.store_time_opens_3&&!storeItem.store_time_closes_3">(выходной)</ion-label>
          </ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_3" name="store_time_opens_3" label=""/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_3" name="store_time_closes_3" label=""/>
          <ion-icon slot="end" :src="closeCircle" 
            @click="storeItem.store_time_opens_3=storeItem.store_time_closes_3=null;saveSchedule('3')" 
            v-show="storeItem.store_time_closes_3"
          />
        </ion-item>
        <ion-item>
          <ion-label slot="start">
            Пятница
            <ion-label v-show="!storeItem.store_time_opens_4&&!storeItem.store_time_closes_4">(выходной)</ion-label>
          </ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_4" name="store_time_opens_4" label=""/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_4" name="store_time_closes_4" label=""/>
          <ion-icon slot="end" :src="closeCircle" 
            @click="storeItem.store_time_opens_4=storeItem.store_time_closes_4=null;saveSchedule('4')" 
            v-show="storeItem.store_time_closes_4"
          />
        </ion-item>
        <ion-item>
          <ion-label slot="start">
            Суббота
            <ion-label v-show="!storeItem.store_time_opens_5&&!storeItem.store_time_closes_5">(выходной)</ion-label>
          </ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_5" name="store_time_opens_5" label=""/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_5" name="store_time_closes_5" label=""/>
          <ion-icon slot="end" :src="closeCircle" 
            @click="storeItem.store_time_opens_5=storeItem.store_time_closes_5=null;saveSchedule('5')" 
            v-show="storeItem.store_time_closes_5"
          />
        </ion-item>
        <ion-item>
          <ion-label slot="start">
            Воскресенье
            <ion-label v-show="!storeItem.store_time_opens_6&&!storeItem.store_time_closes_6">(выходной)</ion-label>
          </ion-label>
          <ion-input placeholder="от" v-model="storeItem.store_time_opens_6" name="store_time_opens_6" label=""/>
          <ion-input placeholder="до" v-model="storeItem.store_time_closes_6" name="store_time_closes_6" label=""/>
          <ion-icon slot="end" :src="closeCircle" 
            @click="storeItem.store_time_opens_6=storeItem.store_time_closes_6=null;saveSchedule('6')" 
            v-show="storeItem.store_time_closes_6"
          />
        </ion-item>
      </ion-item-group>
      </ion-list>
    </form>



    <ion-list v-if="storeItem && isAdmin">
      <ion-item-divider>
          <ion-label>Тарифы</ion-label>
      </ion-item-divider>
      <ion-item v-for="tariff in tariffListComputed" :key="tariff.tariff_id">
        <ion-icon :src="briefcaseOutline" slot="start" color="primary"/>
        <div>
          <p>{{tariff.tariff_name}}</p>
          <ion-note>{{tariff.start_dmy}} - {{tariff.finish_dmy}}</ion-note>
        </div>
        <ion-icon :src="trashOutline" slot="end" @click="tariffDelete(tariff.tariff_id)"/>
      </ion-item>
      <ion-item v-if="isAdmin" button @click="tariffPick()">
        <ion-icon :src="addOutline" slot="start" color="primary"/>
        <ion-label>Добавить тариф</ion-label>
      </ion-item>
    </ion-list>












    <ion-list v-if="ownerList">
      <ion-item-divider>
          <ion-label>Адинистраторы</ion-label>
      </ion-item-divider>
      <ion-item v-for="owner in ownerList" :key="owner.user_id">
        <ion-icon v-if="storeItem.owner_id==owner.user_id" :src="ribbonOutline" slot="start" color="primary"/>
        <ion-icon v-else :src="personOutline" slot="start" color="primary"/>
        <ion-label>
          <a :href="`tel:+${owner.user_phone}`">+{{owner.user_phone}}</a> {{owner.user_name}}
          <span v-if="storeItem.owner_id==owner.user_id">(Суперадмин)</span>
        </ion-label>
        <ion-icon v-if="isStoreSuperadmin && storeItem.owner_id!=owner.user_id" :src="trashOutline" slot="end" @click="ownerDelete(owner.user_id)"/>
        <ion-icon v-if="isStoreSuperadmin && storeItem.owner_id==owner.user_id" :src="swapHorizontalOutline" slot="end" @click="ownerAdd('swap')"/>
      </ion-item>

      <ion-item v-if="isStoreSuperadmin" button @click="ownerAdd()">
        <ion-icon :src="addOutline" slot="start" color="primary"/>
        <ion-label>Добавить администратора</ion-label>
      </ion-item>
    </ion-list>


    <ion-list v-if="isStoreSuperadmin && storeItem">
      <ion-item-divider>
          <ion-label>API токен</ion-label>
      </ion-item-divider>
      <ion-item>
        <ion-icon :src="keyOutline" slot="start" color="primary"/>
        
        <ion-label v-if="apiToken" @click="apiTokenCopy()">{{apiToken.token_hash}}</ion-label>
        <ion-label v-else>**** **** ****</ion-label>

        <ion-icon v-if="apiToken" :src="copyOutline" slot="end" color="dark" @click="apiTokenCopy()"/>
        <ion-icon v-else :src="eyeOutline" slot="end" color="dark" @click="apiTokenShow()"/>
      </ion-item>
    </ion-list>
    </div>
  </base-layout>
</template>

<script>
import {
  IonInput,
  IonTextarea,
  IonToggle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonItemDivider,
  IonText,
  IonItemGroup,
  IonImg,
  IonAvatar,
  IonButton,
  IonProgressBar,
  IonNote,
  modalController
  }                   from '@ionic/vue'

import {
  cameraOutline,
  trash,
  trashOutline,
  locationOutline,
  storefrontOutline,
  flagOutline,
  searchOutline,
  personOutline,
  addOutline,
  checkmarkCircleOutline,
  chevronBack,
  closeCircle,
  keyOutline,
  eyeOutline,
  copyOutline,
  ribbonOutline,
  briefcaseOutline,
  cartOutline,
  rocketOutline,
  swapHorizontalOutline,
  pieChartOutline,
  qrCode,
  listOutline,
}                           from 'ionicons/icons'
import imageTileComp        from '@/components/ImageTileComp.vue'
import UserAddressPicker    from '@/components/UserAddressPicker.vue'
import AdminTariffPicker    from '@/components/AdminTariffPicker.vue'
import heap                 from '@/heap';
import jQuery               from "jquery";
import User                 from '@/scripts/User.js'

export default  {
  components: { 
  IonInput,
  IonTextarea,
  IonToggle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonItemDivider,
  IonText,
  IonItemGroup,
  IonImg,
  IonAvatar,
  IonButton,
  IonProgressBar,
  IonNote,
  imageTileComp
    },
  setup(){
    return {
      cameraOutline,
      trash,
      trashOutline,
      locationOutline,
      storefrontOutline,
      flagOutline,
      searchOutline,
      personOutline,
      addOutline,
      checkmarkCircleOutline,
      chevronBack,
      closeCircle,
      keyOutline,
      eyeOutline,
      copyOutline,
      ribbonOutline,
      briefcaseOutline,
      cartOutline,
      rocketOutline,
      swapHorizontalOutline,
      pieChartOutline,
      qrCode,
      listOutline,
      
      }
  },
  data(){
    return {
      storeId: this.$route.params.id,
      storeItem: null,
      storeGroupList:[],
      ownerList:null,
      tariffList:null,
      is_name_edited:0,
      is_desc_edited:0,
      is_deleted:0,
      is_disabled:0,
      is_working:0,
      is_primary:0,
      validity:0,
      validity_perc:100,
      validity_min:80,
      apiToken:null,
    }
  },
  computed: {
    isPhoneValid() {
      return [11,12].includes(this.storeItem.user_phone.replace(/\D/g,"").length);
    },
    isAdmin(){
      return User.isAdmin();
    },
    isStoreSuperadmin(){
      return this.$heap.state.user.user_id==this.storeItem?.owner_id || User.isAdmin()
    },
    message(){
      if(!this.storeItem){
        return null
      }
      if(this.storeItem?.deleted_at){
        return "Предприятие не активно и будет удалено. Вы еще можете отменить удаление";
      }
      if(this.storeItem?.is_disabled==1){
        return "Предприятие на модерации.";
      }
      if(this.storeItem?.is_working==0){
        return "Предприятие отмечено вами как времено не готовое к заказам. Например, в связи с праздниками";
      }
      if(this.storeItem?.is_primary==1){
        return "Предприятие активно и готово принимать заказы в рабочее время. Является опорным";
      }
      return "Предприятие активно и готово принимать заказы в рабочее время.";
    },
    messageClass(){
      if(this.storeItem?.deleted_at){
        return "deleted";
      }
      if(this.storeItem?.is_disabled==1){
        return "disabled";
      }
      if(this.storeItem?.is_primary==1){
        return "primary";
      }
      if(this.storeItem?.is_working!=1){
        return "notworking";
      }
      return 'active';
    },
    tariffListComputed(){
      if(!this.tariffList){
        return this.tariffList
      }
      for(let tariff of this.tariffList){
          tariff.start_dmy=this.toLocDate(tariff.start_at)
          tariff.finish_dmy=this.toLocDate(tariff.finish_at)
      }
      return this.tariffList;
    },
    storeGroupListComp(){
      if(!this.storeItem || !this.storeGroupList){
        console.log(this.storeItem,this.storeGroupList)
        return null
      }
      let store_group_list=[]
      try{
        const member_of_groups=this.storeItem.member_of_groups?.group_ids?.split(',');
        for(let group of this.storeGroupList){
          group.is_marked=member_of_groups?.includes(group.group_id);
          store_group_list.push(group)
        }
      }catch(err){/** */}
      return store_group_list
    }
  },
  mounted(){
    this.listGroupGet()
    this.itemGet()
    this.ownerListGet()
  },
  methods:{
    toLocDate( iso ){
        const event = new Date(Date.parse(iso));
        const options = { month: 'short', day: 'numeric', year:'numeric' };
        return event.toLocaleDateString(undefined, options);
    },
    async itemGet(){
      try{
        this.storeItem=await jQuery.post( heap.state.hostname + "Store/itemGet", { store_id: this.storeId })
        this.storeItem.store_pickup_allow*=1
        this.storeItem.store_delivery_allow*=1
        if( this.storeItem.store_delivery_radius>0 ){
          this.storeItem.store_delivery_radius=this.storeItem.store_delivery_radius/1000
        } else {
          this.storeItem.store_delivery_radius=''
        }
        this.storeItem.store_delivery_methods_short=String(this.storeItem.store_delivery_methods).substring(0,100)+"..."
        this.itemParseFlags()
        this.itemValidityCalc()
        this.tariffListGet()
      } catch (err){
        const message=err.responseJSON?.messages?.error;
        if(message=='notfound'){
          this.$flash("Не найден")
          this.$go('/')
        }
      }
    },

    itemParseFlags(){
      this.is_deleted   = this.storeItem.deleted_at==null?0:1
      this.is_disabled  = this.storeItem.is_disabled==0?0:1
      this.is_working   = this.storeItem.is_working==0?0:1
      this.is_primary   = this.storeItem.is_primary==1?1:0
    },
    itemValidityCalc(){
      const requiredFields=[
        "store_name|store_name_new",
        "store_description|store_description_new",
        "store_company_name|store_company_name_new",
        "store_phone","store_tax_num",
        "store_minimal_order",
        "store_time_preparation",
        "store_time_opens_0|store_time_opens_1|store_time_opens_2|store_time_opens_3|store_time_opens_4|store_time_opens_5|store_time_opens_6|store_time_closes_0|store_time_closes_1|store_time_closes_2|store_time_closes_3|store_time_closes_4|store_time_closes_5|store_time_closes_6",
        "images",
        "locations",
        "member_of_groups.group_ids"
        ]
      const filedsTotal=requiredFields.length
      let validTotal=0
      for(const fields of requiredFields){
        let is_valid=0
        for(const field of fields.split('|')){
          let value=null
          const path=field.split('.')
          if(path[1]){//notation with dot
            value=this.storeItem[path[0]][path[1]]
          } else {
            value=this.storeItem[path[0]]
          }
          if(value?.length>0){
            is_valid=1
            break
          }
        }
        validTotal+=is_valid
      }
      this.validity=validTotal/filedsTotal
      this.validity_perc=Math.round(this.validity*100)
    },
    async itemDelete( is_deleted ){
      if(is_deleted && !confirm("Внимание магазин будет удален! Товары, настройки, отзывы будут потеряны. Продолжить?")){
        setTimeout(()=>{this.is_deleted=0;},100)
        return
      }
      const remoteFunction=is_deleted?'itemDelete':'itemUnDelete'
      try{
        await jQuery.post( heap.state.hostname + "Store/"+remoteFunction, { store_id: this.storeId })
        this.storeItem.deleted_at=is_deleted?1:null;
      }catch{
        this.itemGet()
      }
    },
    async itemDisable( is_disabled ){
      if(this.storeItem.is_disabled==is_disabled){
        return
      }
      try{
        await jQuery.post( heap.state.hostname + "Store/itemDisable", { store_id: this.storeId, is_disabled })
        this.storeItem.is_disabled=is_disabled;
      }catch{
        this.itemGet()
      }
    },
    async productItemCreate(){
      try{
        const request={
          store_id:this.storeId,
          product_name:"Новый товар",
          product_price:1000,
          product_promo_price:1000
        }
        const product_id=await jQuery.post(`${heap.state.hostname}Product/itemCreate`,request)
        this.$go(`/catalog/product-edit-${product_id}`)
      }catch{
        this.$flash("Не удалось создать товар")
      }
    },
    saveForm(ev){
      const field_name=ev.target.name;
      const field_value=this.storeItem[field_name]

      if( field_name.indexOf('store_time_closes')>-1 || field_name.indexOf('store_time_opens')>-1 ){
        this.saveSchedule(field_name)
      }else{
        this.save(field_name,field_value)
      }
    },
    saveSchedule(field_name){
      const dayIndex=field_name.split('_').pop()
      let store_time_opens=this.storeItem['store_time_opens_'+dayIndex]
      let store_time_closes=this.storeItem['store_time_closes_'+dayIndex]

      if( store_time_opens=='' || store_time_opens==null ){
        store_time_opens=null
      } else {
        store_time_opens=Number(store_time_opens)
      }
      if( store_time_closes=='' || store_time_closes==null ){
        store_time_closes=null
      } else {
        store_time_closes=Number(store_time_closes)
      }

      if( store_time_opens>24 ){
        store_time_opens=0
      }
      if( store_time_closes>24 ){
        store_time_closes=0
      }

      // if( store_time_opens>=store_time_closes && store_time_closes!=null || store_time_closes==0 ){
      //   store_time_closes=store_time_opens+1
      //   this.$flash("Время закрытия должно быть позже открытия")
      // }
      const request={
        store_id:this.storeId,
        ['store_time_opens_'+dayIndex]:store_time_opens,
        ['store_time_closes_'+dayIndex]:store_time_closes
      }
      
      if(this.storeItem['store_time_opens_'+dayIndex] != store_time_opens){
        this.storeItem['store_time_opens_'+dayIndex] = store_time_opens;
      }
      if(this.storeItem['store_time_closes_'+dayIndex] != store_time_closes){
        this.storeItem['store_time_closes_'+dayIndex] = store_time_closes;
      }
      this.itemValidityCalc()
      this.itemUpdate(request)
    },
    async save(field_name, field_value) {
      if(!field_name){
        return
      }
      if(field_name == 'user_phone'){
        if(!this.isPhoneValid){
          return false;
        }
        field_value = field_value.replace(/\D/g,"");
      }
      let request = {
        store_id:this.storeId,
        [field_name]:field_value
      };
      this.storeItem[field_name] = field_value;
      if( field_name=='store_delivery_radius' && field_value>0 ){
        request.store_delivery_radius=field_value*1000
      }
      this.itemValidityCalc()
      this.itemUpdate(request)
      this.itemParseFlags()
    },
    async itemUpdate(request){
      try{
        request['validity']=this.validity_perc
        await jQuery.post( heap.state.hostname + "Store/itemUpdate", JSON.stringify(request))
        this.$flash("сохранено")
      } catch(err){
        this.$flash("Не удалось сохранить изменение")
        this.itemGet()
      }
    },
    phoneFormat(){
      if( !this.storeItem.store_phone ){
        this.storeItem.store_phone='';
      }
      try{
        let user_phone=this.storeItem.store_phone.replace(/\D/g,"")
        if(user_phone.length>12){
          user_phone='+'+user_phone.substring(user_phone.length-12)
        }
        this.storeItem.store_phone=user_phone
      } catch{/** */}
    },
    async fieldApprove(field_name){
      let request = {
        store_id:this.storeId,
        field_name
      };
      try{
        await this.save(field_name, this.storeItem[field_name])
        await jQuery.post( heap.state.hostname + "Store/fieldApprove", request)
      } catch(err){
        const validationErrors=err.responseJSON.messages.error
        if(validationErrors?.includes('store_description')){
          this.$flash("Описание слишком короткое")
        } else
        if(validationErrors?.includes('store_name')){
          this.$flash("Название слишком короткое")
        } else 
        this.$flash("Не удалось сохранить изменение")
      }
      this.itemGet()
    },
    async itemUpdateGroup(is_joined,group_id){
      if( !User.isAdmin() && this.is_disabled==0 && !confirm("Внимание! Изменение группы, отправит магазин/ресторан на модерацию") ){
        this.listGroupGet()
        return false
      }
      const request={
        store_id:this.storeId,
        is_joined,
        group_id
      }
      try{
        await jQuery.post( heap.state.hostname + "Store/itemUpdateGroup", request)
      } catch(err){
        this.$flash("Не удалось сохранить изменение")
      }      
      this.itemGet()
    },
    async listGroupGet(){
      try{
        this.storeGroupList=await jQuery.get( heap.state.hostname + "Store/listGroupGet")
      }catch{/** */}
    },
    async ownerListGet(){
      try{
        this.ownerList=await jQuery.post(heap.state.hostname + "Store/ownerListGet",{store_id:this.storeId} )
      }catch{/** */}
    },
    async ownerAdd( action='add' ){
      let owner_phone=prompt('Введите номер телефона нового администратора')
      if(!owner_phone){
        return
      }
      owner_phone=owner_phone.replace(/\D/g,"")
      if( ![11,12].includes(owner_phone.length) ){
        this.$flash("Проверьте правильность телефона")
        return
      }
      try{
        await jQuery.post(heap.state.hostname + "Store/ownerSave",{store_id:this.storeId,action,owner_phone})
        if( action=='swap' ){
          await this.itemGet()
        }
        this.ownerListGet()
      }catch{
        this.$flash("Не удалось добавить администратора")
      }
    },
    async ownerDelete(owner_id){
      if(!confirm("Удалить этого пользователя из администраторов магазина?")){
        return
      }
      try{
        await jQuery.post(heap.state.hostname + "Store/ownerSave",{store_id:this.storeId,action:'delete',owner_id})
        this.ownerListGet()
      }catch{
        this.$flash("Не удалось удалить администратора")
      }
    },
    async modalLocationCreate() {
      if(!heap.state.user.user_id){
        this.$flash('Чтобы добавленные адреса сохранились, пожалуйста войдите в систему');
        this.$go({name: 'UserSignIn'});
        return;
      }
      var location_group_name_low="рабочий";
      const modal = await modalController.create({
        component: UserAddressPicker,
        showBackdrop:true,
        backdropDismiss:true,
        componentProps:{
          location_group_name_low
        },
      });
      modal.onDidDismiss().then(location => {
        this.locationCreate(location.data);
      });
      return modal.present();
    },
    async locationCreate(location){
      if( !location ){
        return;
      }
      const request={
        location_holder:'store',
        location_holder_id:this.storeId,
        location_group_type:'address_work',
        location_address:location.location_address,
        location_latitude:location.location_latitude,
        location_longitude:location.location_longitude
      };
      try{
        await jQuery.post(heap.state.hostname + "Store/locationCreate",request)
        this.itemGet()
      } catch (err){
        const message=err.responseJSON?.messages?.error;
        if(message=='limit_exeeded'){
          this.$flash("Больше адресов добавить нельзя")
        }
      }
    },
    async locationDelete( location_id ){
      try{
        await jQuery.post(heap.state.hostname + "Store/locationDelete",{location_id})
        this.itemGet()
      }catch{
        this.$flash("Удалить адрес не удалось")
      }
    },
    async apiTokenShow(){
      const request={
        'token_holder':'store',
        'token_holder_id':this.storeId
      }
      try{
        this.apiToken=await jQuery.post(heap.state.hostname + "Token/itemActiveGet",request)
      } catch{/** */}
    },
    apiTokenCopy(){
      if(this.apiToken.token_hash){
        navigator.clipboard.writeText(this.apiToken.token_hash);
        this.$flash("Токен скопирован")
      }
    },
    async tariffListGet(){
      const request={
        'store_id':this.storeId
      }
      try{
        this.tariffList=await jQuery.post(heap.state.hostname + "Admin/Tariff/storeTariffListGet",request)
      } catch{
        this.tariffList=null
      }
    },
    async tariffDelete(tariff_id){
      if(!confirm("Вы уверены?")){
        return
      }
      const request={
        'store_id':this.storeId,
        'tariff_id':tariff_id
      }
      try{
        await jQuery.post(heap.state.hostname + "Admin/Tariff/storeTariffDelete",request)
        this.tariffListGet()
      } catch{/** */}
    },
    async tariffAdd(new_tariff_data){
      try{
        await jQuery.post(heap.state.hostname + "Admin/Tariff/storeTariffAdd",new_tariff_data)
        this.tariffListGet()
      }
      catch(err){
          const exception=err.responseJSON;
          const exception_code=exception.messages.error;
          switch(exception_code){
              case 'forbidden':
                  this.$flash("Не достаточно прав");
                  break;
          }
          return false
      }
    },
    async tariffPick(){
      if(!this.isAdmin){
        return;
      }
      const modal = await modalController.create({
        component: AdminTariffPicker,
        showBackdrop:true,
        backdropDismiss:true,
        componentProps:{
          store_id:this.storeId
        },
      });
      modal.onDidDismiss().then(new_tariff_data => {
        if(new_tariff_data?.data?.tariff_id){
          this.tariffAdd(new_tariff_data.data);
        }
      });
      return modal.present();
    }
  },
}
</script>