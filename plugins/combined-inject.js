import Vue from 'vue'
import hzqAxios from 'hzq-axios'
import hzqTool from 'hzq-tool'
import apiUrl from '~/assets/apiUrl'

Vue.use(hzqTool)
Vue.use(hzqAxios, apiUrl, {
    baseURL: 'https://open-api.beone.app',
    createConfig: {
        headers: { 'X-APPID': 'toBPJhUqos' }
    }
})

export default (c, inject) => {
    inject('api', Vue.$api)
    inject('tool', Vue.$tool)
    inject('getItem', Vue.prototype.$getItem)
    inject('setItem', Vue.prototype.$setItem)
    inject('copy', Vue.prototype.$copy)
}
