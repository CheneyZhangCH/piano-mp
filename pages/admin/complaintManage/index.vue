<template>
    <view class="page">
        <view class="page-content">
            <view v-for="item in complaintList" :key="item.id" class="item">
                <view class="header">
                    <view>
                        <text>课时申诉</text>
                        <image :src="item.student.coverUrl || 'https://static.gangqintonghua.com/img/touxiang/pic1.webp'"></image>
                        <text>{{item.student.studentName}}</text>
                    </view>
                    <!-- <text>{{weekOrDateTime(item.a)}}</text> -->
                </view>
            </view>
        </view>
        <customTabbar :active="1" />
    </view>
</template>

<script>
import { weekOrDateTime } from '@/utils/format'
export default {
    data() {
        return {
            complaintList: [
                {
                    "complaintReason": "",
                    "complaintReasonId": "",
                    "complaintType": "",
                    "content": "",
                    "dealContent": "",
                    "finishLesson": {
                        "attitudeScore": 0,
                        "chapters": [
                            {
                                "bookId": 0,
                                "bookName": "",
                                "chapterId": 0,
                                "chapterName": "",
                                "finishLessonId": 0,
                                "id": 0,
                                "knowledge": "",
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
                        "finishTime": "",
                        "handScore": 0,
                        "id": 0,
                        "musicScore": 0,
                        "students": [
                            {
                                "accountId": 0,
                                "age": 0,
                                "attitudeScore": 0,
                                "birthday": "",
                                "coverUrl": "",
                                "examSeason": "",
                                "expired": true,
                                "expiryDate": "",
                                "finishChapterScore": 0,
                                "gender": "",
                                "grade": "",
                                "handScore": 0,
                                "lastExamTime": "",
                                "musicScore": 0,
                                "remark": "",
                                "status": "",
                                "studentId": 0,
                                "studentName": ""
                            }
                        ],
                        "teacher": {
                            "accountId": 0,
                            "coverUrl": "",
                            "groupTeacherType": "",
                            "teacherName": ""
                        }
                    },
                    "id": 0,
                    "imgUrls": [],
                    "status": "",
                    "student": {
                        "accountId": 0,
                        "age": 0,
                        "attitudeScore": 0,
                        "birthday": "",
                        "coverUrl": "",
                        "examSeason": "",
                        "expired": true,
                        "expiryDate": "",
                        "finishChapterScore": 0,
                        "gender": "",
                        "grade": "",
                        "handScore": 0,
                        "lastExamTime": "",
                        "musicScore": 0,
                        "remark": "",
                        "status": "",
                        "studentId": 0,
                        "studentName": ""
                    }
                }
            ]
        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.init()
    },
    methods: {
        weekOrDateTime,
        async init() {
            try {
                const res = await this.$http.post('/mini/studentComplaint/listWaitDealComplaint')
                this.complaintList = res.data ?? []
            } catch (error) {

            }
        }
    }
}
</script>