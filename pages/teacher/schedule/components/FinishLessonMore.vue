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
                        <view class="label">本课内容</view>
                        <view class="value flex">
                            <picker
                                class="picker ellipsis"
                                :class="{ placeholder: !form.bookId }"
                                :value="bookValue"
                                range-key="name"
                                :range="bookList"
                                @change="onBookChange"
                            >
                                {{ form.bookName || '请选择教材' }}
                                <image
                                    class="arrow"
                                    src="/static/images/teacher/arrow-down.png"
                                />
                            </picker>
                            <picker
                                class="picker ellipsis"
                                :class="{ placeholder: !form.chapterId }"
                                :value="chapterValue"
                                :disabled="chapterPickerDisabled"
                                range-key="name"
                                :range="chapterList"
                                @change="onChapterChange"
                            >
                                {{ form.chapterName || '请选择曲目' }}
                                <image
                                    class="arrow"
                                    src="/static/images/teacher/arrow-down.png"
                                />
                            </picker>
                        </view>
                    </view>
                    <view class="form-item">
                        <view class="label">学员选择</view>
                        <view class="value">
                            <van-checkbox-group
                                v-model="form.studentIds"
                                direction="horizontal"
                                @change="(e) => (form.studentIds = e.detail)"
                            >
                                <van-checkbox
                                    v-for="student in students"
                                    :name="student.studentId"
                                    use-icon-slot
                                    :key="student.studentId"
                                >
                                    <image
                                        slot="icon"
                                        :src="`/static/images/student/icon-radio${
                                            form.studentIds.includes(
                                                '' + student.studentId
                                            )
                                                ? '-active'
                                                : ''
                                        }.png`"
                                        style="width: 28rpx; height: 28rpx"
                                    />
                                    {{ student.studentName }}
                                </van-checkbox>
                            </van-checkbox-group>
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
                bookId: '',
                bookName: '',
                chapterId: '',
                chapterName: '',
                studentIds: [],
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
            students: [],

            bookList: [],
            bookValue: 0,
            chapterList: [],
            chapterValue: 0
        }
    },
    computed: {
        courseId() {
            return this.detail?.moreCourse?.course?.id ?? 0
        },
        chapterPickerDisabled() {
            return this.chapterList.length === 0
        },
        disabled() {
            const { bookId, chapterId, studentIds } = this.form
            return !bookId || !chapterId || !studentIds.length
        },
    },
    methods: {
        async open() {
            this.form = {
                bookId: '',
                bookName: '',
                chapterId: '',
                chapterName: '',
                studentIds: [],
            }
            const res = await this.$http.get(
                '/mini/teachingBook/listByCourseId?courseId=' + this.courseId
            )
            this.bookList =
                res.data?.map((item) => ({
                    id: item.id,
                    name: item.bookName,
                })) ?? []
            this.bookValue = 0
            this.chapterList = []
            this.chapterValue = 0

            this.title = `${this.dayOfWeekOBj[this.detail?.dayOfWeek]} ${
                this.detail?.periodName
            }  ${this.detail?.moreCourse.course.courseName}`

            this.students = this.detail?.moreCourse?.students ?? []

            this.$refs.popup.open()
        },

        async onBookChange(e) {
            if (this.bookValue === e.detail.value) return
            this.bookValue = e.detail.value
            const { id, name } = this.bookList[this.bookValue]

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
                })) ?? []

            this.$set(this.form, 'bookId', id)
            this.$set(this.form, 'bookName', name)
            this.$set(this.form, 'chapterId', '')
            this.$set(this.form, 'chapterName', '')
            this.chapterValue = 0
        },

        onChapterChange(e) {
            this.chapterValue = e.detail.value
            const { id, name } = this.chapterList[this.chapterValue]

            this.$set(this.form, 'chapterId', id)
            this.$set(this.form, 'chapterName', name)
        },

        async handleConfirm() {
            const {
                timetableId,
                timetablePeriodId
            } = this.detail
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
                        },
                    ],
                    courseId: this.courseId, // 课程id
                    studentIds, // 学生id
                    timetableId, // 课表id
                    timetablePeriodId, // 课表时间段id
                },
            }
            const res = await this.$http.post(
                '/mini/finishiLesson/finishLesson',
                param
            )
            if (res.ok) {
                uni.showToast({
                    title: '消课成功！',
                    icon: 'success',
                })
                this.$refs.popup.close()
                this.$emit('success')
            }
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
        padding: 22rpx 32rpx;
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
            }
            .value {
                column-gap: 10rpx;
                .picker {
                    position: relative;
                    width: 202rpx;
                    height: 56rpx;
                    line-height: 56rpx;
                    border-radius: 8rpx;
                    border: 2rpx solid #e3e5e9;
                    padding: 0 52rpx 0 20rpx;
                    font-size: 24rpx;
                    color: #141f33;
                    box-sizing: border-box;
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
