import dayjs from "dayjs"
export const WEEK_DAY = ['', '一', '二', '三', '四', '五', '六', '日']

export const dayjsFormat = (date, y = 'YYYY-MM-DD') => {
    if (!date) return dayjs().format(y)
    return dayjs(date).format(y)
}

export const weekOrDateTime = (timestamp) => {
    if(!timestamp) return ''
    const target = dayjs(timestamp).format('YYYY-MM-DD')
    const time = dayjs(timestamp).format('HH:mm')
    const today = dayjs().format('YYYY-MM-DD')
    const yesterday = dayjs().subtract(1, 'days').format('YYYY-MM-DD')

    if (target === today) {
        const period = dayjs(timestamp).hour() < 12 ? '上午' : '下午'
        return '今天 ' + period + time
    } else if (target === yesterday) {
        return '昨天 ' + time
    } else {
        const monday = dayjs().subtract(dayjs().day() - 1, 'days').format('YYYY-MM-DD 00:00:00')
        if (new Date(timestamp).getTime() >= new Date(monday).getTime()) {
            return `周${WEEK_DAY[new Date(timestamp).getDay()]} ` + time
        }
        return dayjs(timestamp).format('MM-DD') + ' ' + time
    }
}

export const dayWeekTime = date => {
    if (!date) return ''
    const day = dayjs(date).format('YYYY-MM-DD')
    const week = '周' + WEEK_DAY[new Date(date).getDay()]
    const time = dayjs(date).format('HH:mm')
    return [day, week, time]
}

// 账户有效期
export const getExpiryDate = expiryDate => {
    // if 有效期 >=当天  则显示天数=有效期-当天+1
    // else 显示天数 有效期-当天
    if (!expiryDate) return '-'
    let days = (expiryDate - new Date(dayjsFormat(null, 'YYYY-MM-DD 00:00:00')).getTime()) / (24 * 60 * 60 * 1000)
    if (days >= 0) days++
    if (Math.abs(days) <= 30) return days + '天'

    const monthSum = days > 0 ? Math.floor(days / 30) : Math.ceil(days / 30)
    const daySum = days % 30
    return [monthSum ? monthSum + '个月' : '', daySum ? daySum + '天' : ''].filter(Boolean).join('')
}

// n天到期
export const getExpiryDateWarning = (expiryDate, n = 30) => {
    return expiryDate - dayjs() < n * 24 * 60 * 60 * 1000
}
