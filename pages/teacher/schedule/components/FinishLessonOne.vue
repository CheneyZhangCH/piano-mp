<template>
    <view>
        <uni-popup
            v-if="detail.timetablePeriodId"
            ref="popup"
            :is-mask-click="false"
            type="center"
        >
            <view class="main">
                <view class="header">
                    {{ title }}
                </view>
                <view class="content">
                    <view class="form-item">
                        <view class="label">回课情况</view>
                        <view class="value rate">
                            <view
                                v-for="(item, index) in form.chapterScores"
                                :key="item.chapterId"
                                class="rate-item"
                            >
                                <text class="name ellipsis">《{{ item.chapterName }}》</text>
                                <view class="rate-wrap">
                                    <van-rate
                                        v-model="item.chapterScore"
                                        color="#62BBEC"
                                        void-color="#D8D8D8"
                                        gutter="4rpx"
                                        size="36rpx"
                                        @change="
                                            (e) =>
                                                $set(
                                                    form.chapterScores[index],
                                                    'chapterScore',
                                                    e.detail
                                                )
                                        "
                                    />
                                    <text v-if="item.chapterScore > 0" class="score">{{item.chapterScore * 2}}分</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="form-item">
                        <view class="label">本课内容</view>
                    </view>
                    <view class="form-item slider">
                        <view class="label"
                            >手型评分<text
                                v-if="form.handScore > 0"
                                class="score"
                                >{{ form.handScore }}分</text
                            ></view
                        >
                        <view class="value">
                            <van-slider
                                v-model="form.handScore"
                                use-button-slot
                                max="10"
                                active-color="#62BBEC"
                                bar-height="10rpx"
                                @change="(e) => (form.handScore = e.detail)"
                            >
                                <image
                                    slot="button"
                                    :src="`/static/images/teacher/score-icon${
                                        form.handScore > 0 ? '-blue' : ''
                                    }.png`"
                                    style="width: 28rpx; height: 36rpx"
                                />
                            </van-slider>
                        </view>
                        <view class="desc">
                            <text>很差</text><text>还行</text><text>极好</text>
                        </view>
                    </view>
                    <view class="form-item slider">
                        <view class="label"
                            >识谱评分<text
                                v-if="form.musicScore > 0"
                                class="score"
                                >{{ form.musicScore }}分</text
                            ></view
                        >
                        <view class="value">
                            <van-slider
                                v-model="form.musicScore"
                                use-button-slot
                                max="10"
                                active-color="#62BBEC"
                                bar-height="10rpx"
                                @change="(e) => (form.musicScore = e.detail)"
                            >
                                <image
                                    slot="button"
                                    :src="`/static/images/teacher/score-icon${
                                        form.musicScore > 0 ? '-blue' : ''
                                    }.png`"
                                    style="width: 28rpx; height: 36rpx"
                                />
                            </van-slider>
                        </view>
                        <view class="desc">
                            <text>很差</text><text>还行</text><text>极好</text>
                        </view>
                    </view>
                    <view class="form-item slider">
                        <view class="label"
                            >学习态度<text
                                v-if="form.attitudeScore > 0"
                                class="score"
                                >{{ form.attitudeScore }}分</text
                            ></view
                        >
                        <view class="value">
                            <van-slider
                                v-model="form.attitudeScore"
                                use-button-slot
                                max="10"
                                active-color="#62BBEC"
                                bar-height="10rpx"
                                @change="(e) => (form.attitudeScore = e.detail)"
                            >
                                <image
                                    slot="button"
                                    :src="`/static/images/teacher/score-icon${
                                        form.attitudeScore > 0 ? '-blue' : ''
                                    }.png`"
                                    style="width: 28rpx; height: 36rpx"
                                />
                            </van-slider>
                        </view>
                        <view class="desc">
                            <text>很差</text><text>还行</text><text>极好</text>
                        </view>
                    </view>
                </view>
                <view class="footer">
                    <button class="btn cancel" @click="$refs.popup.close()">
                        取消
                    </button>
                    <button
                        class="btn confirm"
                        :class="{ disabled: disabled }"
                        :disabled="disabled"
                        @click="handleConfirm"
                    >
                        确认
                    </button>
                </view>
            </view>
        </uni-popup>

        <van-action-sheet
            :show="actionsShow"
            :actions="actions"
            @select="onActionsSelect"
        />
        <!-- cancel-text="取消" -->
    </view>
</template>

<script>
export default {
    props: {
        detail: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            form: {
                handScore: 0,
                musicScore: 0,
                attitudeScore: 0,
                chapterScores: [],
            },
            dayOfWeekOBj: {
                2: '周二',
                3: '周三',
                4: '周四',
                5: '周五',
                6: '周六',
                7: '周日',
            },
            title: '',

            actionsShow: false,
            actions: [],
        }
    },
    computed: {
        disabled() {
            const { bookId, chapterId, studentIds } = this.form
            return !bookId || !chapterId || !studentIds.length
        },
    },
    methods: {
        open() {
            this.title = `${this.dayOfWeekOBj[this.detail?.dayOfWeek]} ${
                this.detail?.periodName
            }  ${this.detail?.oneCourse.student.studentName}`

            const chapterScores =
                this.detail?.oneCourse?.coursePackage?.courses?.map((item) => ({
                    chapterId: item.id,
                    chapterName: item.courseName,
                    chapterScore: 0,
                    finishChapterId: 0,
                })) ?? []
            this.$set(this.form, 'chapterScores', chapterScores)

            this.$refs.popup.open()
        },

        onBook() {
            this.actions = this.bookList
            this.actionsShow = true
        },

        onChapter() {
            if (!this.form.bookId)
                return uni.showToast({ title: '请先选择教材！', icon: 'error' })
            this.actions = this.chapterList
            this.actionsShow = true
        },

        async onActionsSelect(e) {
            const { type, id, name } = e.detail
            if (type === 'book') {
                if (this.form.bookId !== id) {
                    const res = await this.$http.get(
                        '/mini/teachingBook/listChapterByBookAndCourse?courseId=' +
                            this.courseId +
                            '&bookId=' +
                            id
                    )
                    this.chapterList =
                        res?.data?.map((item) => ({
                            id: item.id,
                            name: item.chapterName,
                            type: 'chapter',
                        })) ?? []

                    this.$set(this.form, 'bookId', id)
                    this.$set(this.form, 'bookName', name)
                    this.$set(this.form, 'chapterId', '')
                    this.$set(this.form, 'chapterName', '')
                }
            } else {
                this.$set(this.form, 'chapterId', id)
                this.$set(this.form, 'chapterName', name)
            }
            this.actionsShow = false
        },

        handleConfirm() {
            const { timetableId, timetablePeriodId } = this.detail
            const { bookId, bookName, chapterId, chapterName, studentIds } =
                this.form
            const param = {
                data: {
                    chapters: [
                        {
                            bookId, // 教材id
                            bookName,
                            chapterId, // 曲目id
                            chapterName,
                            finishLessonId: 0, // 消课id
                            id: 0, // 消课曲目id
                        },
                    ],
                    studentIds, // 学生id
                    timetableId, // 课表id
                    timetablePeriodId, // 课表时间段id
                },
            }
            console.log(param)
        },
    },
}
</script>

<style lang="scss" scoped>
.main {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;

    .header {
        padding: 22rpx 0;
        font-size: 32rpx;
        font-weight: 500;
        color: #141f33;
        text-align: center;
        line-height: 44rpx;
    }
    .content {
        padding: 32rpx 32rpx 60rpx;
        .form-item {
            + .form-item {
                margin-top: 32rpx;
            }
            .label {
                font-size: 28rpx;
                font-weight: 500;
                color: #141f33;
                line-height: 40rpx;
                padding-bottom: 32rpx;
                .score {
                    margin-left: 40rpx;
                }
            }
            &.slider {
                .label {
                    font-size: 24rpx;
                }
            }
            .rate {
                .rate-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    +.rate-item {
                        margin-top: 14rpx;
                    }
                    .name {
                        flex: 1;
                        font-size: 28rpx;
                        color: #141F33;
                    }
                    .rate-wrap {
                        width: 296rpx;
                        text-align: right;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .score {
                        font-size: 28rpx;
                        font-weight: 500;
                        color: #62BBEC;
                    }
                }
            }
            .value {
                column-gap: 10rpx;
                .input {
                    position: relative;
                    width: 202rpx;
                    height: 56rpx;
                    line-height: 56rpx;
                    border-radius: 8rpx;
                    border: 2rpx solid #e3e5e9;
                    padding: 0 52rpx 0 20rpx;
                    font-size: 24rpx;
                    color: #141f33;
                    &.placeholder {
                        color: #99a0ad;
                    }
                    &:last-child {
                        flex: 1;
                    }
                    .arrow {
                        position: absolute;
                        right: 20rpx;
                        top: 18rpx;
                        width: 20rpx;
                        height: 20rpx;
                    }
                }
            }
            .desc {
                display: flex;
                justify-content: space-between;

                margin-top: 14rpx;
                font-size: 20rpx;
                color: #99a0ad;
                line-height: 28rpx;
            }
        }
    }

    .footer {
        padding: 32rpx 48rpx;
        box-shadow: 0px -4rpx 8rpx 0px rgba(0, 0, 0, 0.05);

        display: flex;

        .btn {
            + .btn {
                margin-left: 48rpx;
            }
            flex: 1;
            height: 72rpx;
            line-height: 72rpx;
            background-color: #fff;
            border-radius: 44rpx;
            border: 1px solid #d3d7e0;

            padding: 0 56rpx;
            font-size: 32rpx;
            font-weight: 500;
            color: #616b80;
            &.confirm {
                color: #ffffff;
                background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
            }
            &.disabled {
                background: #e1e1e1;
                border: none;
            }
        }
    }
}
</style>
