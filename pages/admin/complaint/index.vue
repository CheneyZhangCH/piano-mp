<template>
    <view class="page">
        <view class="page-content">
            <view class="confirm">
                <button class="btn confirm" @click="confirm">确认</button>
            </view>
        </view>
    </view>
</template>

<script>
import { weekOrDateTime } from '@/utils/format'
export default {
    data() {
        return {
            complaintId: 0,
            detail: null,
            form: {
                dealContent: '',
                status: '' // 处理状态,可用值:deal,not_deal
            }
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.complaintId = option.id ?? 0
        this.init()
    },
    methods: {
        weekOrDateTime,
        async init() {
            try {
                const res = await this.$http.get(`/mini/studentComplaint/getStudentComplaintVo?id=${this.complaintId}`)

                // await this.$http.get(`/mini/studentComplaint/getComplaintReason`)
            } catch (error) {

            }
        },

        async confirm() {
            if (this.loading) return
            this.loading = true

            const param = {
                data: {
                    ...this.form,
                    id: this.complaintId,
                    // dealContent: "",
                    // status: ""
                }
            }
            try {
                await this.$http.post('/mini/studentComplaint/dealComplaint', param)
            } catch (error) {

            }
        }
    }
}
</script>