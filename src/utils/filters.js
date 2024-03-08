import Vue from 'vue';


//时间戳转换(年月日)
Vue.filter('timeFormat', (value, type = '') => {
    if (value) {
        const date = new Date(value)
        const year = date.getFullYear()
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)
        const hours = ("0" + date.getHours()).slice(-2)
        const minutes = ("0" + date.getMinutes()).slice(-2)
        const seconds = ("0" + date.getSeconds()).slice(-2)

        return `${year}年${month}月${day}日${hours}:${minutes}:${seconds}`
    } else {
        return "--"
    }
});

