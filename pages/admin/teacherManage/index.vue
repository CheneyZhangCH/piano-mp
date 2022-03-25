<template>
    <view class="page">
        <view class="page-info">
            <image
                class="cover"
                :src="teacher.coverUrl"
            />
            <text class="name">{{ teacher.teacherName }}</text>
        </view>
        <view class="page-btns">
            <view class="btn" @click="toTeacher">
                <text>查看老师数据</text>
                <uni-icons type="right" color="#99A0AD" size="12" />
            </view>
            <view class="btn" @click="toSchedule">
                <text>查看老师课表</text>
                <uni-icons type="right" color="#99A0AD" size="12" />
            </view>
            <view class="btn" @click="addDiscipline">
                <text>录入违规违纪</text>
                <image src="/static/images/teacher/edit-gray.png" />
            </view>
        </view>
        <WeiguiWeiji ref="weiguiweiji" :teacherId="teacherId" />
    </view>
</template>

<script>
import WeiguiWeiji from "./components/WeiguiWeiji.vue";
export default {
    components: {
        WeiguiWeiji
    },
    data() {
        return {
            teacherId: 0,
            teacher: {}
        };
    },
    onLoad(option) {
        const token = uni.getStorageSync("token");
        // 权限验证
        if (!token) {
            uni.showToast({ title: "请先登录", icon: "none" });
            return uni.navigateTo({ url: "/pages/login/index" });
        }
        this.teacherId = option.teacherId;
        this.init();
    },
    methods: {
        async init() {
            const res = await this.$http.get("/mini/teacher/getTeacherDataInfo?teacherId=" + this.teacherId);
            if (res.ok) {
                this.teacher = res.data?.teacher ?? {}
            }
        },

        toTeacher() {
            const { accountId, teacherName } = this.teacher;
            uni.navigateTo({ url: `/pages/admin/teacherData/index?teacherId=${accountId}&teacherName=${teacherName}` });
        },

        // 试听端
        toSchedule() {
            const { accountId, teacherName } = this.teacher;
            uni.navigateTo({ url: `/pages/audition/teacher/index?teacherId=${accountId}&teacherName=${teacherName}` });
        },

        addDiscipline() {
            this.$refs.weiguiweiji.open()
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    padding-top: 68rpx;
    background: #fff;
    &-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 234rpx;
        .cover {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            margin-bottom: 16rpx;
        }
        .name {
            font-size: 32rpx;
            color: #141f33;
            line-height: 44rpx;
        }
    }
    &-btns {
        padding: 0 30rpx;
        .btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 130rpx;
            padding: 0 50rpx;
            font-size: 32rpx;
            color: #525666;
            border-bottom: 2rpx solid #f5f7fa;
            &:first-child {
                border-top: 2rpx solid #f5f7fa;
            }
            image {
                width: 24rpx;
                height: 24rpx;
            }
        }
    }
}
</style>
