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
  // 土日 * 4 * 3
  return new Array(3).fill().map((v, i) => {
    const pageStart = new Date()
    pageStart.setHours(0, 0, 0, 0)
    pageStart.setDate(pageStart.getDate() - pageStart.getDay() + 6)
    pageStart.setDate(pageStart.getDate() + i * 7 * 4)
    return new Array(8).fill().map((v, i) => {
      const day = new Date(pageStart)
      day.setDate(day.getDate() + (7 * Math.floor(i / 2)))
      day.setDate(day.getDate() + (i % 2))
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
