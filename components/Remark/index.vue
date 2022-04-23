<template>
    <view>
        <view class="remark" :class="{ 'exist': student.remark }" :style="customStyle" @click="open">
            <template v-if="student.remark">
                <text class="exist-text">{{ student.remark }}</text>
                <uni-icons type="closeempty" color="#367AA0" size="12" @click.stop="confirm('')"></uni-icons>
            </template>
            <template v-else>
                <text>点击添加备注信息(15字内)</text>
                <image class="icon" src="/static/images/audition/edit.png" />
            </template>
        </view>

        <uni-popup v-if="popupVisible" ref="popup" type="dialog">
            <uni-popup-dialog ref="input" mode="input" title="备注" :value="value" placeholder="最多15个字" :maxlength="15"
                :before-close="true" @close="close" @confirm="confirm" />
        </uni-popup>
    </view>
</template>

<script>
export default {
    props: {
        student: Object,
        customStyle: String
    },
    data() {
        return {
            value: null,
            loading: false,
            popupVisible: false
        }
    },
    methods: {
        open() {
            this.loading = false
            this.popupVisible = true
            this.$nextTick(() => {
                this.$refs.popup.open()
                this.value = this.student?.remark ?? null
            })
        },

        close() {
            this.$refs.popup.close()
            this.popupVisible = false
        },

        async confirm(value) {
            if (this.loading) return
            this.loading = true
            const data = {
                data: {
                    remark: value,
                    studentId: this.student.studentId
                }
            }
            try {
                await this.$http.post('/mini/student/updateStudentRemark', data)
                this.$toast({ title: value ? '备注成功！' : '删除成功！', icon: 'success' })
                this.close()
                this.$emit('confirm', false)
            } finally {
                this.loading = false
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.remark {
    font-size: 24rpx;
    color: #99a0ad;
    // margin-left: 12rpx;
    height: 34rpx;
    line-height: 34rpx;

    &.exist {
        display: inline-block;
        background: #e2f3ff;
        border-radius: 4rpx;
        opacity: 0.58;
        padding-left: 6rpx;
        padding-right: 6rpx;
        color: #367aa0;

        &-text {
            margin-right: 8rpx;
        }
    }

    .icon {
        width: 20rpx;
        height: 20rpx;
        margin-left: 8rpx;
    }
}
</style>
