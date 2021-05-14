import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import { isIOS, tip, phoneWidth } from './config'
import './assets/styles/index.less'
import { Button } from 'vant';
import { Popup } from 'vant';
import { DatetimePicker } from 'vant';
import { Picker } from 'vant';
import { Loading } from 'vant';
import { Notify } from 'vant';
import { Overlay } from 'vant';
import { Row, Col } from 'vant';
import { Dialog } from 'vant';
import { Toast } from 'vant';
import { Icon } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Form } from 'vant';
import { Field } from 'vant';
import ToastV1 from '@/plugin/loading-v1'
import dayjs from 'dayjs'
import closeMixin from '@/mixins/close'
import { List } from 'vant';
import { Badge } from 'vant';
import { Tag } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';

Vue.use(DropdownMenu);
Vue.use(DropdownItem);

Vue.use(Tag);
Vue.use(Badge);
Vue.use(List);
Vue.use(Field);
Vue.use(Form);
Vue.use(ToastV1);
Vue.use(Icon);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Button)
Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(Picker)
Vue.use(Loading)
Vue.use(Notify)
Vue.use(Overlay)
Vue.use(Row)
Vue.use(Col)
Vue.use(Cell);
Vue.use(CellGroup);

tip(tip=>{
  Notify(tip)
})

Vue.prototype.$phoneWidth = phoneWidth
Vue.prototype.$dayjs = dayjs


FastClick.prototype.focus = function(targetElement) {
  let length;
  if (isIOS
      && targetElement.setSelectionRange
      && targetElement.type.indexOf('date') !== 0
      && targetElement.type !== 'time'
      && targetElement.type !== 'month'
      && targetElement.type !== 'email'
  ) {
    length = targetElement.value.length
    targetElement.focus()
    targetElement.setSelectionRange(length, length)
  } else {
    targetElement.focus()
  }
}
FastClick.attach(document.body)

Vue.mixin(closeMixin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
