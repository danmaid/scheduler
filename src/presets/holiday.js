import { v4 as uuid } from 'uuid'
import { getISOWeek } from '../libs/formatter'

export default function () {
  // 土日 * 4 * 3
  return new Array(3).fill().map((v, i) => {
    const saturday = new Date()
    saturday.setHours(0, 0, 0, 0)
    saturday.setDate(saturday.getDate() - saturday.getDay() + 6)
    saturday.setDate(saturday.getDate() + i * 7 * 4)
    return new Array(4).fill().map((v, i) => {
      const start = new Date(saturday)
      start.setDate(start.getDate() + (7 * i))
      const end = new Date(start)
      end.setDate(end.getDate() + 2)
      end.setTime(end.getTime() - 1)
      return {
        id: uuid(),
        text: `${start.getFullYear()}-W${getISOWeek(start)}`,
        start,
        end,
        points: new Array(4).fill().map((v, i) => {
          const date = new Date(start)
          date.setHours(date.getHours() + (i * 12))
          // eslint-disable-next-line no-template-curly-in-string
          return { date, text: i % 2 === 0 ? '午前' : '午後' }
        })
      }
    })
  })
}
