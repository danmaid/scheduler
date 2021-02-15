import { v4 as uuid } from 'uuid'

function formatDate(v) {
  const date = new Date(v)
  const yyyy = date.getFullYear()
  const mm = ('00' + (date.getMonth() + 1)).slice(-2)
  const dd = ('00' + date.getDate()).slice(-2)
  const ddd = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  return `${yyyy}-${mm}-${dd}(${ddd})`
}

export default function () {
  // 月～金を5週間
  return new Array(5).fill().map((v, i) => {
    const week = new Date()
    week.setHours(0, 0, 0, 0)
    week.setDate(week.getDate() - week.getDay() + 1)
    week.setDate(week.getDate() + i * 7)
    return new Array(5).fill().map((v, i) => {
      const day = new Date(week)
      day.setDate(day.getDate() + i)
      const start = new Date(day)
      const end = new Date(day)
      end.setDate(end.getDate() + 1)
      end.setTime(end.getTime() - 1)
      return {
        id: uuid(),
        text: formatDate(day),
        value: 'events',
        start,
        end
      }
    })
  })
}
