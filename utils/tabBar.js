// key 用于tabbar info dot
const ADMIN = [
    {
        pagePath: "/pages/admin/index/index",
        text: '老师管理',
        iconPath: '/static/images/tabBar/kebiao.png',
        selectedIconPath: '/static/images/tabBar/kebiao_selected.png'
    },
    {
        key: 'waitDealComplaintCount',
        pagePath: "/pages/admin/complaintManage/index",
        text: "投诉管理",
        iconPath: "/static/images/tabBar/user.png",
        selectedIconPath: "/static/images/tabBar/user_selected.png"
    }
]
const AUDITION = [
    {
        pagePath: "/pages/audition/index/index",
        text: '老师课表',
        iconPath: '/static/images/tabBar/kebiao.png',
        selectedIconPath: '/static/images/tabBar/kebiao_selected.png'
    },
    {
        pagePath: "/pages/audition/accountAdd/index",
        text: '账号开通',
        iconPath: '/static/images/tabBar/kaitong.png',
        selectedIconPath: '/static/images/tabBar/kaitong_selected.png'
    },
    {
        key: "xufei",
        pagePath: "/pages/audition/xufei/index",
        text: '学员续费',
        iconPath: '/static/images/tabBar/xufei.png',
        selectedIconPath: '/static/images/tabBar/xufei_selected.png'
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

export default {
    ADMIN,
    STUDENT,
    TEACHER,
    AUDITION
}
