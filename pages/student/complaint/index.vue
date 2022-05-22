<template>
    <view class="page common">
        <view class="page-content">
            <view v-if="finishLessonId" class="block">
                <view class="title">已选申诉课程</view>
                <view class="content finishLesson">
                    <view class="info">
                        <view
                            v-for="chapter in finishLesson.chapters"
                            :key="chapter.id"
                            class="chapter"
                        >{{ chapter.chapterName }}</view>
                        <view class="time text">{{ finishLesson | finishTime }}</view>
                        <view v-if="finishLesson.courseType === 'one'" class="scores text">
                            <text>手型评分:{{ finishLesson.handScore || 0 }}分</text>
                            <text>识谱评分:{{ finishLesson.musicScore || 0 }}分</text>
                            <text>学习态度:{{ finishLesson.attitudeScore || 0 }}分</text>
                        </view>
                    </view>
                    <view class="teacher">
                        <image class="cover" :src="finishLesson.teacher.coverUrl" />
                        <text class="name">{{ finishLesson.teacher.teacherName }}</text>
                    </view>
                </view>
            </view>
            <view v-else class="block">
                <view class="title">
                    选择原因
                    <text>*</text>
                </view>
                <view class="content reasons">
                    <view
                        v-for="item in complaintReasons"
                        :key="item.id"
                        class="reasons-item"
                        @click="onSelect(item)"
                    >
                        <text>{{ item.dictName }}</text>
                        <image
                            :src="`/static/images/student/icon-radio${form.complaintReasonId === item.id ? '-active' : ''}.png`"
                        />
                    </view>
                </view>
            </view>
            <view class="block">
                <view class="title">
                    {{ finishLessonId ? '申诉详情' : '投诉详情' }}
                    <text>*</text>
                </view>
                <view class="content">
                    <van-field
                        class="textarea"
                        :value="form.content"
                        type="textarea"
                        placeholder="请填写您的具体投诉原因"
                        placeholder-style="color: #99A0AD;font-size: 24rpx;"
                        maxlength="200"
                        show-word-limit
                        @input="e => form.content = e.detail"
                    />
                    <view class="upload">
                        <view class="label">
                            <text>上传图片凭证</text>
                            <text class="sub-tit">（最多可上传4张）</text>
                        </view>
                        <view class="imgs">
                            <view
                                v-for="(img, index) in form.imgUrls"
                                :key="img"
                                class="img"
                            >
                                <image :src="img" class="upload-item" />
                                <image
                                    class="del"
                                    src="/static/images/student/cha.png"
                                    @click="del(index)"
                                />
                            </view>
                            <image
                                v-if="form.imgUrls.length < 4"
                                src="/static/images/student/upload.png"
                                class="img upload-add"
                                @click="upload"
                            />
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="page-footer">
            <button
                class="btn"
                :class="{ confirm: !disabled, disabled }"
                :disabled="disabled"
                @click="confirm"
            >确定</button>
        </view>
    </view>
</template>

<script lang="js">
import { dayWeekTime } from '@/utils/format'
export default {
    options: {
        styleIsolation: 'shared'
    },
    filters: {
        finishTime({ finishTime }) {
            const r = dayWeekTime(finishTime)
            return r.length ? r.join(' ') : ''
        }
    },
    data() {
        return {
            finishLessonId: 0, // finishLessonId存在表示课时申诉，否则匿名投诉
            finishLesson: {},

            complaintReasons: [],
            form: {
                complaintReason: '',
                complaintReasonId: '',
                content: '',
                imgUrls: []
            }
        }
    },
    computed: {
        disabled() {
            const { complaintReasonId, content } = this.form
            return !content || (!this.finishLessonId && !complaintReasonId)
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        if (option?.studentId) {
            const userId = uni.getStorageSync('userId')
            if (+option.studentId !== userId) return uni.navigateTo({ url: '/pages/login/index' })
        }
        if (option?.finishLessonId) {
            this.finishLessonId = option.finishLessonId
            uni.setNavigationBarTitle({
                title: '课时申诉'
            });
        }
        this.init()
    },
    methods: {
        async init() {
            try {
                if (!this.finishLessonId) {
                    // 投诉原因
                    const res = await this.$http.get('/mini/studentComplaint/getComplaintReason')
                    this.complaintReasons = res.data ?? []
                } else {
                    const res = await this.$http.get('/mini/finishiLesson/getFinishLesson?id=' + this.finishLessonId)
                    this.finishLesson = res.data ?? {}
                }

            } catch (error) {
                console.log(error)
            }
        },

        onSelect({ id, dictName }) {
            if (this.form.complaintReasonId === id) return
            this.$set(this.form, 'complaintReason', dictName)
            this.$set(this.form, 'complaintReasonId', id)
        },

        upload() {
            const that = this
            wx.chooseImage({
                count: 4,
                type: 'image',
                success(res) {
                    for (let i = 0; i < res.tempFilePaths.length; i++) {
                        wx.getFileSystemManager().readFile({
                            filePath: res.tempFilePaths[i], //选择图片返回的相对路径
                            encoding: 'base64', //编码格式
                            success: async res => { //成功的回调
                                try {
                                    const r = await that.$http.post('/qiniu/upload', {
                                        data: {
                                            fileData: res.data,
                                            fileName: Date.now()
                                        }
                                    })
                                    if (!r.data) return
                                    that.form.imgUrls.push(r.data)
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                        })
                    }
                    //let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64')
                    //console.log(base64)
                }
            })
        },

        del(index) {
            this.form.imgUrls.splice(index, 1)
        },

        async confirm() {
            const { complaintReason, complaintReasonId, content, imgUrls } = this.form
            const param = {
                data: {
                    ...(this.finishLessonId ? {
                        finishLessonId: this.finishLessonId,
                    } : {
                        complaintReason,
                        complaintReasonId
                    }),
                    content,
                    imgUrls
                }
            }
            try {
                await this.$http.post('/mini/studentComplaint/addComplaint', param)
                this.$toast({
                    title: this.finishLessonId ? '申诉成功！' : '投诉成功！',
                    icon: 'success'
                })
                uni.redirectTo({ url: '/pages/success/index?from=complaint' })
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #fff;
    &-content {
        padding: 0 30rpx;
        padding-top: 54rpx;
        .block {
            + .block {
                margin-top: 30rpx;
            }
            .title {
                font-size: 28rpx;
                font-weight: 600;
                color: #141f33;
                line-height: 40rpx;
                margin-bottom: 20rpx;
                text {
                    color: #f15e5e;
                }
            }
            .content {
                background: #fff;
                box-shadow: 0px 0px 12rpx 0px #e3e5e9;
                border-radius: 20rpx;
                padding: 30rpx;
            }
            .reasons {
                &-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    + .reasons-item {
                        margin-top: 36rpx;
                    }
                    text {
                        flex: 1;
                        font-size: 24rpx;
                        color: #141f33;
                        line-height: 34rpx;
                    }
                    image {
                        width: 32rpx;
                        height: 32rpx;
                        margin-left: 20rpx;
                    }
                }
            }
            .finishLesson {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .info {
                    .chapter {
                        font-size: 28rpx;
                        font-weight: 600;
                        color: #141f33;
                        line-height: 40rpx;
                        + .chapter {
                            margin-top: 16rpx;
                        }
                    }
                    .time {
                        margin: 10rpx 0;
                    }
                    .text {
                        font-size: 24rpx;
                        color: #99a0ad;
                        line-height: 34rpx;
                    }
                    .scores {
                        text + text {
                            margin-left: 16rpx;
                        }
                    }
                }
                .teacher {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    margin-left: 16rpx;
                    .cover {
                        width: 44rpx;
                        height: 44rpx;
                        border-radius: 50%;
                        margin-bottom: 2rpx;
                    }
                    .name {
                        font-size: 24rpx;
                        color: #616b80;
                        line-height: 34rpx;
                    }
                }
            }

            .textarea {
                /deep/.van-cell {
                    padding: 20rpx;
                    background: #f5f7fa;
                    border-radius: 16rpx;
                    height: 216rpx;
                    box-sizing: border-box;
                }
                /deep/ .van-field__body--textarea {
                    padding: 0;
                }
                /deep/.van-field__control {
                    height: 138rpx;
                    border: none;
                    font-size: 24rpx;
                    color: #141f33;
                }
            }
            .upload {
                .label {
                    display: flex;
                    align-items: center;

                    font-size: 24rpx;
                    color: #141f33;
                    line-height: 34rpx;
                    margin: 30rpx 0;
                    .sub-title {
                        color: #99a0ad;
                    }
                }
                .imgs {
                    display: flex;
                    column-gap: 16rpx;
                    .img {
                        width: 100rpx;
                        height: 100rpx;
                        border-radius: 12rpx;
                        position: relative;
                        .upload-item {
                            width: 100%;
                            height: 100%;
                        }
                        .del {
                            position: absolute;
                            width: 28rpx;
                            height: 28rpx;
                            top: -10rpx;
                            right: -10rpx;
                        }
                    }
                }
            }
        }
    }
}
</style>
