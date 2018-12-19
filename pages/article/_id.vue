/*
 * @Author: hzq
 * @Date: 2018-12-19 15:58:36
 * @Last Modified by: hzq
 * @Last Modified time: 2018-12-19 15:58:36
 * @文件说明:文章正文
 */
<template>
    <div class="article" :class="{ pcClass: isPC }">
        <!-- 标题 -->
        <div class="title">{{ articleInfo.title }}</div>
        <!-- 用户信息 -->
        <div class="userInfo">
            <a class="left" :href="'xktapp://user/' + articleInfo.user_id">
                <p class="userImg" :style="{
                        backgroundImage:
                            'url(' +
                            articleInfo.avatar +
                            '?imageView2/1/w/30/h/30)'
                    }"></p>
                <p class="name">{{ articleInfo.name }}</p>
            </a>
            <div class="right">
                <p class="time">{{ articleInfo.created_time }}</p>
                <p class="watch">阅读 {{ articleInfo.watched }}</p>
            </div>
        </div>
        <!-- 文章内容 -->
        <div class="content" v-html="articleInfo.content"></div>
        <!-- 文章打赏部分 -->
        <div class="reward" v-if="awardData" :style="{ paddingBottom: isWeb ? '142px' : '60px' }">
            <a class="avatar" :href="'xktapp://user/' + articleInfo.user_id" :style="{
                    backgroundImage:
                        'url(' + articleInfo.avatar + '?imageView2/1/w/64/h/64)'
                }"></a>
            <div class="like" @click="showPopup">
                <img src="https://static-image.dzqqsc.com/moneyIcon?imageView2/1/w/24/h/34" /> 喜欢作者
            </div>
            <div class="likeNum" v-if="awardData.num">
                <div class="line"></div>
                <div class="num">{{ awardData.num }}人喜欢</div>
                <div class="line"></div>
            </div>
            <div class="likeUser">
                <a v-for="i in awardData.list" :key="i.user_id" :href="'xktapp://user/' + i.user_id" :style="{
                        backgroundImage:
                            'url(' + i.avatar + '?imageView2/1/w/30/h/30)'
                    }"></a>
            </div>
        </div>
        <!-- 打赏金额弹窗 -->
        <transition name="fade">
            <div class="rewardPopup" v-if="popup" @click.self="closePopup">
                <div class="popupContent">
                    <a class="avatar" :href="'xktapp://user/' + articleInfo.user_id" :style="{
                            backgroundImage:
                                'url(' +
                                articleInfo.avatar +
                                '?imageView2/1/w/64/h/64)'
                        }"></a>
                    <div class="popTitle">喜欢作者</div>
                    <div class="popMoney">
                        <div v-for="(i, index) in money" :key="i" :class="{ choose: index === price }" @click="price = index">
                            {{ i }} BBC
                        </div>
                    </div>
                    <div class="popBtn" :style="{ opacity: loading ? '0.8' : '1' }" @click="rewardFun">
                        <i class="iconfont icon-jiazai" v-show="loading"></i>
                        确认打赏
                    </div>
                    <i class="iconfont icon-guanbi" @click="closePopup"></i>
                </div>
            </div>
        </transition>
        <!-- toast文字提示 -->
        <transition name="fade">
            <div class="toast" v-if="toast">{{ toast }}</div>
        </transition>
        <!-- 底部 banner -->
        <a class="footer" :class="{ iphoneX: isX }" v-if="isWeb" href="https://www.xkt.one">
            <div class="footer_content">
                <img class="logo" src="https://static-image.dzqqsc.com/footer_logo?imageView2/1/w/186/h/32" alt="logo" />
                <div class="text">专业的数字资产交易社区</div>
            </div>
            <div class="footer_join">立即加入</div>
        </a>
    </div>
</template>

<script>
    export default {
        name: 'my-article',
        head() {
            return {
                title: this.articleInfo.title,
                meta: [
                    {
                        hid: 'x-share-author',
                        name: 'x-share-author',
                        content: this.articleInfo.name
                    },
                    {
                        hid: 'x-share-author_avatar',
                        name: 'x-share-author_avatar',
                        content: this.articleInfo.avatar
                    },
                    {
                        hid: 'x-share-title',
                        name: 'x-share-title',
                        content: this.articleInfo.title
                    },
                    {
                        hid: 'x-share-digest',
                        name: 'x-share-digest',
                        content: this.articleInfo.summary
                    },
                    {
                        hid: 'x-share-time',
                        name: 'x-share-time',
                        content: this.articleInfo.created_time
                    }
                ]
            }
        },
        data() {
            return {
                // 文章数据
                articleInfo: {},
                // 是否为App外
                isWeb: true,
                // 是否为PC端
                isPC: false,
                // 是否为iPhone X
                isX: false,
                // 打赏数据
                awardData: null,
                // 是否显示打赏弹窗
                popup: false,
                // 打赏金额数组
                money: [0.01, 0.02, 0.03],
                // 选中的打赏金额下标
                price: -1,
                // token
                token: '',
                // toast文字提示
                toast: '',
                // 是否按钮加载效果
                loading: false
            }
        },
        methods: {
            // 显示打赏金额弹窗
            showPopup() {
                if (this.isWeb) location.href = 'https://www.xkt.one'
                else if (this.token) {
                    document.documentElement.style.overflowY = 'hidden'
                    document.addEventListener('touchmove', this.stopTouch, {
                        passive: false,
                        capture: true
                    })
                    this.price = -1
                    this.popup = true
                } else this.toastFun('未登录')
            },
            // 禁止滚动
            stopTouch(e) {
                e.preventDefault()
            },
            // 关闭打赏金额弹窗
            closePopup() {
                this.popup = false
                document.documentElement.style.overflowY = 'auto'
                document.removeEventListener('touchmove', this.stopTouch, {
                    passive: false,
                    capture: true
                })
            },
            // 打赏弹窗-点击打赏按钮
            rewardFun() {
                if (this.price === -1) {
                    this.toastFun('请选择打赏金额~')
                    return
                }
                if (this.loading) return
                else this.loading = true
                let { article_id } = this.articleInfo
                this.$api
                    .tipViewpointInfo(
                        {
                            asset_id: 1,
                            feed_id: article_id,
                            price: this.money[this.price]
                        },
                        { 'X-TOKEN': this.token }
                    )
                    .then(({ code }) => {
                        if (code === 0) {
                            this.$api
                                .articleAwardList({ article_id })
                                .then(res => {
                                    if (res.code === 0) {
                                        this.awardData = res.data
                                        this.closePopup()
                                        this.toastFun('谢谢你的打赏~')
                                    } else this.toastFun()
                                })
                                .catch(e => this.toastFun())
                        } else if (code === 99999) {
                            this.closePopup()
                            this.toastFun('未登录')
                        } else if (code === 90040) {
                            this.toastFun('余额不足')
                        } else this.toastFun()
                    })
                    .catch(e => this.toastFun())
            },
            // toast文字提示
            toastFun(toast = '网络错误，请稍后重试') {
                this.loading = false
                if (this.toast === toast) return
                this.toast = toast
                setTimeout(() => (this.toast = ''), 1500)
            }
        },
        async asyncData(c) {
            let isX = false
            let isPC = false
            let ua = navigator.userAgent
            if (
                ua.match(
                    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
                )
            ) {
                isX =
                    ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) &&
                    screen.height >= 812
            } else isPC = true
            let { id: article_id } = c.params
            // 获取文章信息
            let { data } = await c.app.$api.getArticleContent({
                a: 'h5',
                article_id
            })
            data.created_time = c.app.$tool.formatDate(
                data.created_time * 1000,
                'YYYY.MM.DD HH:mm'
            )
            let { content: ctn } = data
            ctn = ctn
                .replace(/”/g, '" ')
                .replace(/“/g, ' "')
                .replace(/<br>/g, '')
            if (!isPC) {
                ctn = ctn.replace(/<img/g, '<img preview="1"')
            }
            data.content = ctn
            let { token = '' } = c.query
            // 获取打赏信息
            let { data: awardData } = await c.app.$api.articleAwardList({
                article_id
            })
            return {
                isX,
                isPC,
                awardData,
                articleInfo: data,
                isWeb: ua.substring(0, 2) !== 'X-',
                token: token.trim().replace(/\s/g, '+')
            }
        }
    }
</script>

<style lang="scss">
    html,
    body,
    #app {
        overflow-x: hidden;
    }

    @mixin flex($align: center, $justify: center, $direction: row) {
        display: flex;
        display: -webkit-flex;
        align-items: $align;
        -webkit-align-items: $align;
        justify-content: $justify;
        -webkit-justify-content: $justify;
        flex-direction: $direction;
    }
    .article {
        padding: 0 16px;
        -webkit-overflow-scrolling: touch;
        // 设置点击时的背景色
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        a:link,
        a:visited,
        a:hover,
        a:active {
            color: #fff;
            text-decoration: none;
            cursor: default;
        }
        .title {
            padding-top: 24px;
            color: #333;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
        }
        .userInfo {
            @include flex($justify: space-between);
            font-size: 14px;
            .left,
            .right {
                @include flex($justify: space-between);
            }
            .userImg {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
            }
            .name {
                margin-left: 8px;
                font-weight: bold;
                color: #424242;
            }
            .right {
                color: #9b9b9b;
                align-items: baseline;
            }
            .watch {
                margin-left: 11px;
            }
        }
        .content {
            margin-top: 30px;
            font-size: 18px;
            line-height: 34px;
            color: #2f2f2f;
            word-break: break-all;
            img,
            video {
                display: block;
                width: 100%;
                margin: 16px 0;
            }
            video {
                height: calc((100vw - 32px) * 9 / 16);
            }
            p {
                margin: 16px 0;
            }
            blockquote {
                margin: 16px 0;
                padding-left: 14px;
                border-left: 4px solid #d9d9d9;
                color: #919191;
            }
            h1 {
                margin: 32px 0 16px;
                font-size: 20px;
                line-height: 40px;
                font-weight: normal;
            }
            ol,
            ul {
                margin: 16px 0 16px 20px;
                line-height: 34px;
            }
            a {
                color: #1fa1f4;
                cursor: pointer !important;
            }
            .only-video {
                position: relative;
                width: 100%;
                padding-bottom: 56.25%;
                video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                }
            }
            .ql-align-center {
                text-align: center;
            }
            .ql-align-right {
                text-align: right;
            }
            .ql-align-justify {
                text-align: justify;
            }
        }
        .reward {
            @include flex($direction: column);
            padding: 40px 0;
            .avatar {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
            }
            .like {
                @include flex();
                width: 108px;
                height: 36px;
                margin: 20px 0;
                color: #fff;
                font-size: 14px;
                border-radius: 36px;
                cursor: pointer;
                background: linear-gradient(
                    135deg,
                    rgba(9, 151, 232, 1) 0%,
                    rgba(19, 116, 201, 1) 31%,
                    rgba(25, 74, 169, 1) 100%
                );
                img {
                    width: 12px;
                    margin-right: 9px;
                }
            }
            .likeNum {
                @include flex();
                width: 260px;
                margin-bottom: 10px;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.25);
                .line {
                    flex: 1;
                    height: 1px;
                    background-color: rgba(0, 0, 0, 0.25);
                }
                .num {
                    padding: 0 12px;
                }
            }
            .likeUser {
                @include flex();
                flex-wrap: wrap;
                width: 234px;
                max-height: 120px;
                overflow: hidden;
                a {
                    width: 30px;
                    height: 30px;
                    margin-bottom: 10px;
                    margin-right: 4px;
                    border-radius: 50%;
                    background-size: cover;
                    background-position: center;
                    &:nth-child(7n) {
                        margin-right: 0;
                    }
                }
            }
        }
        .rewardPopup {
            @include flex();
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            font-size: 16px;
            background-color: rgba(0, 0, 0, 0.45);
            .popupContent {
                @include flex($direction: column);
                position: relative;
                width: 327px;
                padding-top: 48px;
                border-radius: 10px;
                background-color: #fff;
                .avatar {
                    position: absolute;
                    top: -33px;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    border: 2px solid #fff;
                }
                .popTitle {
                    position: relative;
                    font-weight: bold;
                    margin-bottom: 30px;
                    &::after {
                        content: '';
                        position: absolute;
                        bottom: -10px;
                        left: 50%;
                        width: 42px;
                        height: 2px;
                        margin-left: -22px;
                        border-radius: 2px;
                        border: 1px solid #1a39b8;
                        background-color: #1a39b8;
                    }
                }
                .popMoney {
                    @include flex($justify: flex-start);
                    flex-wrap: wrap;
                    width: 100%;
                    padding: 0 26px 40px;
                    box-sizing: border-box;
                    div {
                        width: 76px;
                        height: 44px;
                        line-height: 44px;
                        margin-right: 20px;
                        font-size: 14px;
                        text-align: center;
                        color: rgba(0, 0, 0, 0.25);
                        border-radius: 5px;
                        border: 1px solid rgba(0, 0, 0, 0.25);
                        transition: all 0.1s;
                        &:nth-child(3n) {
                            margin-right: 0;
                        }
                    }
                    .choose {
                        color: #1a39b8;
                        border-color: #1a39b8;
                    }
                }
                .popBtn {
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    color: #fff;
                    text-align: center;
                    border-radius: 0px 0px 10px 10px;
                    background-color: #1a39b8;
                    @keyframes rotating {
                        from {
                            transform: rotate(0);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                    .icon-jiazai {
                        display: inline-block;
                        animation: rotating 2s linear infinite;
                    }
                }
                .icon-guanbi {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: 12px;
                    padding: 18px;
                }
            }
        }
        .toast {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: max-content;
            width: fit-content;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            margin: auto;
            color: #fff;
            border-radius: 5px;
            letter-spacing: 1px;
            background-color: rgba(18, 18, 18, 0.7);
        }
        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.3s;
        }
        .fade-enter,
        .fade-leave-to {
            opacity: 0;
        }
        .footer {
            @include flex($justify: space-between);
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 82px;
            font-size: 14px;
            background-image: url('https://static-image.dzqqsc.com/footer_bg');
            background-size: cover;
            background-position: center;
            .footer_content {
                margin-left: 18px;
                color: #fff;
                font-weight: bold;
                .logo {
                    height: 16px;
                }
            }
            .footer_join {
                width: 25.1%;
                max-width: 150px;
                // height: 31px;
                line-height: 31px;
                margin-right: 18px;
                text-align: center;
                color: #1a39b8;
                background-color: #fff;
                border-radius: 3px;
                cursor: pointer;
            }
        }
        .iphoneX {
            padding-bottom: 11px;
        }
    }
    .pcClass {
        width: calc(100vw * 800 / 1440);
        min-width: 760px;
        max-width: 1200px;
        margin: 0 auto;
        .content {
            video {
                height: calc((57.4vw - 32px) * 9 / 16);
            }
            @media screen and (max-width: 1366px) {
                video {
                    height: calc((790px - 32px) * 9 / 16);
                }
            }
            @media screen and (min-width: 2160px) {
                video {
                    height: calc((1230px - 32px) * 9 / 16);
                }
            }
        }
        .footer {
            width: calc(100vw * 800 / 1440);
            left: 0;
            right: 0;
            min-width: 760px;
            max-width: 1200px;
            margin: 0 auto;
            font-size: 16px;
            .footer_join {
                // height: 40px;
                line-height: 40px;
            }
        }
    }
</style>
