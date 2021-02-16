import { Module } from 'vuex'
import { Event } from './Event'

export type Calendar = {
  id: string
  title: string
  url: string
  start: Date
  end: Date
  events: Event[]
}

const store: Module<Calendar, unknown> = {
  state() {
    const end = new Date()
    end.setMonth(end.getMonth() + 1)
    return {
      id: '',
      title: '',
      url: '',
      start: new Date(),
      end,
      events: []
    }
  }
}

export default store
