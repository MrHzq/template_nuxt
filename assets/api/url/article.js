/*
 * @Author: hzq
 * @Date: 2018-11-15 17:26:55
 * @Last Modified by: hzq
 * @Last Modified time: 2018-12-06 14:48:28
 * @文件说明: 文章接口
 */
export default [
    // 获得文章正文
    {
        name: 'getArticleContent',
        url: '/article/getArticleContent',
        methods: 'get'
    },
    // 文章打赏
    {
        name: 'tipViewpointInfo',
        url: '/article/tipViewpointInfo'
    },
    // 文章打赏信息
    {
        name: 'articleAwardList',
        url: '/article/articleAwardList',
        methods: 'get'
    }
]
