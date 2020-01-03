<template>
  <div class="settings">
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6">
          <v-row>
            <v-col cols="6" md="4" sm="6" lg="3">
              <v-switch v-model="me" hide-details color="red" @change="me ? fetchMe() : removeMe()">
                <template v-slot:label>
                  自分既定
                  <v-icon color="red">mdi-account</v-icon>
                </template>
              </v-switch>
              <v-switch
                v-model="meAll"
                hide-details
                color="pink"
                @change="meAll ? fetchMeAll() : removeMeAll()"
              >
                <template v-slot:label>
                  自分全部
                  <v-icon color="pink">mdi-account-outline</v-icon>
                </template>
              </v-switch>
            </v-col>
            <v-col cols="6" md="4" sm="6" lg="3">
              <v-switch
                v-model="others"
                hide-details
                color="indigo"
                @change="others ? fetchOthers() : removeOthers()"
              >
                <template v-slot:label>
                  他人既定
                  <v-icon color="indigo">mdi-account-circle</v-icon>
                </template>
              </v-switch>
              <v-switch
                v-model="othersAll"
                hide-details
                color="blue"
                @change="othersAll ? fetchOthersAll() : removeOthersAll()"
              >
                <template v-slot:label>
                  他人全部
                  <v-icon color="blue">mdi-account-circle-outline</v-icon>
                </template>
              </v-switch>
            </v-col>
            <v-col cols="6" md="4" sm="6" lg="3">
              <v-switch
                v-model="users"
                hide-details
                color="green"
                @change="users ? fetchUsers() : removeUsers()"
              >
                <template v-slot:label>
                  全員既定
                  <v-icon color="green">mdi-account-box</v-icon>
                </template>
              </v-switch>
              <v-switch
                v-model="usersAll"
                hide-details
                color="teal"
                @change="usersAll ? fetchUsersAll() : removeUsersAll()"
              >
                <template v-slot:label>
                  全員全部
                  <v-icon color="teal">mdi-account-box-outline</v-icon>
                </template>
              </v-switch>
            </v-col>
            <v-col cols="6" md="4" sm="6" lg="3">
              <v-switch
                v-model="groups"
                hide-details
                color="orange"
                @change="groups ? fetchGroups() : removeGroups()"
              >
                <template v-slot:label>
                  グループ
                  <v-icon color="orange">mdi-account-multiple</v-icon>
                </template>
              </v-switch>
              <v-switch
                v-model="groupsAll"
                hide-details
                color="deep-orange"
                @change="groupsAll ? fetchGroupsAll() : removeGroupsAll()"
              >
                <template v-slot:label>
                  全グループ
                  <v-icon color="deep-orange">mdi-account-multiple-outline</v-icon>
                </template>
              </v-switch>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card>
            <v-overlay v-model="loading" absolute>
              <v-progress-circular indeterminate size="64" />
            </v-overlay>
            <v-data-table :items="fetched" :headers="headers">
              <template v-slot:item.from="{ item }">
                <v-icon v-if="item.from.includes('me')" color="red">mdi-account</v-icon>
                <v-icon v-if="item.from.includes('meAll')" color="pink">mdi-account-outline</v-icon>
                <v-icon v-if="item.from.includes('others')" color="indigo">mdi-account-circle</v-icon>
                <v-icon
                  v-if="item.from.includes('othersAll')"
                  color="blue"
                >mdi-account-circle-outline</v-icon>
                <v-icon v-if="item.from.includes('users')" color="green">mdi-account-box</v-icon>
                <v-icon v-if="item.from.includes('usersAll')" color="teal">mdi-account-box-outline</v-icon>
                <v-icon v-if="item.from.includes('groups')" color="orange">mdi-account-multiple</v-icon>
                <v-icon
                  v-if="item.from.includes('groupsAll')"
                  color="deep-orange"
                >mdi-account-multiple-outline</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" sm="1" class="d-flex align-center">
          <v-btn color="primary">
            <v-icon>mdi-chevron-triple-right</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" sm="5">
          <v-list>
            <v-list-item v-for="(item, i) in used" :key="i">
              <v-list-item-content v-text="item" />
            </v-list-item>
          </v-list>
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
      fetched: [],
      loading: false,
      headers: [
        { text: 'カレンダー名', value: 'name' },
        { text: '所有者', value: 'owner.name' },
        { text: '取得元', value: 'from' }
      ]
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
    },
    fetchedUsersAll: {
      get() {
        return this.getFetchedList('usersAll')
      },
      set(value) {
        this.setFetchedList('usersAll', value)
      }
    },
    fetchedGroups: {
      get() {
        return this.getFetchedList('groups')
      },
      set(value) {
        this.setFetchedList('groups', value)
      }
    },
    fetchedGroupsAll: {
      get() {
        return this.getFetchedList('groupsAll')
      },
      set(value) {
        this.setFetchedList('groupsAll', value)
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
        if (index >= 0 && this.fetched[index].from.length === 1) {
          this.fetched.splice(index, 1)
        } else if (index >= 0) {
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
    },

    async fetchUsersAll() {
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
          const url = new URL(`${config.baseurl}/users/${user.id}/calendars`)
          url.searchParams.append('$select', 'id,name,owner')
          const res = await fetch(url, { headers })
          if (res.ok) {
            const data = await res.json()
            calendars.push(...data.value)
          }
        }
        this.fetchedUsersAll = calendars
      } finally {
        this.loading = false
      }
    },
    removeUsersAll() {
      this.fetchedUsersAll = []
    },

    async fetchGroups() {
      this.loading = true
      try {
        const accessToken = await this.getAccessToken()
        const headers = new Headers()
        headers.append('Authorization', 'Bearer ' + accessToken)
        const url = new URL(`${config.baseurl}/groups`)
        url.searchParams.append('$select', 'id,displayName')
        const res = await fetch(url, { headers })
        const data = await res.json()
        const calendars = []
        for (let group of data.value) {
          const url = new URL(`${config.baseurl}/groups/${group.id}/calendar`)
          url.searchParams.append('$select', 'id,name,owner')
          const res = await fetch(url, { headers })
          if (res.ok) {
            const data = await res.json()
            calendars.push(data)
          }
        }
        this.fetchedGroups = calendars
      } finally {
        this.loading = false
      }
    },
    removeGroups() {
      this.fetchedGroups = []
    },

    async fetchGroupsAll() {
      this.loading = true
      try {
        const accessToken = await this.getAccessToken(['Group.Read.All'])
        const headers = new Headers()
        headers.append('Authorization', 'Bearer ' + accessToken)
        const url = new URL(`${config.baseurl}/groups`)
        url.searchParams.append('$select', 'id,displayName')
        const res = await fetch(url, { headers })
        const data = await res.json()
        const calendars = []
        for (let group of data.value) {
          const url = new URL(`${config.baseurl}/groups/${group.id}/calendar`)
          url.searchParams.append('$select', 'id,name,owner')
          const res = await fetch(url, { headers })
          if (res.ok) {
            const data = await res.json()
            calendars.push(data)
          }
        }
        this.fetchedGroupsAll = calendars
      } finally {
        this.loading = false
      }
    },
    removeGroupsAll() {
      this.fetchedGroupsAll = []
    }
  }
}
</script>
