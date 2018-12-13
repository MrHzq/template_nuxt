<template>
    <div class="article" :class="{ pcClass: isPC }">
        <!-- 标题 -->
        <div class="title">{{ articleInfo.title }}</div>
        <!-- 用户信息 -->
        <div class="userInfo">
            <a class="left" :href="'xktapp://user/'+articleInfo.user_id">
                <p class="userImg" :style="{
                        backgroundImage: 'url('+articleInfo.avatar+'?imageView2/1/w/30/h/30)'
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
        <div class="reward" v-if="awardData">
            <div class="avatar" :style="{
                    backgroundImage: 'url('+articleInfo.avatar+'?imageView2/1/w/50/h/50)'
            }"></div>
            <div class="like" @click="showPopup">喜欢作者</div>
            <div class="likeNum" v-if="awardData.num">
                <div class="line"></div>
                <div class="num">{{ awardData.num }}人喜欢</div>
                <div class="line"></div>
            </div>
            <div class="likeUser">
                <a v-for="i in awardData.list" :key="i.user_id" :href="'xktapp://user/'+i.user_id" :style="{
                        backgroundImage:'url('+i.avatar+'?imageView2/1/w/30/h/30)'
                }"></a>
            </div>
        </div>
        <!-- 打赏金额弹窗 -->
        <transition name="fade">
            <div class="rewardPopup" v-if="popup" @click.self="closePopup">
                <div class="popupContent">
                    <div class="popTitle">喜欢作者</div>
                    <div class="popMoney">
                        <div v-for="(i, index) in money" :key="i" :class="{ choose: index === price }" @click="price = index"> {{ i }} </div>
                    </div>
                    <div class="popBtn" @click="rewardFun">确认打赏</div>
                    <i class="iconfont icon-guanbi" @click="closePopup"></i>
                </div>
            </div>
        </transition>
        <!-- toast文字提示 -->
        <transition name="fade">
            <div class="toast" v-if="toast">{{toast}}</div>
        </transition>
        <!-- 底部 banner -->
        <a class="footer" :class="{ iphoneX: !isPC && isX }" v-if="isWeb" href="https://www.xkt.one">
            <div class="footer_content">
                <img class="logo" src="https://static-image.dzqqsc.com/footer_logo.png?imageView2/1/w/72/h/72" alt="logo" />
                <div class="text">
                    <span>小空头</span>
                    <span class="line"></span>
                    <span>专业的数字资产交易社区</span>
                </div>
                <div class="join">立即加入</div>
            </div>
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
                toast: ''
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
            // 打赏
            rewardFun() {
                if (this.price === -1) {
                    this.toastFun('请选择打赏金额~')
                    return
                }
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
                    .then(res => {
                        if (res.code === 0) {
                            this.closePopup()
                            this.$api.articleAwardList({ article_id }).then(res => {
                                if (res.code === 0) {
                                    this.awardData = res.data
                                    this.toastFun('谢谢你的打赏~')
                                }
                            })
                        } else if (res.code === 99999) {
                            this.closePopup()
                            this.toastFun(res.msg)
                        } else if (res.code === 90040) {
                            this.toastFun('余额不足')
                        }
                    })
                    .catch(e => this.toastFun('网络错误，请稍后重试'))
            },
            // toast文字提示
            toastFun(toast) {
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
            // 获取打赏信息
            const _res = await c.app.$api.articleAwardList({
                article_id: c.params.id
            })
            // 获取文章信息
            const { data } = await c.app.$api.getArticleContent({
                a: 'h5',
                article_id: c.params.id
            })
            data.created_time = c.app.$tool.formatDate(
                data.created_time * 1000,
                'YYYY.MM.DD HH:mm'
            )
            data.content = data.content.replace(/”/g, '" ')
            data.content = data.content.replace(/“/g, ' "')
            data.content = data.content.replace(/<br>/g, '')
            if (!isPC) {
                data.content = data.content.replace(/<img/g, '<img preview="1"')
            }
            let token = c.query.token || ''
            return {
                isX,
                isPC,
                articleInfo: data,
                awardData: _res.data,
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
        }
        .title {
            padding-top: 24px;
            font-size: 24px;
            font-weight: bold;
            color: #333333;
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
                margin: 16px 0;
                margin-left: 20px;
                line-height: 34px;
            }
            a {
                color: #1fa1f4;
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
            padding: 80px 0 120px;
            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
            }
            .like {
                width: 150px;
                height: 40px;
                line-height: 40px;
                margin: 20px 0;
                color: #fff;
                font-size: 14px;
                text-align: center;
                border-radius: 40px;
                background-color: #1fa1f4;
                cursor: pointer;
            }
            .likeNum {
                @include flex();
                width: 250px;
                margin-bottom: 15px;
                color: #aaa;
                .line {
                    flex: 1;
                    height: 1px;
                    background-color: #aaa;
                }
                .num {
                    padding: 0 20px;
                }
            }
            .likeUser {
                @include flex();
                width: 60%;
                a {
                    width: 30px;
                    height: 30px;
                    margin-bottom: 10px;
                    margin-right: 10px;
                    border-radius: 50%;
                    background-size: cover;
                    background-position: center;
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
            background-color: rgba(0, 0, 0, 0.7);
            .popupContent {
                position: relative;
                @include flex($direction: column);
                width: 70%;
                padding: 20px 15px;
                text-align: center;
                border-radius: 10px;
                background-color: #fff;
                .popTitle {
                    position: relative;
                    margin-bottom: 15px;
                    &::after {
                        content: '';
                        position: absolute;
                        bottom: -15px;
                        left: 25%;
                        width: 50%;
                        height: 2px;
                        background-color: #1fa1f4;
                    }
                }
                .popMoney {
                    @include flex($justify: flex-start);
                    flex-wrap: wrap;
                    width: 100%;
                    margin: 40px 0;
                    div {
                        width: 30%;
                        height: 45px;
                        margin-right: 5%;
                        margin-bottom: 5%;
                        text-align: center;
                        line-height: 45px;
                        color: #aaa;
                        border: 1px solid #aaa;
                        box-sizing: border-box;
                        border-radius: 5px;
                        &:nth-child(n) {
                            margin-bottom: 0;
                        }
                        &:nth-child(3n) {
                            margin-right: 0;
                        }
                    }
                    .choose {
                        color: #1fa1f4;
                        border-color: #1fa1f4;
                    }
                }
                .popBtn {
                    width: 80%;
                    height: 40px;
                    line-height: 40px;
                    color: #fff;
                    font-size: 14px;
                    text-align: center;
                    border-radius: 10px;
                    background-color: #1fa1f4;
                }
                .icon-guanbi {
                    position: absolute;
                    top: 22px;
                    right: 15px;
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
            transition: opacity 0.5s;
        }
        .fade-enter,
        .fade-leave-to {
            opacity: 0;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background-image: url('https://static-image.dzqqsc.com/footer_bg.png');
            background-size: cover;
            background-position: center;
            font-size: 14px;
            .footer_content {
                @include flex($justify: space-between);
                height: 60px;
                margin: 0 16px;
                .logo {
                    height: 36px;
                }
                .text {
                    @include flex();
                    color: #fff;
                    font-weight: bold;
                    font-size: 0;
                    span {
                        font-size: 14px;
                    }
                    .line {
                        width: 1px;
                        height: 11px;
                        margin: 0 3px;
                        background-color: #fff;
                    }
                }
                .join {
                    width: 25.1%;
                    max-width: 150px;
                    height: 31px;
                    line-height: 31px;
                    text-align: center;
                    color: #1fa1f4;
                    background-color: #fff;
                    border-radius: 31px;
                }
            }
        }
        .iphoneX {
            padding-bottom: 21px;
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
            .footer_content {
                .text {
                    span {
                        font-size: 16px;
                    }
                    .line {
                        width: 2px;
                        height: 16px;
                    }
                }
                .join {
                    height: 40px;
                    line-height: 40px;
                    font-size: 16px;
                }
            }
        }
    }
</style>
