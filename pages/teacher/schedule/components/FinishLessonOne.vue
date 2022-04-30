<template>
    <view>
        <uni-popup v-if="detail.timetablePeriodId" ref="popup" :is-mask-click="false" type="center">
            <view class="main">
                <view class="header">{{ title }}</view>
                <scroll-view scroll-y="true" style="max-height: 75vh;">
                    <view class="content">
                        <view v-if="form.chapterScores.length" class="form-item rate">
                            <view class="label">回课情况</view>
                            <view v-for="(item, index) in form.chapterScores" :key="item.chapterId" class="rate-item">
                                <text class="name ellipsis">{{ item.chapterName }}</text>
                                <view class="rate-wrap">
                                    <van-rate v-model="item.chapterScore"
                                        :icon="'https://static.gangqintonghua.com/img/icon/star-selected.png'"
                                        :void-icon="'https://static.gangqintonghua.com/img/icon/star.png'"
                                        color="#62BBEC" void-color="#D8D8D8" gutter="4rpx" size="36rpx" @change="
                                            (e) =>
                                                $set(
                                                    form.chapterScores[index],
                                                    'chapterScore',
                                                    e.detail
                                                )
                                        " />
                                    <text v-if="item.chapterScore > 0" class="score">{{ item.chapterScore * 2 }}分</text>
                                </view>
                            </view>
                        </view>
                        <view class="form-item chapter">
                            <view class="label">本课内容</view>
                            <view v-for="(item, index) in form.chapters" :key="index" class="chapter-item">
                                <view class="chapter-item-info flex" :class="{ custom: item.bookId === 'custom' }">
                                    <picker class="picker" :class="{ placeholder: !item.bookId }"
                                        :value="item.bookValue" range-key="name" :range="bookList"
                                        @change="onBookChange($event, index)">
                                        <text class="ellipsis">
                                            {{ item.bookId ? item.bookId === 'custom' ? '自定义' : item.bookName : '请选择教材'
                                            }}
                                        </text>
                                        <image class="arrow" src="/static/images/teacher/arrow-down.png" />
                                    </picker>
                                    <template v-if="item.bookId === 'custom'">
                                        <input :value="item.bookName" maxlength="10" placeholder="教材名称"
                                            placeholder-style="color: #99A0AD;font-size: 24rpx;" class="input book"
                                            @input="
                                                (e) =>
                                                    $set(
                                                        form.chapters[index],
                                                        'bookName',
                                                        e.detail.value
                                                    )
                                            " />
                                        <input :value="item.chapterName" maxlength="20" placeholder="请输入曲目名称"
                                            placeholder-style="color: #99A0AD;font-size: 24rpx;" class="input" @input="
                                                (e) =>
                                                    $set(
                                                        form.chapters[index],
                                                        'chapterName',
                                                        e.detail.value
                                                    )
                                            " />
                                    </template>
                                    <picker v-else class="picker" :class="{ placeholder: !item.chapterId }"
                                        :value="item.chapterValue" range-key="name" :range="
                                            item.chapterList.filter(
                                                (c) =>
                                                    c.id !==
                                                    form.chapters[
                                                        index === 0 ? 1 : 0
                                                    ].chapterId
                                            )
                                        " @change="onChapterChange($event, index)">
                                        <text class="ellipsis">{{ item.chapterName || '请选择曲目' }}</text>
                                        <image class="arrow" src="/static/images/teacher/arrow-down.png" />
                                    </picker>
                                </view>
                                <view v-if="item.bookId === 'custom'" class="chapter-item-wrap">
                                    <view v-for="(work, workIndex) in item.workStep" :key="workIndex"
                                        class="chapter-item-wrap-step">
                                        <text class="text">
                                            步骤{{
                                                    numToChinese[workIndex + 1]
                                            }}：
                                        </text>
                                        <textarea :value="work.content" maxlength="30" placeholder="分步骤布置作业内容及速度要求"
                                            placeholder-style="color: #99A0AD;font-size: 24rpx;" auto-height @input="
                                                (e) =>
                                                    $set(
                                                        form.chapters[index]
                                                            .workStep[workIndex],
                                                        'content',
                                                        e.detail.value
                                                    )
                                            " />
                                        <image v-if="
                                            workIndex ===
                                            item.workStep.length - 1
                                        " src="/static/images/teacher/add.png" @click="handleWorkAdd(index)" />
                                        <image v-else src="/static/images/teacher/minus.png" @click="
                                            handleWorkMinus(index, workIndex)
                                        " />
                                    </view>
                                </view>
                                <view v-if="
                                    (item.bookId && item.chapterId) ||
                                    item.bookId === 'custom'
                                " class="chapter-item-wrap">
                                    <view v-for="(
                                            suggest, suggestIndex
                                        ) in item.suggestStep" :key="suggestIndex" class="chapter-item-wrap-step">
                                        <textarea :value="suggest.content" maxlength="50"
                                            placeholder="请填写学员弹奏此曲目时的问题及解决方式"
                                            placeholder-style="color: #99A0AD;font-size: 24rpx;" auto-height @input="
                                                (e) =>
                                                    $set(
                                                        form.chapters[index]
                                                            .suggestStep[
                                                        suggestIndex
                                                        ],
                                                        'content',
                                                        e.detail.value
                                                    )
                                            " />
                                        <image v-if="
                                            suggestIndex ===
                                            item.suggestStep.length - 1
                                        " src="/static/images/teacher/add.png" @click="handleSuggestAdd(index)" />
                                        <image v-else src="/static/images/teacher/minus.png" @click="
                                            handleSuggestMinus(
                                                index,
                                                suggestIndex
                                            )
                                        " />
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="form-item slider" v-for="item in scores" :key="item.prop">
                            <view class="label">
                                {{ item.name }}
                                <text v-if="form[item.prop] > 0" class="score">{{ form[item.prop] }}分</text>
                            </view>
                            <van-slider v-model="form[item.prop]" use-button-slot max="10" active-color="#62BBEC"
                                bar-height="10rpx" @change="(e) => (form[item.prop] = e.detail)">
                                <image slot="button" :src="`/static/images/teacher/score-icon${form[item.prop] > 0 ? '-blue' : ''
                                }.png`" style="width: 28rpx; height: 36rpx" />
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
                    <button class="btn" :class="{ confirm: !disabled, disabled }" :disabled="disabled"
                        @click="_checkStudentEndAndNextCourse">确认</button>
                </view>
            </view>
        </uni-popup>

        <MessageBox ref="last" @confirm="handleConfirm" />
    </view>
</template>

<script>
import MessageBox from './MessageBox.vue'
import { WEEK_DAY } from '@/utils/format'
import { numToChinese } from '@/utils/dicts'
export default {
    components: {
        MessageBox
    },
    props: {
        detail: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            loading: false,
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
            numToChinese,
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
        async open() {
            this.form = {
                attitudeScore: 0,
                chapterScores: [],
                chapters: [],
                handScore: 0,
                musicScore: 0,
            }
            try {
                const lastChaptersRes = await this.$http.post('/mini/finishiLesson/getLastFinishLessonChapters', {
                    data: {
                        "courseId": this.detail.courseId,
                        studentId: this.detail.oneCourse.student.studentId,
                        timetableId: this.detail.timetableId,
                        timetablePeriodId: this.detail.timetablePeriodId
                    }
                })
                const chapterScores = lastChaptersRes.data?.map((item) => ({
                    chapterId: item.chapterId,
                    chapterName: item.chapterName,
                    chapterScore: 0,
                    finishChapterId: item.id
                })) ?? []
                this.$set(this.form, 'chapterScores', chapterScores)

                const packageId = this.detail?.oneCourse?.coursePackage?.packageId
                const teachingBookRes = await this.$http.get(
                    '/mini/teachingBook/listByPackageId?packageId=' + packageId
                )
                this.bookList = teachingBookRes?.data?.map((item) => ({
                    id: item.id,
                    name: item.bookName,
                })).concat({
                    id: 'custom',
                    name: '自定义',
                })
            } catch (error) {
                console.log(error)
            }

            this.title = `周${WEEK_DAY[this.detail?.dayOfWeek]} ${this.detail?.periodName
                }  ${this.detail?.oneCourse.student.studentName}`


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
            )[value] ?? {}

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
            if (this.loading) return
            this.loading = true
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
                    bookId: bookId === 'custom' ? null : bookId,
                    bookName,
                    chapterId: bookId === 'custom' ? null : chapterId,
                    chapterName: bookId === 'custom' ? `《${chapterName}》` : chapterName,
                    suggestStep: suggestStep
                        .filter((s) => s.content)
                        .map((s, subscript) => ({
                            content: s.content,
                            sortNo: subscript + 1,
                        })),
                    workStep: workStep
                        .filter((s) => s.content)
                        .map((s, subscript) => ({
                            content: s.content,
                            sortNo: subscript + 1,
                        })),
                })
            }

            const scores = [] // 回课 - 评分*2
            for (let i = 0; i < chapterScores.length; i++) {
                const {
                    chapterScore,
                    ...rest
                } = chapterScores[i]
                scores.push({
                    ...rest,
                    chapterScore: chapterScore * 2
                })
            }
            const param = {
                data: {
                    attitudeScore, // 学习态度
                    chapterScores: scores, // 回课评分
                    chapters: validChapters, // 课程曲目
                    courseId: this.courseId, // 课程id
                    handScore, // 手型评分
                    musicScore, //识谱评分
                    studentIds: [studentId],
                    timetableId, // 课表id
                    timetablePeriodId, // 课表时间段id
                },
            }
            try {
                await this.$http.post(
                    '/mini/finishiLesson/finishLesson',
                    param
                )
                uni.showToast({
                    title: '消课成功！',
                    icon: 'success',
                })
                this.$refs.popup.close()
                this.$emit('success', false) // 列表不loading
            } finally {
                this.loading = false
            }
        },

        async _checkStudentEndAndNextCourse() {
            const {
                timetablePeriodId,
                oneCourse: {
                    student: { studentId },
                },
            } = this.detail
            const data = {
                data: {
                    timetablePeriodId,
                    studentId
                }
            }
            try {
                const res = await this.$http.post('/mini/finishiLesson/checkStudentEndAndNextCourse', data)
                const { course, lastCourse } = res.data ?? {}
                if (!lastCourse) return this.handleConfirm()
                this.$refs.last.open(course)
            } catch (error) {

            }
        }
    },
}
</script>

<style lang="scss" scoped src="@/components/Student/popup.scss">
</style>
<style lang="scss" scoped>
.main {
    .content {
        padding: 32rpx 32rpx 60rpx;

        .form-item {
            +.form-item {
                margin-top: 32rpx;
            }

            .label {
                font-size: 28rpx;
                font-weight: 600;
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

                    +.rate-item {
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
                        font-weight: 600;
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
                    +.chapter-item {
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
                            position: relative;
                            flex: 1;
                            height: 56rpx;
                            line-height: 56rpx;
                            border-radius: 8rpx;
                            border: 1px solid #e3e5e9;
                            padding: 0 24rpx 0 36rpx;
                            font-size: 24rpx;
                            box-sizing: border-box;

                            &.book {
                                width: 168rpx;
                                flex: none;
                            }

                            &::before {
                                content: '*';
                                position: absolute;
                                left: 12rpx;
                                font-size: 24rpx;
                                color: #F15E5E;
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

                            &:first-child {
                                textarea {
                                    position: relative;

                                    &::before {
                                        content: '*';
                                        position: absolute;
                                        left: 12rpx;
                                        font-size: 24rpx;
                                        color: #F15E5E;
                                    }
                                }
                            }

                            .text {
                                width: 118rpx;
                                font-size: 24rpx;
                                color: #99a0ad;
                            }

                            textarea {
                                flex: 1;
                                border-radius: 8rpx;
                                border: 1px solid #e3e5e9;
                                padding: 12rpx 24rpx 12rpx 36rpx;
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
                        padding: 0 50rpx 0 20rpx;
                        font-size: 24rpx;
                        color: #141f33;
                        box-sizing: border-box;

                        &.placeholder {
                            color: #99a0ad;
                        }

                        &:last-child {
                            flex: 1;
                        }

                        text {
                            display: inline-block;
                            width: 100%;
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
}
</style>
