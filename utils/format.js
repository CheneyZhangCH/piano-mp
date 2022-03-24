import dayjs from "dayjs"
export const WEEK_DAY = ['', '一', '二', '三', '四', '五', '六', '日']

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
    const [expireYear, expireMonth, expireDay] = dayjs(expiryDate).format('YYYY-MM-DD').split('-')
    const [curYear, curMonth, curDay] = dayjs().format('YYYY-MM-DD').split('-')
    let year = expireYear - curYear
    let month = expireMonth - curMonth
    let day = expireDay - curDay
    if (day < 0) {
        day += 30
        month -= 1
    }
    if (month < 0) {
        month += 12
        year -= 1
    }
    return [(year * 2 + month) ? (year * 2 + month) + '月' : '', day ? day + '天' : ''].filter(Boolean).join('') || '-'
}

// n天到期
export const getExpiryDateWarning = (expiryDate, n = 30) => {
    return expiryDate - dayjs() < n * 24 * 60 * 60 * 1000
}
