const STUDENT = [
    {
        pagePath: "/pages/student/videos/index",
        text: '配套视频',
        iconPath: '/static/images/tabBar/video.png',
        selectedIconPath: '/static/images/tabBar/video_selected.png'
    },
    {
        pagePath: "/pages/student/homework/index",
        text: "课后作业",
        iconPath: "/static/images/tabBar/homework.png",
        selectedIconPath: "/static/images/tabBar/homework_selected.png"
    },
    {
        pagePath: "/pages/student/center/index",
        text: "学员中心",
        iconPath: "/static/images/tabBar/user.png",
        selectedIconPath: "/static/images/tabBar/user_selected.png"
    }
]
const TEACHER = [
    {
        pagePath: "/pages/teacher/schedule/index",
        text: '我的课表',
        iconPath: '/static/images/tabBar/schedule.png',
        selectedIconPath: '/static/images/tabBar/schedule_selected.png'
    },
    {
        pagePath: "/pages/teacher/datacenter/index",
        text: '数据中心',
        iconPath: '/static/images/tabBar/datacenter.png',
        selectedIconPath: '/static/images/tabBar/datacenter_selected.png'
    }
]

export default {
    STUDENT,
    TEACHER
}