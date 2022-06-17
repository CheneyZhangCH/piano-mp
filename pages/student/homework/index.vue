<template>
    <view class="page" :style="pageStyle">
        <view class="custom-header" :style="customHeaderStyle">
            <view class="title" :style="customTitleStyle">课后作业</view>
        </view>
        <scroll-view scroll-y="true" class="page-content" @scrolltolower="lower">
            <view v-if="studentScore.accountId" class="panel" :style="panelStyle">
                <view class="student-score">
                    <view class="msg ellipsis">
                        <text>
                            在钢琴童话学习的第
                            <text class="num"> {{ ' ' + studentScore.studyDays + ' ' }} </text>天
                        </text>
                        <text>
                            目前共掌握了
                            <text class="num"> {{
                                    studentScore.studyChapters ? ' ' + studentScore.studyChapters + ' ' : ' - '
                            }} </text>首曲目
                        </text>
                    </view>
                    <view class="infos">
                        <view class="info">
                            <view class="title">
                                课堂数据
                                <image src="/static/images/student/wenhao.png" @click="openMessage('ketang')" />
                            </view>
                            <view class="scores">
                                <view class="score">
                                    <text class="num">{{ studentScore.handScore || '-' }}</text>
                                    <text class="desc">手型平均分</text>
                                </view>
                                <view class="score">
                                    <text class="num">{{ studentScore.musicScore || '-' }}</text>
                                    <text class="desc">识谱平均分</text>
                                </view>
                                <view class="score">
                                    <text class="num">{{ studentScore.attitudeScore || '-' }}</text>
                                    <text class="desc">学习态度分</text>
                                </view>
                            </view>
                        </view>
                        <view class="info">
                            <view class="title">
                                学习数据
                                <image src="/static/images/student/wenhao.png" @click="openMessage('xuexi')" />
                            </view>
                            <view class="scores">
                                <view class="score">
                                    <text class="num">{{ studentScore.finishChapterScore || '-' }}</text>
                                    <text class="desc">回课成绩分</text>
                                </view>
                                <view class="score">
                                    <text class="num">
                                        {{ studentScore.grade ? studentScore.grade + '级' : '-' }}
                                    </text>
                                    <text class="desc">当前级别</text>
                                </view>
                                <view class="score">
                                    <text class="num">{{ lastExamTime }}</text>
                                    <text class="desc">上次考级时间</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="list.length" class="list">
                <view v-for="item in list" :key="item.id" class="item-wrap">
                    <view v-if="firstAgoWeekId === item.id" class="divider">以下为一周前的作业</view>
                    <view class="item" @click="toDetail(item)">
                        <view class="teacher">
                            <view class="info">
                                <image class="cover" :src="item.teacher.coverUrl" />
                                <text class="name">{{ item.teacher.teacherName }}</text>
                                <text class="sub-name">{{ item.courseName }}</text>
                            </view>
                            <text class="sub-name">布置于 {{ agoWeekOrDateTime(item.finishTime) }}</text>
                        </view>
                        <view class="content">
                            <template v-if="item.courseType === 'one'">
                                <view v-if="item.chapterScores && item.chapterScores.length" class="info ellipsis">
                                    <text class="name"
                                        :class="{ 'chinese-of-brackets': isChineseBeginningOfBrackets(item.chapterScores[0].chapterName) }">回课情况</text>
                                    <text class="msg">
                                        <text v-for="score in item.chapterScores" :key="score.id">
                                            {{ score.chapterName }}
                                            <text class="num x"
                                                :class="{ 'chinese-of-brackets': isChineseEndingOfBrackets(score.chapterName) }">{{
                                                        score.score
                                                }}分</text>
                                        </text>
                                    </text>
                                </view>
                                <view class="info ellipsis">
                                    <text class="name">本课表现</text>
                                    <text class="msg">
                                        <text>
                                            手型得分
                                            <text class="num">{{ item.handScore }}分</text>
                                        </text>
                                        <text>
                                            识谱得分
                                            <text class="num">{{ item.musicScore }}分</text>
                                        </text>
                                        <text>
                                            学习态度
                                            <text class="num">{{ item.attitudeScore }}分</text>
                                        </text>
                                    </text>
                                </view>
                                <view class="info ellipsis">
                                    <text class="name">作业详情</text>
                                    <text class="msg">
                                        <text v-for="chapter in item.chapters" :key="chapter.id">
                                            ({{ chapter.bookName }}){{ chapter.chapterName }}
                                        </text>
                                    </text>
                                </view>
                            </template>
                            <template v-else>
                                <view class="info flex">
                                    <text class="name"
                                        :class="{ 'chinese-of-brackets': isChineseBeginningOfBrackets(item.chapters[0].knowledge) }">新知识点</text>
                                    <text class="msg flex-1">{{ item.chapters[0].knowledge }}</text>
                                </view>
                                <view class="info ellipsis">
                                    <text class="name"
                                        :class="{ 'chinese-of-brackets': isChineseBeginningOfBrackets(item.chapters[0].chapterName) }">本课曲目</text>
                                    <text class="msg">{{ item.chapters[0].chapterName }}</text>
                                </view>
                                <view class="info flex homework">
                                    <text class="name">作业详情</text>
                                    <view class="msg flex-1">
                                        <view v-for="(work, workIndex) in item.chapters[0].workStep" :key="workIndex"
                                            class="work flex">
                                            <text>步骤{{ numToChinese[workIndex + 1] }}：</text>
                                            <text class="work-content flex-1">{{ work.content }}</text>
                                        </view>
                                    </view>
                                </view>
                                <view class="info videos">
                                    <text class="name">配套视频</text>
                                    <view class="video">
                                        <image src="https://static.gangqintonghua.com/img/beijing/jiangjieshipin.png"
                                            class="image" />
                                    </view>
                                </view>
                            </template>
                        </view>
                        <view v-if="item.courseType === 'one'" class="action">
                            <text class="read" :class="{ haveRead: item.haveRead }">{{ item.haveRead ? '已读' : '未读'
                            }}</text>
                            <view class="btn">
                                查看课堂报告与作业详情
                                <uni-icons type="right" color="#62bbec" size="12" />
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else class="empty">
                <image src="https://static.gangqintonghua.com/img/kong/kong.png"></image>
            </view>
        </scroll-view>

        <uni-popup ref="message" :is-mask-click="false" type="center">
            <view class="piano-message-box">
                <view class="piano-message-box__content">
                    <template v-if="messageMode === 'ketang'">
                        <view class="text text-center">
                            课堂上老师针对手型、识谱、学习态度
                        </view>
                        <view class="text text-center">
                            打出的分值相加除以打分次数得出的平均值
                        </view>
                    </template>
                    <template v-else>
                        <view class="msg">
                            <text class="label">回课成绩分：</text>
                            <text class="value">由老师针对回课所打出的分值\n相加除以打分次数得出平均值</text>
                        </view>
                        <view class="msg">
                            <text class="label">考级信息：</text>
                            <text class="value">根据学员真实考级数据录入</text>
                        </view>
                    </template>
                </view>
                <view class="piano-message-box__btns">
                    <button class="btn confirm" @click="$refs.message.close()">我知道了</button>
                </view>
            </view>
        </uni-popup>

        <MessageNotify ref="notify" />
        <customTabbar :active="1" />
    </view>
</template>

<script lang="js">
import MessageNotify from '../Components/MessageNotify'
import { numToChinese } from '@/utils/dicts'
import { agoWeekOrDateTime } from '@/utils/format'
import dayjs from 'dayjs'
export default {
    components: {
        MessageNotify
    },
    data() {
        return {
            headerHeight: 0,
            headerTop: 0,

            userId: 0,
            studentId: 0,
            studentScore: {},
            messageMode: '',
            numToChinese,

            pageNum: 1,
            pageSize: 5,
            totalPage: 0,
            list: [],
            firstAgoWeekId: 0
        }
    },
    computed: {
        customHeaderHeight() {
            return (this.headerHeight + this.headerTop + 20) * 2
        },
        pageStyle() {
            return `padding-top: ${this.customHeaderHeight}rpx;`
        },
        customHeaderStyle() {
            return `height: ${this.customHeaderHeight}rpx;`
        },
        customTitleStyle() {
            return `top: ${this.headerTop * 2}rpx; height: ${this.headerHeight * 2}rpx; line-height: ${this.headerHeight * 2}rpx;`
        },
        panelStyle() {
            return `background-position-y: -${this.customHeaderHeight}rpx;`
        },

        lastExamTime() {
            return [this.studentScore?.lastExamTime, this.studentScore?.examSeason].filter(Boolean).join(' | ') || '-'
        },
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')
        const userId = uni.getStorageSync('userId')

        // 权限验证
        if (!token) {
            uni.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.userId = userId
        if (option?.studentId && +option.studentId !== userId) return uni.navigateTo({ url: '/pages/login/index' })

        let rect = wx.getMenuButtonBoundingClientRect()
        this.headerHeight = rect.height
        this.headerTop = rect.top
    },
    onShow() {
        this.firstAgoWeekId = 0
        this.pageNum = 1
        this.list = []
        this.init()
        this.handleSearch()
        this.$refs.notify.getMsgCount()
    },
    methods: {
        agoWeekOrDateTime,
        // 是否以中文（《【（）开头或结尾
        isChineseBeginningOfBrackets: text => text && /^[《【（]/.test(text),
        isChineseEndingOfBrackets: text => text && /[》】）]$/.test(text),
        async init() {
            uni.showLoading({ title: '加载中', icon: 'none' })
            try {
                const res = await this.$http.get('/mini/student/getStudentScore?studentId=' + this.userId)
                this.studentScore = res.data ?? {}

                const countUnreadStudentWorkRes = await this.$http.get('/mini/finishiLesson/countUnreadStudentWork')
                this.$store.dispatch('accountBusinessCount/setTabbarDot', {
                    key: 'homework',
                    dotFlag: countUnreadStudentWorkRes.data > 0
                })
            } finally {
                uni.hideLoading()
            }
        },

        async handleSearch() {
            uni.showLoading({ title: '加载中', icon: 'none' })
            const param = {
                page: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                },
                param: {
                    studentId: this.userId
                }
            }
            try {
                const res = await this.$http.post('/mini/finishiLesson/pageStudentWork', param)
                const { data, totalPage } = res.data ?? {}
                if (data?.length && !this.firstAgoWeekId) {
                    for (let i = 0; i < data.length; i++) {
                        if (Math.ceil((new Date(dayjs().format('YYYY/MM/DD 00:00:00')).getTime() - data[i].finishTime) / (24 * 60 * 60 * 1000)) >= 7) {
                            this.firstAgoWeekId = data[i].id
                            break
                        }
                    }
                }
                this.totalPage = totalPage ?? 0
                this.list = this.list.concat(data ?? [])
            } finally {
                uni.hideLoading()
            }
        },

        lower() {
            if (this.pageNum >= this.totalPage) return
            this.pageNum++
            this.handleSearch()
        },

        toDetail(item) {
            if (item.courseType === 'one') {
                uni.navigateTo({ url: `/pages/student/homeworkDetail/index?id=${item.id}` })
            } else {
                const { chapterId } = item.chapters[0]
                uni.navigateTo({ url: `/pages/student/videos/chapter?id=${chapterId}` })
            }
        },

        openMessage(mode) {
            this.messageMode = mode
            this.$refs.message.open()
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    padding-bottom: 100rpx;
    padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
    overflow: hidden;
    box-sizing: border-box;

    .custom-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);

        .title {
            position: absolute;
            width: 100%;
            z-index: 1;
            text-align: center;
            font-size: 32rpx;
            font-weight: 600;
            color: #fff;
        }
    }

    &-content {
        position: relative;
        z-index: 1;
        height: 100%;

        .panel {
            background-image: url("https://static.gangqintonghua.com/img/beijing/zhongxin.png?imageView2/0/w/375");
            background-size: 100%;
            background-repeat: no-repeat;
        }

        .student-score {
            margin: 0 24rpx;
            height: 478rpx;
            background-image: url("https://static.gangqintonghua.com/img/beijing/banji.png");
            background-repeat: no-repeat;
            background-size: 100%;

            padding: 52rpx 40rpx 0; // 46rpx->52rpx

            .msg {
                font-size: 24rpx;
                color: #141f33;
                line-height: 34rpx;
                margin-bottom: 60rpx;
                text-align: center;

                .num {
                    font-size: 28rpx;
                    color: #62bbec;
                    font-weight: 600;
                }

                >text {
                    +text {
                        margin-left: 40rpx;
                    }
                }
            }

            .infos {
                .info {
                    +.info {
                        margin-top: 30rpx;
                    }

                    .title {
                        display: flex;
                        align-items: center;
                        font-size: 28rpx;
                        font-weight: 600;
                        color: #141f33;
                        line-height: 40rpx;
                        margin-bottom: 20rpx;

                        image {
                            width: 20rpx;
                            height: 20rpx;
                            margin-left: 8rpx;
                        }
                    }

                    .scores {
                        display: flex;

                        .score {
                            display: flex;
                            flex-direction: column;
                            flex: 1;
                            text-align: center;

                            .num {
                                font-size: 28rpx;
                                font-weight: 600;
                                color: #141f33;
                                line-height: 40rpx;
                                margin-bottom: 2rpx;
                            }

                            .desc {
                                font-size: 24rpx;
                                color: #99a0ad;
                                line-height: 34rpx;
                            }
                        }
                    }
                }
            }
        }

        .list {
            padding: 34rpx 30rpx;

            .item-wrap {
                &:not(:last-child) {
                    margin-bottom: 36rpx;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24rpx;
                    color: #C9CED6;
                    line-height: 34rpx;
                    margin-bottom: 36rpx;

                    &::before,
                    &::after {
                        content: " ";
                        flex: 1;
                        height: 2rpx;
                        background: #E3E5E9;
                    }

                    &::before {
                        margin-right: 16rpx;
                    }

                    &::after {
                        margin-left: 16rpx;
                    }
                }
            }

            .item {
                background: #ffffff;
                border-radius: 20rpx;

                .teacher {
                    padding: 16rpx 32rpx;
                    border-bottom: 1px solid #f5f7fa;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .info {
                        flex: 1;
                        display: flex;
                        align-items: center;

                        .cover {
                            width: 60rpx;
                            height: 60rpx;
                            border-radius: 50%;
                            margin-right: 16rpx;
                        }

                        .name {
                            font-size: 28rpx;
                            color: #141f33;
                            margin-right: 16rpx;
                        }
                    }

                    .sub-name {
                        font-size: 24rpx;
                        color: #99a0ad;
                    }
                }

                .content {
                    padding: 20rpx 32rpx;

                    .info {
                        font-size: 24rpx;
                        line-height: 34rpx;

                        +.info {
                            margin-top: 16rpx;
                        }

                        .name {
                            color: #99a0ad;
                            margin-right: 56rpx;

                            &.chinese-of-brackets {
                                margin-right: 48rpx;
                            }
                        }

                        .msg {
                            color: #525666;

                            .num {
                                font-weight: 600;
                                color: #62bbec;
                                margin: 0 16rpx 0 8rpx;
                                &.chinese-of-brackets {
                                    margin-left: 4rpx;
                                }
                            }
                        }

                        &.homework {

                            .work {
                                font-size: 24rpx;
                                color: #525666;
                                line-height: 34rpx;

                                +.work {
                                    margin-top: 10rpx;
                                }

                                &-content {
                                    font-weight: 600;
                                    color: #62bbec;
                                    margin-left: 12rpx;
                                }
                            }
                        }

                        &.videos {
                            display: flex;
                            line-height: 36rpx;

                            .video {
                                display: flex;
                                align-items: center;

                                .image {
                                    width: 296rpx;
                                    height: 24rpx;
                                }
                            }
                        }
                    }
                }

                .action {
                    padding: 14rpx 32rpx 16rpx;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .read {
                        font-size: 24rpx;
                        color: #f15e5e;
                        line-height: 34rpx;

                        &.haveRead {
                            color: #3eb156;
                        }
                    }

                    .btn {
                        display: flex;
                        align-items: center;

                        font-size: 24rpx;
                        color: #62bbec;
                        line-height: 34rpx;
                    }
                }
            }
        }

        .empty {
            margin-top: 120rpx;
            text-align: center;

            image {
                width: 328rpx;
                height: 420rpx;
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.piano-message-box {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;

    &___header {
        padding: 22rpx 0;
        text-align: center;
    }

    &__content {
        padding: 60rpx 32rpx 36rpx;

        .msg {
            display: flex;

            .label {
                flex-basis: 170rpx;
            }

            .value {
                flex: 1;
                overflow: hidden;
            }

            +.msg {
                margin-top: 12rpx;
            }
        }

        .text,
        .msg {
            font-size: 28rpx;
            color: #99a0ad;
            line-height: 40rpx;
        }
    }

    &__btns {
        display: flex;
        column-gap: 48rpx;
        padding: 32rpx 48rpx;
        box-shadow: 0px -4rpx 8rpx 0px rgba(0, 0, 0, 0.05);

        .btn {
            flex: 1;
            height: 72rpx;
            padding: 0 56rpx;
            font-size: 32rpx;
            font-weight: 600;
            line-height: 72rpx;
            border-radius: 44rpx;
            color: #fff;
            background: linear-gradient(90deg, #61baec 0%, #84daee 100%);

            &::after {
                display: none;
            }
        }
    }
}
</style>
