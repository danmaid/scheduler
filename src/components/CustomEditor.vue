<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>ビュー設定</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-text-field v-model="viewName" label="表示名"></v-text-field>
      <v-row>
        <v-col cols="8">
          <v-data-table
            :items="items"
            :headers="headers"
            height="600"
            disable-sort
            group-by="range"
            :items-per-page="-1"
            hide-default-footer
            fixed-header
          >
            <template #header.actions>
              <v-btn icon small @click="ranges.push([{ id: genId() }])">
                <v-icon>mdi-playlist-plus</v-icon>
              </v-btn>
            </template>

            <template v-slot:group.header="{ headers, group, toggle, isOpen }">
              <td :colspan="headers.length" class="text-start pa-0" :class="colors[group]">
                <v-list-item>
                  <v-list-item-action class="ma-0">
                    <v-btn icon small @click="toggle">
                      <v-icon v-text="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                    </v-btn>
                  </v-list-item-action>

                  <v-list-item-content>
                    <span v-text="group + 1"></span>
                  </v-list-item-content>

                  <v-list-item-action class="ma-0">
                    <div class="d-flex">
                      <v-btn icon small @click="ranges.splice(group, 1)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-btn icon small :disabled="!canUpGroup(group)" @click="upGroup(group)">
                        <v-icon>mdi-arrow-up</v-icon>
                      </v-btn>
                      <v-btn icon small :disabled="!canDownGroup(group)" @click="downGroup(group)">
                        <v-icon>mdi-arrow-down</v-icon>
                      </v-btn>
                      <v-btn icon small @click="ranges[group].push({ id: genId() })">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </v-list-item-action>
                </v-list-item>
              </td>
            </template>

            <template v-slot:item.text="{ item, value, header }">
              <v-edit-dialog :return-value.sync="item.text" large>
                {{ value }}
                <template v-slot:input>
                  <v-text-field v-model="item.text" :label="header.text" single-line autofocus></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:item.start="{ item, value }">
              <v-edit-dialog :return-value.sync="item.start" large @save="item.start = new Date(value)">
                {{ value && formatDate(value) }}
                <template v-slot:input>
                  <input-date-time v-model="item.start"></input-date-time>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:item.end="{ item, value }">
              <v-edit-dialog :return-value.sync="item.end" large @save="item.end = new Date(value)">
                {{ value && formatDate(value) }}
                <template v-slot:input>
                  <input-date-time v-model="item.end"></input-date-time>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:item.value="{ item }">
              <!-- <v-simple-checkbox -->
              <v-checkbox
                v-model="item.value"
                hide-details
                @input="item.value = item.value ? 'events' : undefined"
              ></v-checkbox>
              <!-- ></v-simple-checkbox> -->
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex">
                <v-btn icon small :disabled="!canRemove(item)" @click="remove(item)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-btn icon small :disabled="!canUp(item)" @click="up(item)">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn icon small :disabled="!canDown(item)" @click="down(item)">
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
                <v-btn icon small @click="add(item)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-col>
        <v-col>
          <v-label>プレビュー</v-label>
          <v-date-picker
            ref="picker"
            readonly
            no-title
            :min="min"
            :max="max"
            :events="getEvent"
            full-width
          ></v-date-picker>
          <v-container>
            <v-row>
              <v-label>プリセット</v-label>
            </v-row>
            <v-row>
              <v-col v-for="{ text, generator } of presets" :key="text">
                <v-btn v-text="text" @click="ranges = generator()"></v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="$emit('close')">cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="commit" color="primary">保存</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import InputDateTime from './InputDateTime.vue'
import { v4 as uuid } from 'uuid'
import presetsDefault from '../presets/default'
import presetsHoliday from '../presets/holiday'

export default Vue.extend({
  components: { InputDateTime },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      viewName: this.name,
      ranges: JSON.parse(JSON.stringify(this.value), this.reviver),
      headers: [
        { text: 'ラベル', value: 'text' },
        { text: '開始日時', value: 'start' },
        { text: '終了日時', value: 'end' },
        { text: '表示', value: 'value' },
        { text: 'group', value: 'range' },
        { value: 'actions', width: 10, align: 'right' }
      ],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange'],
      presets: [
        { text: '月～金 5週間', generator: presetsDefault },
        { text: '土日 *4 *3', generator: presetsHoliday }
      ]
    }
  },
  computed: {
    items() {
      return [].concat(
        ...this.ranges.map((r, i) =>
          r.map(v => {
            v.range = i
            return v
          })
        )
      )
    },
    min() {
      return this.formatDate(
        new Date(
          Math.min(...this.items.filter(v => v.start).map(v => v.start))
        ),
        // eslint-disable-next-line no-template-curly-in-string
        '${yyyy}-${mm}-${dd}'
      )
    },
    max() {
      return this.formatDate(
        new Date(Math.max(...this.items.filter(v => v.end).map(v => v.end))),
        // eslint-disable-next-line no-template-curly-in-string
        '${yyyy}-${mm}-${dd}'
      )
    }
  },
  mounted() {
    this.$refs.picker.activePicker = 'Month'
  },
  methods: {
    commit() {
      this.$emit('input', { name: this.viewName, ranges: this.ranges })
      this.$emit('close')
    },
    // eslint-disable-next-line no-template-curly-in-string
    formatDate(v, format = '${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}') {
      const date = new Date(v)
      // eslint-disable-next-line no-unused-vars
      const yyyy = date.getFullYear()
      // eslint-disable-next-line no-unused-vars
      const mm = ('00' + (date.getMonth() + 1)).slice(-2)
      // eslint-disable-next-line no-unused-vars
      const dd = ('00' + date.getDate()).slice(-2)
      // eslint-disable-next-line no-unused-vars
      const ddd = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
      // eslint-disable-next-line no-unused-vars
      const HH = ('00' + date.getHours()).slice(-2)
      // eslint-disable-next-line no-unused-vars
      const MM = ('00' + date.getMinutes()).slice(-2)
      // eslint-disable-next-line no-unused-vars
      const SS = ('00' + date.getSeconds()).slice(-2)
      // eslint-disable-next-line no-eval
      return eval('`' + format + '`')
    },
    getEvent(v) {
      const date = new Date(v)
      return this.items
        .filter(({ start, end }) => start <= date && date <= end)
        .map(v => this.colors[v.range])
    },
    genId: uuid,
    add(item) {
      const items = this.ranges[item.range]
      const index = items.findIndex(v => v.id === item.id)
      if (index >= 0) {
        items.splice(index + 1, 0, { id: this.genId() })
      }
    },
    canRemove(item) {
      return this.ranges[item.range].length > 1
    },
    remove(item) {
      const items = this.ranges[item.range]
      const index = items.findIndex(v => v.id === item.id)
      if (index >= 0) {
        items.splice(index, 1)
      }
    },
    reviver(key, value) {
      return typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ? new Date(value)
        : value
    },
    canUpGroup(group) {
      return group > 0
    },
    upGroup(group) {
      const index = group
      const removed = this.ranges.splice(index, 1)
      this.ranges.splice(index - 1, 0, ...removed)
    },
    canDownGroup(group) {
      return group < this.ranges.length - 1
    },
    downGroup(v) {
      const index = v
      const removed = this.ranges.splice(index, 1)
      this.ranges.splice(index + 1, 0, ...removed)
    },
    canUp(item) {
      return this.items.findIndex(v => v === item) > 0
    },
    up(item) {
      const items = this.ranges[item.range]
      const index = items.findIndex(v => v.id === item.id)
      if (index >= 0) {
        const removed = items.splice(index, 1)
        if (index > 0) {
          items.splice(index - 1, 0, ...removed)
        } else if (index === 0) {
          this.ranges[item.range - 1].push(...removed)
        }
      }
    },
    canDown(item) {
      return this.items.findIndex(v => v === item) < this.items.length - 1
    },
    down(item) {
      const items = this.ranges[item.range]
      const index = items.findIndex(v => v.id === item.id)
      if (index >= 0) {
        const removed = items.splice(index, 1)
        if (index < items.length) {
          items.splice(index + 1, 0, ...removed)
        } else if (index === items.length) {
          this.ranges[item.range + 1].unshift(...removed)
        }
      }
    }
  }
})
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgb(57, 57, 63);
  border: 0 none #fff;
  border-radius: 50px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border: 0 none #fff;
  border-radius: 0;
}
</style>
