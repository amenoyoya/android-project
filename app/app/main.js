import Vue from 'nativescript-vue'
// import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'

if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// Routing
const Master = {
  template: `
    <Page>
      <ActionBar title="Master" />
      <StackLayout>
        <Button text="To Details directly" @tap="navigateToDetail" />
        <Button text="Show Details modally" @tap="showDetailPageModally" />
      </StackLayout>
    </Page>
  `,
  methods: {
    navigateToDetail() {
      this.$navigateTo(Detail);
    },
    showDetailPageModally() {
      /**
       * @todo bug fix
       * $showModal でモーダル表示した後、$modal.close でモーダルを閉じると ↑ の $navigateTo が使えなくなる
       */
      this.$showModal(ModalDetail);
    }
  }
};

const Detail = {
  template: `
    <Page>
      <ActionBar title="Detail" />
      <StackLayout>
        <Label text="Details..." />
      </StackLayout>
    </Page>
  `,
};

const ModalDetail = {
  template: `
    <Frame>
      <Page>
        <ActionBar title="ModalDetail" />
        <StackLayout>
          <Button @tap="$modal.close()" text="Close" />
        </StackLayout>
      </Page>
    </Frame>
  `,
};

new Vue({
  render: h => h('frame', [h(Master)])
}).$start()
