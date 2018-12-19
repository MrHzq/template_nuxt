import Vue from 'vue'
import hzqTool from 'hzq-tool'
import hzqAxios from 'hzq-axios'
import apiUrl from '~/assets/apiUrl'

Vue.use(hzqTool)
Vue.use(hzqAxios, apiUrl, {
    baseURL: 'https://open-api.beone.app',
    createConfig: {
        headers: { 'X-APPID': 'toBPJhUqos' }
    }
})
const arr = ['api', 'tool', 'copy', 'getItem', 'setItem']
export default (c, inject) => {
    arr.map(val => inject(val, Vue.prototype['$' + val]))
}
