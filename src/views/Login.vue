<template>
  <div class="login">
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6">
          <v-list>
            <v-list-item v-for="(item, i) in used" :key="i">
              <v-list-item-content v-text="item" />
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" sm="6">
          <v-row>
            <v-col cols="6" md="4" sm="6" lg="3">
              <v-switch
                v-model="me"
                label="自分既定"
                hide-details
                @change="me ? fetchMe() : removeMe()"
              />
              <v-switch
                v-model="meAll"
                label="自分全部"
                hide-details
                @change="meAll ? fetchMeAll() : removeMeAll()"
              />
            </v-col>
            <v-col cols="6" md="4" sm="6" lg="3">
              <v-switch
                v-model="others"
                label="他人既定"
                hide-details
                @change="others ? fetchOthers() : removeOthers()"
              />
              <v-switch
                v-model="othersAll"
                label="他人全部"
                hide-details
                @change="othersAll ? fetchOthersAll() : removeOthersAll()"
              />
            </v-col>
            <v-col cols="6" md="4" sm="6" lg="3">
              <v-switch
                v-model="users"
                label="全員既定"
                hide-details
                @change="users ? fetchUsers() : removeUsers()"
              />
              <v-switch v-model="usersAll" label="全員全部" hide-details />
            </v-col>
            <v-col cols="6" md="4" sm="6" lg="3">
              <v-switch v-model="groups" label="グループ" hide-details />
              <v-switch v-model="groupsAll" label="全グループ" hide-details />
            </v-col>
          </v-row>
          <v-row>
            <v-card>
              <v-overlay v-model="loading" absolute>
                <v-progress-circular indeterminate size="64" />
              </v-overlay>
              <v-list two-line>
                <v-list-item v-for="(item, i) in fetched" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name" />
                    <v-list-item-subtitle v-if="item.owner" v-text="item.owner.name" />
                  </v-list-item-content>
                  <v-list-item-action v-if="item.from">
                    <v-icon v-if="item.from.includes('me')">mdi-account</v-icon>
                    <v-icon v-if="item.from.includes('meAll')">mdi-account-outline</v-icon>
                    <v-icon v-if="item.from.includes('others')">mdi-account-multiple</v-icon>
                    <v-icon v-if="item.from.includes('othersAll')">mdi-account-multiple-outline</v-icon>
                    <v-icon v-if="item.from.includes('users')">mdi-account-group</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { api as config } from 'config'

export default {
  data() {
    return {
      me: false,
      meAll: false,
      others: false,
      othersAll: false,
      users: false,
      usersAll: false,
      groups: false,
      groupsAll: false,
      used: ['cal1'],
      fetched: [{ name: 'sample1', from: [] }, { name: 'sample2', from: [] }],
      loading: false
    }
  },
  computed: {
    fetchedMe: {
      get() {
        return this.getFetchedList('me')
      },
      set(value) {
        this.setFetchedList('me', value)
      }
    },
    fetchedMeAll: {
      get() {
        return this.getFetchedList('meAll')
      },
      set(value) {
        this.setFetchedList('meAll', value)
      }
    },
    fetchedOthers: {
      get() {
        return this.getFetchedList('others')
      },
      set(value) {
        this.setFetchedList('others', value)
      }
    },
    fetchedOthersAll: {
      get() {
        return this.getFetchedList('othersAll')
      },
      set(value) {
        this.setFetchedList('othersAll', value)
      }
    },
    fetchedUsers: {
      get() {
        return this.getFetchedList('users')
      },
      set(value) {
        this.setFetchedList('users', value)
      }
    }
  },
  methods: {
    ...mapActions({
      getAccessToken: 'account/getAccessToken'
    }),

    getFetchedList(key) {
      return this.fetched.filter(v => v.from.includes(key))
    },
    setFetchedList(key, list) {
      for (let item of this.getFetchedList(key)) {
        const index = this.fetched.findIndex(v => v.id === item.id)
        if (index && this.fetched[index].from.length === 1) {
          this.fetched.splice(index, 1)
        } else if (index) {
          const idx = this.fetched[index].from.findIndex(v => v === key)
          this.fetched[index].from.splice(idx, 1)
        }
      }
      for (let item of list) {
        const exist = this.fetched.find(v => v.id === item.id)
        if (exist) {
          exist.from.push(key)
        } else {
          item.from = [key]
          this.fetched.push(item)
        }
      }
    },

    async fetchMe() {
      this.loading = true
      try {
        const accessToken = await this.getAccessToken()
        const headers = new Headers()
        headers.append('Authorization', 'Bearer ' + accessToken)
        const url = new URL(`${config.baseurl}/me/calendar`)
        const res = await fetch(url, { headers })
        const data = await res.json()
        this.fetchedMe = [data]
      } finally {
        this.loading = false
      }
    },
    removeMe() {
      this.fetchedMe = []
    },

    async fetchMeAll() {
      this.loading = true
      try {
        const accessToken = await this.getAccessToken()
        const headers = new Headers()
        headers.append('Authorization', 'Bearer ' + accessToken)
        const url = new URL(`${config.baseurl}/me/calendars`)
        const res = await fetch(url, { headers })
        const data = await res.json()
        this.fetchedMeAll = data.value
      } finally {
        this.loading = false
      }
    },
    removeMeAll() {
      this.fetchedMeAll = []
    },

    async fetchOthers() {
      this.loading = true
      try {
        const accessToken = await this.getAccessToken(['Calendars.Read.Shared'])
        const headers = new Headers()
        headers.append('Authorization', 'Bearer ' + accessToken)
        const url = new URL(`${config.baseurl}/users`)
        url.searchParams.append('$select', 'id,displayName')
        const res = await fetch(url, { headers })
        const data = await res.json()
        const calendars = []
        for (let user of data.value) {
          const url = new URL(`${config.baseurl}/users/${user.id}/calendar`)
          url.searchParams.append('$select', 'id,name,owner')
          const res = await fetch(url, { headers })
          if (res.ok) {
            const data = await res.json()
            calendars.push(data)
          }
        }
        this.fetchedOthers = calendars
      } finally {
        this.loading = false
      }
    },
    removeOthers() {
      this.fetchedOthers = []
    },

    async fetchOthersAll() {
      this.loading = true
      try {
        const accessToken = await this.getAccessToken(['Calendars.Read.Shared'])
        const headers = new Headers()
        headers.append('Authorization', 'Bearer ' + accessToken)
        const url = new URL(`${config.baseurl}/users`)
        url.searchParams.append('$select', 'id,displayName')
        const res = await fetch(url, { headers })
        const data = await res.json()
        const calendars = []
        for (let user of data.value) {
          const url = new URL(`${config.baseurl}/users/${user.id}/calendars`)
          url.searchParams.append('$select', 'id,name,owner')
          const res = await fetch(url, { headers })
          if (res.ok) {
            const data = await res.json()
            calendars.push(...data.value)
          }
        }
        this.fetchedOthersAll = calendars
      } finally {
        this.loading = false
      }
    },
    removeOthersAll() {
      this.fetchedOthersAll = []
    },

    async fetchUsers() {
      this.loading = true
      try {
        const accessToken = await this.getAccessToken(['User.ReadBasic.All'])
        const headers = new Headers()
        headers.append('Authorization', 'Bearer ' + accessToken)
        const url = new URL(`${config.baseurl}/users`)
        url.searchParams.append('$select', 'id,displayName')
        const res = await fetch(url, { headers })
        const data = await res.json()
        const calendars = []
        for (let user of data.value) {
          const url = new URL(`${config.baseurl}/users/${user.id}/calendar`)
          url.searchParams.append('$select', 'id,name,owner')
          const res = await fetch(url, { headers })
          if (res.ok) {
            const data = await res.json()
            calendars.push(data)
          }
        }
        this.fetchedUsers = calendars
      } finally {
        this.loading = false
      }
    },
    removeUsers() {
      this.fetchedUsers = []
    }
  }
}
</script>
