import dayjs from "dayjs"

export const weekOrDateTime = timestamp => {
    const target = dayjs(timestamp).format('YYYY-MM-DD')
    const time = dayjs(timestamp).format('HH:mm')
    const today = dayjs().format('YYYY-MM-DD')
    const yesterday = dayjs().subtract(1, 'days').format('YYYY-MM-DD')

    if (target === today) {
        return '今天 ' + time
    } else if (target === yesterday) {
        return '昨天 ' + time
    } else {
        const monday = dayjs().subtract(dayjs().day() - 1, 'days').format('YYYY-MM-DD 00:00:00')
        if (new Date(timestamp).getTime() >= new Date(monday).getTime()) {
            return `周${['', '一', '二', '三', '四', '五', '六', '日'][new Date(timestamp).getDay()]} ` + time
        }
        return dayjs(timestamp).format('MM-DD') + ' ' + time
    }
}