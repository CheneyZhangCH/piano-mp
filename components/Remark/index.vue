<template>
    <uni-popup ref="popup" type="dialog">
        <uni-popup-dialog
            ref="input"
            mode="input"
            title="备注"
            :value="value"
            placeholder="最多15个字"
            :maxlength="15"
            :before-close="true"
            @close="close"
            @confirm="confirm"
        ></uni-popup-dialog>
    </uni-popup>
</template>

<script>
export default {
    props: {
        detail: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            value: null,
            loading: false
        }
    },
    methods: {
        open() {
            this.loading = false
            this.$refs.popup.open()
            this.$nextTick(() => {
                this.value = this.detail?.remark ?? null
            })
        },

        close() {
            this.$refs.popup.close()
        },

        async confirm(value) {
            if (this.loading) return
            this.loading = true
            const data = {
                data: {
                    remark: value,
                    studentId: this.detail.studentId
                }
            }
            try {
                await this.$http.post('/mini/student/updateStudentRemark', data)
                this.$toast({ title: '备注成功！', icon: 'success' })
                this.close()
                this.$emit('confirm', false)
            } finally {
                this.loading = false
            }
        }
    },
}
</script>
