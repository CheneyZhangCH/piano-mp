<template>
    <view>
        <uni-popup v-if="detail.timetablePeriodId" ref="popup" :is-mask-click="false" type="center">
            <view class="main">
                <view class="header">{{ title }}</view>
                <scroll-view scroll-y="true" style="max-height: 75vh;">
                    <view class="content">
                        <view class="form-item rate">
                            <view class="label">回课情况</view>
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
                                    <text
                                        v-if="item.chapterScore > 0"
                                        class="score"
                                    >{{ item.chapterScore }}分</text>
                                </view>
                            </view>
                        </view>
                        <view class="form-item chapter">
                            <view class="label">本课内容</view>
                            <view
                                v-for="(item, index) in form.chapters"
                                :key="index"
                                class="chapter-item"
                            >
                                <view
                                    class="chapter-item-info flex"
                                    :class="{ custom: item.bookId === 'custom' }"
                                >
                                    <picker
                                        class="picker ellipsis"
                                        :class="{ placeholder: !item.bookId }"
                                        :value="item.bookValue"
                                        range-key="name"
                                        :range="bookList"
                                        @change="onBookChange($event, index)"
                                    >
                                        {{
                                            item.bookId
                                                ? item.bookId === 'custom'
                                                    ? '自定义'
                                                    : item.bookName
                                                : '请选择教材'
                                        }}
                                        <image
                                            class="arrow"
                                            src="/static/images/teacher/arrow-down.png"
                                        />
                                    </picker>
                                    <template v-if="item.bookId === 'custom'">
                                        <input
                                            :value="item.bookName"
                                            maxlength="10"
                                            placeholder="教材名称"
                                            placeholder-style="color: #99A0AD;font-size: 24rpx;"
                                            class="input book"
                                            @input="
                                                (e) =>
                                                    $set(
                                                        form.chapters[index],
                                                        'bookName',
                                                        e.detail.value
                                                    )
                                            "
                                        />
                                        <input
                                            :value="item.chapterName"
                                            maxlength="20"
                                            placeholder="请输入曲目名称"
                                            placeholder-style="color: #99A0AD;font-size: 24rpx;"
                                            class="input"
                                            @input="
                                                (e) =>
                                                    $set(
                                                        form.chapters[index],
                                                        'chapterName',
                                                        e.detail.value
                                                    )
                                            "
                                        />
                                    </template>
                                    <picker
                                        v-else
                                        class="picker ellipsis"
                                        :class="{ placeholder: !item.chapterId }"
                                        :value="item.chapterValue"
                                        range-key="name"
                                        :range="
                                            item.chapterList.filter(
                                                (c) =>
                                                    c.id !==
                                                    form.chapters[
                                                        index === 0 ? 1 : 0
                                                    ].chapterId
                                            )
                                        "
                                        @change="onChapterChange($event, index)"
                                    >
                                        {{ item.chapterName || '请选择曲目' }}
                                        <image
                                            class="arrow"
                                            src="/static/images/teacher/arrow-down.png"
                                        />
                                    </picker>
                                </view>
                                <view v-if="item.bookId === 'custom'" class="chapter-item-wrap">
                                    <view
                                        v-for="(work, workIndex) in item.workStep"
                                        :key="workIndex"
                                        class="chapter-item-wrap-step work"
                                    >
                                        <text class="text">
                                            步骤{{
                                                numToChinese[workIndex + 1]
                                            }}：
                                        </text>
                                        <textarea
                                            :value="work.content"
                                            maxlength="30"
                                            placeholder="分步骤布置作业内容及速度要求"
                                            placeholder-style="color: #99A0AD;font-size: 24rpx;"
                                            auto-height
                                            @input="
                                                (e) =>
                                                    $set(
                                                        form.chapters[index]
                                                            .workStep[workIndex],
                                                        'content',
                                                        e.detail.value
                                                    )
                                            "
                                        />
                                        <image
                                            v-if="
                                                workIndex ===
                                                item.workStep.length - 1
                                            "
                                            src="/static/images/teacher/add.png"
                                            @click="handleWorkAdd(index)"
                                        />
                                        <image
                                            v-else
                                            src="/static/images/teacher/minus.png"
                                            @click="
                                                handleWorkMinus(index, workIndex)
                                            "
                                        />
                                    </view>
                                </view>
                                <view
                                    v-if="
                                        (item.bookId && item.chapterId) ||
                                        item.bookId === 'custom'
                                    "
                                    class="chapter-item-wrap"
                                >
                                    <view
                                        v-for="(
                                            suggest, suggestIndex
                                        ) in item.suggestStep"
                                        :key="suggestIndex"
                                        class="chapter-item-wrap-step"
                                    >
                                        <textarea
                                            :value="suggest.content"
                                            maxlength="50"
                                            placeholder="请填写学员弹奏此曲目时的问题及解决方式"
                                            placeholder-style="color: #99A0AD;font-size: 24rpx;"
                                            auto-height
                                            @input="
                                                (e) =>
                                                    $set(
                                                        form.chapters[index]
                                                            .suggestStep[
                                                        suggestIndex
                                                        ],
                                                        'content',
                                                        e.detail.value
                                                    )
                                            "
                                        />
                                        <image
                                            v-if="
                                                suggestIndex ===
                                                item.suggestStep.length - 1
                                            "
                                            src="/static/images/teacher/add.png"
                                            @click="handleSuggestAdd(index)"
                                        />
                                        <image
                                            v-else
                                            src="/static/images/teacher/minus.png"
                                            @click="
                                                handleSuggestMinus(
                                                    index,
                                                    suggestIndex
                                                )
                                            "
                                        />
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="form-item slider" v-for="item in scores" :key="item.prop">
                            <view class="label">
                                {{
                                    item.name
                                }}
                                <text
                                    v-if="form[item.prop] > 0"
                                    class="score"
                                >{{ form[item.prop] }}分</text>
                            </view>
                            <van-slider
                                v-model="form[item.prop]"
                                use-button-slot
                                max="10"
                                active-color="#62BBEC"
                                bar-height="10rpx"
                                @change="(e) => (form[item.prop] = e.detail)"
                            >
                                <image
                                    slot="button"
                                    :src="`/static/images/teacher/score-icon${form[item.prop] > 0 ? '-blue' : ''
                                    }.png`"
                                    style="width: 28rpx; height: 36rpx"
                                />
                            </van-slider>
                            <view class="desc">
                                <text>很差</text>
                                <text>还行</text>
                                <text>极好</text>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view class="footer">
                    <button class="btn cancel" @click="$refs.popup.close()">取消</button>
                    <button
                        class="btn confirm"
                        :class="{ disabled: disabled }"
                        :disabled="disabled"
                        @click="handleConfirm"
                    >确认</button>
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
            default: () => { },
        },
    },
    data() {
        return {
            form: {
                attitudeScore: 0,
                chapterScores: [],
                chapters: [],
                handScore: 0,
                musicScore: 0,
            },
            scores: [
                { name: '手型评分', prop: 'handScore' },
                { name: '识谱评分', prop: 'musicScore' },
                { name: '学习态度', prop: 'attitudeScore' },
            ],
            dayOfWeekOBj: {
                2: '周二',
                3: '周三',
                4: '周四',
                5: '周五',
                6: '周六',
                7: '周日',
            },
            numToChinese: {
                1: '一',
                2: '二',
                3: '三',
                4: '四',
                5: '五',
                6: '六',
                7: '七',
                8: '八',
                9: '九',
                10: '十',
            },
            title: '',
            bookList: [],
        }
    },
    computed: {
        courseId() {
            return this.detail?.courseId ?? 0
        },
        disabled() {
            const {
                attitudeScore,
                chapterScores,
                chapters,
                handScore,
                musicScore,
            } = this.form
            let chapterScoresFlag = false
            for (let i = 0; i < chapterScores.length; i++) {
                const { chapterScore } = chapterScores[i]
                if (chapterScore === 0) {
                    chapterScoresFlag = true
                    break
                }
            }
            if (chapterScoresFlag) return true
            let chaptersValidCount = 0
            for (let i = 0; i < chapters.length; i++) {
                const {
                    bookId,
                    chapterId,
                    bookName,
                    chapterName,
                    suggestStep,
                    workStep,
                } = chapters[i]
                if (!bookId) continue
                if (bookId === 'custom') {
                    if (!bookName || !chapterName) continue
                    let workFlag = false
                    for (let j = 0; j < workStep.length; j++) {
                        if (workStep[j].content) {
                            workFlag = true
                            break
                        }
                    }
                    if (!workFlag) continue
                } else {
                    if (!chapterId) continue
                }
                let suggestFlag = false
                for (let j = 0; j < suggestStep.length; j++) {
                    if (suggestStep[j].content) {
                        suggestFlag = true
                        break
                    }
                }
                if (!suggestFlag) continue
                chaptersValidCount++
            }
            if (chaptersValidCount === 0) return true
            return !(attitudeScore > 0 && handScore > 0 && musicScore > 0)
        },
    },
    methods: {
        open() {
            this.form = {
                attitudeScore: 0,
                chapterScores: [],
                chapters: [],
                handScore: 0,
                musicScore: 0,
            }
            const courses = this.detail?.oneCourse?.coursePackage?.courses ?? []

            this.bookList = courses
                .map((item) => ({
                    id: item.courseId,
                    name: item.courseName,
                }))
                .concat({
                    id: 'custom',
                    name: '自定义',
                })

            this.title = `${this.dayOfWeekOBj[this.detail?.dayOfWeek]} ${this.detail?.periodName
                }  ${this.detail?.oneCourse.student.studentName}`

            const chapterScores = courses?.map((item) => ({
                chapterId: item.id,
                chapterName: item.courseName,
                chapterScore: 0,
            }))
            this.$set(this.form, 'chapterScores', chapterScores)

            const chapters = []
            for (let i = 0; i < 2; i++) {
                chapters.push({
                    bookId: '',
                    bookName: '',
                    bookValue: 0,
                    chapterId: '',
                    chapterName: '',
                    chapterValue: 0,
                    chapterList: [],
                    suggestStep: [
                        {
                            content: '',
                            sortNo: 0,
                        },
                    ],
                    workStep: [
                        {
                            content: '',
                            sortNo: 0,
                        },
                    ],
                })
            }
            this.$set(this.form, 'chapters', chapters)

            this.$refs.popup.open()
        },

        async onBookChange(e, index) {
            const target = this.form.chapters[index]
            const value = e.detail.value
            if (target.bookValue === value) return
            this.$set(target, 'bookValue', value)
            const { id, name } = this.bookList[value]

            if (id === 'custom') {
                this.$set(target, 'bookId', id)
                this.$set(target, 'bookName', '')
                this.$set(target, 'chapterId', '')
                this.$set(target, 'chapterName', '')
                this.$set(target, 'chapterList', [])
                this.chapterValue = 0
                return
            }

            const res = await this.$http.get(
                '/mini/teachingBook/listChapterByBookAndCourse?courseId=' +
                this.courseId +
                '&bookId=' +
                id
            )
            const chapterList =
                res?.data?.map((item) => ({
                    id: item.id,
                    name: item.chapterName,
                })) ?? []

            this.$set(target, 'bookId', id)
            this.$set(target, 'bookName', name)
            this.$set(target, 'chapterId', '')
            this.$set(target, 'chapterName', '')

            this.$set(target, 'chapterList', chapterList)
            this.chapterValue = 0
        },

        onChapterChange(e, index) {
            const target = this.form.chapters[index]

            const value = e.detail.value
            this.$set(target, 'chapterValue', value)

            const { id, name } = target.chapterList.filter(
                (c) =>
                    c.id !== this.form.chapters[index === 0 ? 1 : 0].chapterId
            )[value]

            this.$set(target, 'chapterId', id)
            this.$set(target, 'chapterName', name)
        },

        handleSuggestAdd(index) {
            if (this.form.chapters[index].suggestStep.length > 9)
                return uni.showToast({ title: '最多10条', icon: 'error' })
            this.form.chapters[index].suggestStep.push({
                content: '',
                sortNo: 0,
            })
        },

        handleSuggestMinus(index, suggestIndex) {
            this.form.chapters[index].suggestStep.splice(suggestIndex, 1)
        },

        handleWorkAdd(index) {
            if (this.form.chapters[index].workStep.length > 9)
                return uni.showToast({ title: '最多10条', icon: 'error' })
            this.form.chapters[index].workStep.push({
                content: '',
                sortNo: 0,
            })
        },

        handleWorkMinus(index, workIndex) {
            this.form.chapters[index].workStep.splice(workIndex, 1)
        },

        async handleConfirm() {
            const {
                timetableId,
                timetablePeriodId,
                oneCourse: {
                    student: { studentId },
                },
            } = this.detail
            const {
                attitudeScore,
                chapterScores,
                chapters,
                handScore,
                musicScore,
            } = this.form
            const validChapters = [] // 有效课程曲目
            for (let i = 0; i < chapters.length; i++) {
                const {
                    bookId,
                    chapterId,
                    bookName,
                    chapterName,
                    suggestStep,
                    workStep,
                } = chapters[i]
                if (!bookId) continue
                if (bookId === 'custom') {
                    if (!bookName || !chapterName) continue
                    if (!workStep.filter((s) => s.content).length) continue
                } else {
                    if (!chapterId) continue
                }
                if (!suggestStep.filter((s) => s.content).length) continue
                validChapters.push({
                    bookId: bookId === 'custom' ? 0 : bookId,
                    bookName,
                    chapterId: bookId === 'custom' ? 0 : chapterId,
                    chapterName,
                    suggestStep: suggestStep
                        .filter((s) => s.content)
                        .map((s, subscript) => ({
                            content: s.content,
                            sort: subscript + 1,
                        })),
                    workStep: workStep
                        .filter((s) => s.content)
                        .map((s, subscript) => ({
                            content: s.content,
                            sort: subscript + 1,
                        })),
                })
            }

            const param = {
                data: {
                    attitudeScore, // 学习态度
                    chapterScores, // 回课评分
                    chapters: validChapters, // 课程曲目
                    courseId: this.courseId, // 课程id
                    handScore, // 手型评分
                    musicScore, //识谱评分
                    studentIds: [studentId],
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
        padding: 22rpx 0;
        font-size: 32rpx;
        font-weight: 500;
        color: #141f33;
        text-align: center;
        line-height: 44rpx;
    }
    .content {
        // max-height: 75vh;
        // overflow-y: auto;
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
            &.rate {
                .rate-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    + .rate-item {
                        margin-top: 14rpx;
                    }
                    .name {
                        flex: 1;
                        font-size: 28rpx;
                        color: #141f33;
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
                        color: #62bbec;
                    }
                }
            }
            &.slider {
                .label {
                    font-size: 24rpx;
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
            &.chapter {
                .chapter-item {
                    + .chapter-item {
                        margin-top: 20rpx;
                    }
                    &-info {
                        column-gap: 10rpx;
                    }
                    .custom {
                        .picker {
                            width: 108rpx;
                        }
                        .input {
                            flex: 1;
                            height: 56rpx;
                            line-height: 56rpx;
                            border-radius: 8rpx;
                            border: 1px solid #e3e5e9;
                            padding: 0 20rpx;
                            font-size: 24rpx;
                            &.book {
                                width: 168rpx;
                                flex: none;
                            }
                        }
                    }
                    &-wrap {
                        &-step {
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-top: 12rpx;
                            .text {
                                width: 118rpx;
                                font-size: 24rpx;
                                color: #99a0ad;
                            }
                            textarea {
                                flex: 1;
                                border-radius: 8rpx;
                                border: 1px solid #e3e5e9;
                                padding: 12rpx 20rpx 10rpx;
                                font-size: 24rpx;
                                line-height: 34rpx;
                            }
                            image {
                                width: 36rpx;
                                height: 36rpx;
                                margin-left: 8rpx;
                            }
                        }
                    }

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
