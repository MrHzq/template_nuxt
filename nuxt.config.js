module.exports = {
    mode: 'spa',
    head: {
        title: 'Bitbaba',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content:
                    'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'
            },
            {
                'http-equiv': 'Cache-Control',
                content: 'no-cache,no-store,must-revalidate'
            },
            {
                'http-equiv': 'Pragma',
                content: 'no-cache'
            },
            {
                'http-equiv': 'Expires',
                content: '0'
            },
            {
                hid: 'x-share-type',
                name: 'x-share-type',
                content: 'article'
            },
            {
                hid: 'x-share-author',
                name: 'x-share-author',
                content: ''
            },
            {
                hid: 'x-share-author_avatar',
                name: 'x-share-author_avatar',
                content: ''
            },
            {
                hid: 'x-share-title',
                name: 'x-share-title',
                content: ''
            },
            {
                hid: 'x-share-digest',
                name: 'x-share-digest',
                content: ''
            },
            {
                hid: 'x-share-time',
                name: 'x-share-time',
                content: ''
            }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            {
                rel: 'stylesheet',
                href: '//at.alicdn.com/t/font_916564_iwsgh5e6j1.css'
            }
        ]
    },
    css: ['~/assets/style/app.scss'],
    plugins: [
        {
            src: '~/plugins/preview.js',
            ssr: false
        },
        '~/plugins/combined-inject.js'
    ],
    build: {
        vendor: ['~/plugins/preview.js']
    },
    env: {
        PATH_TYPE: process.env.PATH_TYPE
    }
}
