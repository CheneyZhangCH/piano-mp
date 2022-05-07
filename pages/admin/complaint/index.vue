<template>
    <view class="page common">
        <view class="page-header">
            <view class="student">
                <image class="cover" :src="getStudentCoverUrl(student)" />
                <text class="name">{{ student.studentName }}</text>
            </view>
            <view class="btn" @click="openStudent">
                学员详情
                <uni-icons type="right" color="#99A0AD" size="14" />
            </view>
        </view>
        <view class="page-content">
            <view class="complaint-info">
                <view class="complaint-info-header">
                    <text class="type">{{ dicts.complaintType[detail.complaintType] }}</text>
                    <text class="time">{{ todayOrYesterdayOrDateFormat(detail.createTime) }}</text>
                </view>
                <view class="complaint-info-content">
                    <view class="infos">
                        <view class="info">
                            <template
                                v-if="detail.complaintType === 'finishLesson' && detail.finishLesson"
                            >
                                <view
                                    class="content-2 mb-16"
                                >{{ detail.finishLesson | chapterNames }}</view>
                                <view class="content mb-16">{{ detail.finishLesson | finishTime }}</view>
                                <view
                                    v-if="detail.finishLesson.courseType === 'one'"
                                    class="scores content mb-16"
                                >
                                    <text>手型评分:{{ detail.finishLesson.handScore || 0 }}分</text>
                                    <text>识谱评分:{{ detail.finishLesson.musicScore || 0 }}分</text>
                                    <text>学习态度:{{ detail.finishLesson.attitudeScore || 0 }}分</text>
                                </view>
                            </template>
                            <view v-else class="content-2">投诉原因：{{ detail.complaintReason }}</view>

                            <view class="content">投诉详情：{{ detail.content }}</view>
                        </view>
                        <view
                            v-if="detail.complaintType === 'finishLesson' && detail.finishLesson"
                            class="teacher"
                        >
                            <image class="cover" :src="detail.finishLesson.teacher.coverUrl" />
                            <text class="name">{{ detail.finishLesson.teacher.teacherName }}</text>
                        </view>
                    </view>
                    <view v-if="detail.imgUrls.length" class="imgs">
                        <image
                            class="img"
                            v-for="url in detail.imgUrls"
                            :key="url"
                            :src="url"
                            @click="preview(url, detail.imgUrls)"
                        />
                    </view>
                </view>
            </view>
            <view class="complaint-form">
                <view class="status">
                    <text class="text">请选择处理结果：</text>
                    <view class="radio">
                        <view
                            v-for="(label, value) in dicts.dealComplaint_status"
                            :key="value"
                            class="radio-item"
                            @click="form.status = value"
                        >
                            <image
                                :src="`/static/images/student/icon-radio${form.status === value ? '-active' : ''}.png`"
                            />
                            <text class="text">{{ label }}</text>
                        </view>
                    </view>
                </view>
                <view class="content">
                    <van-field
                        class="textarea"
                        :value="form.dealContent"
                        type="textarea"
                        placeholder="请填写回执(限20字)"
                        placeholder-style="color: #99A0AD;font-size: 24rpx;"
                        maxlength="20"
                        @input="e => form.dealContent = e.detail"
                    />
                </view>
            </view>
        </view>
        <view class="page-footer">
            <button
                class="btn"
                :class="{ confirm: !disabled, disabled }"
                :disabled="disabled"
                @click="confirm"
            >确认</button>
        </view>

        <Student :student-id="studentId" @close="studentId = 0" @refresh="back"/>
    </view>
</template>

<script>
import Student from '@/components/Student'
import dicts from '@/utils/dicts'
import { todayOrYesterdayOrDateFormat, dayWeekTime } from '@/utils/format'
export default {
    components: {
        Student
    },
    filters: {
        finishTime({ finishTime }) {
            return dayWeekTime(finishTime)?.filter(Boolean).join(' ')
        },
        chapterNames({ chapters }) {
            return chapters?.map(item => item.chapterName)?.join('、')
        }
    },
    data() {
        return {
            dicts,
            complaintId: 0,
            detail: {},
            form: {
                dealContent: '',
                status: '' // 处理状态,可用值:deal,not_deal
            },
            studentId: 0
        }
    },
    computed: {
        student() {
            return this.detail?.student ?? {}
        },
        disabled() {
            const { dealContent, status } = this.form
            return !status || !dealContent
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.complaintId = option.id ?? 0
        this.init()
    },
    methods: {
        todayOrYesterdayOrDateFormat,
        async init() {
            try {
                const res = await this.$http.get(`/mini/studentComplaint/getStudentComplaintVo?id=${this.complaintId}`)
                this.detail = res.data ?? {}
            } catch (error) {
                console.log(error)
            }
        },

        preview(current, urls) {
            wx.previewImage({
                current,
                urls
            })
        },

        openStudent() {
            this.studentId = this.student.studentId
        },

        async confirm() {
            if (this.loading) return
            this.loading = true

            const param = {
                data: {
                    ...this.form,
                    id: this.complaintId
                }
            }
            try {
                await this.$http.post('/mini/studentComplaint/dealComplaint', param)
                uni.showToast({
                    title: '处理成功！',
                    icon: 'success',
                })
                this.back()
            } finally {
                this.loading = false
            }
        },

        back() {
            uni.navigateBack({ delta: 1 })
        }
    }
}
</script>

<style lang="scss" scoped>
.mb-16 {
    margin-bottom: 16rpx;
}
.page {
    min-height: 100vh;
    background-color: #ffffff;
    &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        box-shadow: 0px 0px 12rpx 0px #e3e5e9;
        padding: 16rpx 40rpx 16rpx 72rpx;
        .student {
            display: flex;
            align-items: center;
            .cover {
                width: 56rpx;
                height: 56rpx;
                border-radius: 50%;
                margin-right: 26rpx;
            }
            .name {
                font-size: 28rpx;
                color: #141f33;
            }
        }
        .btn {
            font-size: 28rpx;
            color: #99a0ad;
        }
    }
    &-content {
        padding: 40rpx 30rpx;
        .complaint-info {
            background-color: #f5f7fa;
            border-radius: 20rpx;
            padding: 16rpx 20rpx;
            margin-bottom: 180rpx;
            &-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 40rpx;
                .type {
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #141f33;
                }
                .time {
                    font-size: 20rpx;
                    color: #99a0ad;
                }
            }
            .infos {
                display: flex;
                justify-content: space-between;
                padding-bottom: 20rpx;
                .info {
                    flex: 1;
                    .scores {
                        text + text {
                            margin-left: 16rpx;
                        }
                    }
                    .reason {
                        margin-bottom: 14rpx;
                    }
                    .content {
                        font-size: 20rpx;
                        color: #99a0ad;
                        line-height: 28rpx;
                    }
                    .content-2 {
                        font-size: 24rpx;
                        font-weight: 500;
                        color: #99a0ad;
                        line-height: 34rpx;
                    }
                }
                .teacher {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    margin-left: 20rpx;
                    .cover {
                        width: 40rpx;
                        height: 40rpx;
                        border-radius: 50%;
                        margin-bottom: 2rpx;
                    }
                    .name {
                        font-size: 20rpx;
                        color: #99a0ad;
                        line-height: 28rpx;
                    }
                }
            }
            .imgs {
                display: flex;
                flex-wrap: wrap;
                column-gap: 12rpx;
                padding-top: 4rpx;
                .img {
                    width: 98rpx;
                    height: 98rpx;
                    border-radius: 12rpx;
                }
            }
        }
        .complaint-form {
            padding: 0 20rpx;
            .status {
                margin-bottom: 20rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .radio {
                    display: flex;
                    .radio-item {
                        display: flex;
                        align-items: center;
                        + .radio-item {
                            margin-left: 80rpx;
                        }
                    }

                    image {
                        width: 28rpx;
                        height: 28rpx;
                        margin-right: 14rpx;
                    }
                    .text {
                        font-size: 28rpx;
                        font-weight: 500;
                        color: #141f33;
                        line-height: 40rpx;
                    }
                }
            }

            .textarea {
                /deep/.van-cell {
                    padding: 0;
                }
                /deep/.van-field__body {
                    width: 100%;
                    background: #f5f7fa;
                    border-radius: 16rpx;
                    border: none;
                    padding: 20rpx;

                    font-size: 24rpx;
                    font-weight: 500;
                    color: #141f33;
                    line-height: 34rpx;
                    box-sizing: border-box;
                }
            }
        }
    }
}
</style>
