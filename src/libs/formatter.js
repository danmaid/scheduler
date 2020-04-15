/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-template-curly-in-string
export function formatDate(v, format = '${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}') {
  const date = new Date(v)
  const yyyy = date.getFullYear()
  const mm = ('00' + (date.getMonth() + 1)).slice(-2)
  const dd = ('00' + date.getDate()).slice(-2)
  const ddd = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  const HH = ('00' + date.getHours()).slice(-2)
  const MM = ('00' + date.getMinutes()).slice(-2)
  const SS = ('00' + date.getSeconds()).slice(-2)
  // eslint-disable-next-line no-eval
  return eval('`' + format + '`')
}

export function getISOWeek(date) {
  // 木曜日を基準に週を算出
  const thursday = new Date(date)
  thursday.setHours(0, 0, 0, 0)
  thursday.setDate(thursday.getDate() - thursday.getDay() + 4)
  const base = new Date(thursday.getFullYear(), 0, 1)
  return Math.floor((thursday - base) / (7 * 24 * 60 * 60 * 1000))
}
