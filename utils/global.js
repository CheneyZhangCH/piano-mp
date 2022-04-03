export default {
    install(Vue) {
        Vue.prototype.$toast = function(options) {
            uni.showToast({
                ...options
            })
        }

        Vue.prototype.getStudentCoverUrl = function(student) {
            if(!student?.studentId) return `https://static.gangqintonghua.com/img/touxiang/male.png`
            if(student.coverUrl) return student.coverUrl
            return `https://static.gangqintonghua.com/img/touxiang/${student.gender ?? 'male'}.png`
        }
    }
}
