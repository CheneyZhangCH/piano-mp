<template>
    <view>
        <uni-popup ref="popup" :is-mask-click="false" type="center">
            <view class="center-popup flex flex-column">
                <view class="center-popup-footer">
                    <button
                        class="btn cancel"
                        @click="$refs.popup.close()"
                    >
                        取消
                    </button>
                    <button
                        class="btn primary"
                        :disabled="disabled"
                        @click="$refs.popup.close()"
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
    data() {
        return {
            form: {
                grade: '',
                year: '',
                studentIds: [],
            },
            "data": {
                "attitudeScore": 0, // 学习态度
                "chapterScores": [
                    {
                        "chapterId": 0,
                        "chapterName": "",
                        "chapterScore": 0,
                        "finishChapterId": 0
                    }
                ],
                "chapters": [
                    {
                        "bookId": 0, // 教材id
                        "bookName": "",
                        "chapterId": 0, // 曲目id
                        "chapterName": "",
                        "finishLessonId": 0, // 消课id
                        "id": 0, // 消课曲目id
                        "suggestStep": [
                            {
                                "content": "",
                                "sortNo": 0
                            }
                        ],
                        "workStep": [
                            {
                                "content": "",
                                "sortNo": 0
                            }
                        ]
                    }
                ],
                "courseId": 0, // 课程id
                "handScore": 0, // 手型评分
                "musicScore": 0, // 识谱评分
                "studentIds": [], // 学生id
                "timetableId": 0, // 课表id
                "timetablePeriodId": 0 // 课表时间段id
            }
        }
    },
    computed: {
        disabled() {
            const {  grade, year, season } = this.form
            return !grade || !year || !season
        }
    },
    methods: {
        async open(item) {
            const res = await this.$http.get('/mini/teachingBook/listByCourseId?courseId='+item.course.id)
            console.log(res)
            this.$refs.popup.open()
        }
    },
}
</script>

<style lang="scss" scoped>
.center-popup {
    width: 650rpx;
    background-color: #fff;
    border-radius: 32rpx;
}
.center-popup-title {
    position: relative;
    height: 200rpx;
    padding: 30rpx 30rpx 0 30rpx;

    .avatar {
        width: 108rpx;
        height: 108rpx;
        border-radius: 50%;
        margin-right: 24rpx;
    }

    .center-popup-title-content {
        flex: 1;

        .center-popup-title-main {
            .student-name {
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                //color: #FFFFFF;
                margin-right: 10rpx;
                line-height: 40rpx;
            }

            .package-name {
                display: inline-flex;
                align-items: center;
                padding-left: 10rpx;
                padding-right: 10rpx;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 18rpx;
                height: 36rpx;
                font-size: 20rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #eff5ff;
                line-height: 36rpx;
            }
            .set-grade {
                font-size: 24rpx;
            }
        }

        .center-popup-title-sub {
            display: flex;
            align-items: center;
            height: 36rpx;
            margin-top: 12rpx;

            .gender-icon {
                width: 24rpx;
                height: 24rpx;
            }

            .text {
                font-size: 24rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                //color: #FFFFFF;
                margin-left: 20rpx;
            }
        }

        .close {
            position: absolute;
            top: 48rpx;
            right: 30rpx;
            font-size: 24rpx;
        }
    }
}
.center-popup-content {
    margin-top: 20rpx;

    .score {
        display: flex;

        .score-item {
            position: relative;
            width: 33.33%;
            display: inline-flex;
            flex-direction: column;
            margin-bottom: 36rpx;

            &:after {
                content: '';
                display: inline-block;
                width: 2rpx;
                height: 20rpx;
                border-right: 2rpx solid #c9ced6;
                position: absolute;
                right: 0;
                top: 20rpx;
            }

            &:last-child {
                &:after {
                    display: none;
                }
            }

            .score-item-num {
                height: 40rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #141f33;
                line-height: 40rpx;
                text-align: center;
            }

            .score-item-desc {
                height: 36rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #99a0ad;
                line-height: 36rpx;
                text-align: center;
            }
        }
    }
    .section-divider {
        width: 600rpx;
        height: 2rpx;
        border-top: 2rpx dashed #e3e5e9;
        margin: 0 auto;
    }
    .chapters {
        padding-top: 36rpx;

        .chapter-item {
            margin-bottom: 36rpx;

            .chapter-item-title {
                height: 36rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #141f33;
                line-height: 36rpx;

                &.warning {
                    font-weight: 500;
                    color: #f15e5e;
                }

                .text {
                    margin-left: 12rpx;

                    &:first-child {
                        margin-left: 0;
                    }
                }
            }

            .chapter-item-book {
                margin-top: 12rpx;
                height: 36rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #99a0ad;
                line-height: 36rpx;
            }
        }
    }
    .expire-date {
        padding-top: 20rpx;
        padding-bottom: 20rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #141f33;
        line-height: 36rpx;

        &.warning {
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #f15e5e;
        }
    }
    .note,
    .note-empty {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 36rpx;
    }
    .note {
        display: inline-flex;
        color: #367aa0;
        background-color: rgba(226, 243, 255, 0.58);
    }
    .note-empty {
        color: #99a0ad;

        .edit {
            width: 20rpx;
            height: 20rpx;
        }
    }
}
.center-popup-footer {
    padding: 32rpx;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);

    .btn {
        height: 72rpx;
        line-height: 72rpx;
        background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
        border-radius: 44rpx;

        font-size: 32rpx;
        font-weight: 500;
        color: #ffffff;
    }
}
.grade-main {
    height: 360rpx;
    background-color: #fff;
    border-radius: 10px 10px 0px 0px;
    &-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24rpx 44rpx;
        .btn {
            font-size: 28rpx;
            color: #99a0ad;
        }
        .confirm {
            color: #62bbec;
        }
    }
    &-form {
        background-color: #fff;
        padding: 0 32rpx;
        .form-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            + .form-item {
                margin-top: 32rpx;
            }
            .label {
                font-size: 28rpx;
                color: #99a0ad;
                line-height: 40rpx;
            }
            .value {
                position: relative;
                input {
                    border-bottom: 1px solid #f3f3f3;
                    text-align: center;

                    font-size: 28rpx;
                    color: #141f33;
                    line-height: 20px;
                }
                .unit {
                    position: absolute;
                    right: 0;
                    top: 6rpx;

                    color: #525666;
                    line-height: 20px;
                }
            }
        }
    }
}
</style>