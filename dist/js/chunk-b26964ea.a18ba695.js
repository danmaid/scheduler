(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b26964ea"],{"1e7c":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{staticClass:"standard",attrs:{fluid:""}},[a("v-data-table",{attrs:{headers:t.headers,items:t.value,"group-by":"category","disable-sort":""},scopedSlots:t._u([{key:"header.name",fn:function(){return[t._t("navigation",[a("v-btn",{attrs:{icon:""},on:{click:function(e){return t.$emit("prev")}}},[a("v-icon",[t._v("mdi-chevron-left")])],1),t.label?a("span",{staticStyle:{cursor:"pointer"},domProps:{textContent:t._s(t.label)},on:{click:function(e){return t.$emit("home")}}}):t._e(),a("v-btn",{attrs:{icon:""},on:{click:function(e){return t.$emit("next")}}},[a("v-icon",[t._v("mdi-chevron-right")])],1)])]},proxy:!0},{key:"header.events",fn:function(e){var n=e.header;return[t._t("header",[a("div",{staticStyle:{display:"grid"},style:{"grid-template-columns":"repeat("+n.points.length+", 1fr)"}},[t._l(n.points,(function(e){return[a("span",{key:e.date.getTime(),domProps:{textContent:t._s(e.text)}})]}))],2)],{header:n})]}},{key:"header.actions",fn:function(e){var a=e.header;return[t._t("actions",null,{header:a})]}},{key:"item.events",fn:function(e){var n=e.value,r=e.header,s=e.item;return[a("div",{staticStyle:{display:"grid","overflow-x":"hidden","align-content":"start",height:"100%"},style:{"grid-template-columns":"repeat("+r.points.length+", 1fr)"}},[t._l(t.getEvents(n,r,r.rows.get(s.id)),(function(e){return[a("event-summary",{key:e.id,style:t.getStyle(e,{points:r.points,rows:r.rows.get(s.id)}),attrs:{value:e,disabled:s.loading}})]}))],2)]}},{key:"item.actions",fn:function(e){e.value;var n=e.item;return[a("v-btn",{attrs:{icon:"",loading:n.loading},on:{click:function(e){return t.$emit("refresh",n)}}},[a("v-icon",{attrs:{small:""}},[t._v("mdi-refresh")])],1)]}}],null,!0)})],1)},r=[],s=(a("99af"),a("a623"),a("cb29"),a("4de4"),a("c740"),a("4160"),a("d81d"),a("13d5"),a("45fc"),a("4ec9"),a("d3b7"),a("3ca3"),a("ddb0"),a("2909")),i=a("5530"),o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"event-summary"},[a("v-menu",{key:t.id,attrs:{"close-on-content-click":!1,"offset-y":""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return[a("v-chip",t._g({staticClass:"event-summary__chip",attrs:{label:"",color:t.color,disabled:t.disabled},domProps:{textContent:t._s(t.formatDate(t.start,"${HH}:${MM}")+" "+t.name)}},n))]}}])},[a("v-card",[a("v-toolbar",{attrs:{color:t.color}},[a("v-toolbar-title",{domProps:{textContent:t._s(t.name)}})],1),a("v-list",[a("v-list-item",[a("v-list-item-content",[t._v("id")]),a("v-list-item-content",{domProps:{textContent:t._s(t.id)}})],1),a("v-list-item",[a("v-list-item-content",[t._v("start")]),a("v-list-item-content",{domProps:{textContent:t._s(t.start)}})],1),a("v-list-item",[a("v-list-item-content",[t._v("end")]),a("v-list-item-content",{domProps:{textContent:t._s(t.end)}})],1)],1)],1)],1)],1)},c=[],d=(a("b0c0"),a("3e93")),l={name:"Event",props:{value:{type:Object,required:!0},disabled:{type:Boolean,default:!1}},data:function(){return{id:this.value.id,start:this.value.start,end:this.value.end,name:this.value.name,color:this.value.color}},methods:{formatDate:d["a"]}},u=l,v=(a("1f24"),a("2877")),f=a("6544"),m=a.n(f),p=a("b0af"),h=a("cc20"),_=a("8860"),g=a("da13"),y=a("5d23"),b=a("e449"),w=a("71d9"),D=a("2a7f"),k=Object(v["a"])(u,o,c,!1,null,"5a72e342",null),$=k.exports;m()(k,{VCard:p["a"],VChip:h["a"],VList:_["a"],VListItem:g["a"],VListItemContent:y["a"],VMenu:b["a"],VToolbar:w["a"],VToolbarTitle:D["a"]});var x={components:{EventSummary:$},props:{value:{type:Array,validator:function(t){return t.every((function(t){var e=t.id;return e}))},required:!0},label:{type:String,default:void 0},ranges:{type:Array,validator:function(t){return t.every((function(t){var e=t.start,a=t.end,n=t.points;return e instanceof Date&&a instanceof Date&&(!n||Array.isArray(n)&&n.every((function(t){var e=t.date;return e instanceof Date})))}))},required:!0}},computed:{headers:function(){var t=this,e=this.ranges.map((function(e){return Object(i["a"])({value:"events",class:"hoge",width:"".concat(100/t.ranges.length,"%"),divider:!0,rows:new Map(t.value.map((function(t){var a=t.id;return[a,new Array(e.points.length).fill(0)]})))},e)}));return[{value:"name",divider:!0,width:200,class:"pa-1 d-flex align-center justify-space-between"}].concat(Object(s["a"])(e),[{value:"actions",sortable:!1,width:10}])}},methods:{getEvents:function(t,e,a){var n=e.start,r=e.end,s=e.points;if(!Array.isArray(t)||!Array.isArray(s)||!Array.isArray(a))return[];a.fill(0);var i=t.filter((function(t){return t.start<=r&&t.end>=n})).reduce((function(t,e){return s.some((function(t){return e.start<t.date&&t.date<e.end}))?t.spaned.push(e):t.single.push(e),t}),{spaned:[],single:[]}),o=i.spaned,c=i.single;o.sort((function(t,e){return t.start<e.start?-1:t.start>e.start?1:0})),c.sort((function(t,e){return t.start<e.start?-1:t.start>e.start?1:0}));var d=[].concat(o,c);return d},getStyle:function(t,e){var a=t.start,n=t.end,r=e.points,i=e.rows,o={},c=r.findIndex((function(t){return t.date>a}));r[0].date>a?(o["grid-column-start"]=1,o["margin-left"]="-8px"):o["grid-column-start"]=c<0?r.length:c;var d=r.findIndex((function(t){return t.date>n}));r[r.length-1].date<n?(o["grid-column-end"]=-1,o["margin-right"]="-8px"):o["grid-column-end"]=d+1;for(var l=[],u=o["grid-column-start"]-1;u+1<=(o["grid-column-end"]>0?o["grid-column-end"]-1:i.length);u++)l.push(u);var v=Math.max.apply(Math,Object(s["a"])(l.map((function(t){return i[t]}))))+1;return o["grid-row"]=v,l.forEach((function(t){i[t]=v})),o}}},O=x,j=a("8336"),C=a("a523"),E=a("8fea"),A=a("132d"),M=Object(v["a"])(O,n,r,!1,null,null,null);e["a"]=M.exports;m()(M,{VBtn:j["a"],VContainer:C["a"],VDataTable:E["a"],VIcon:A["a"]})},"1f24":function(t,e,a){"use strict";var n=a("74cb"),r=a.n(n);r.a},"3e93":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return formatDate})),__webpack_require__.d(__webpack_exports__,"b",(function(){return getISOWeek}));var core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("fb6a"),core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_0__);function formatDate(v){var format=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}",date=new Date(v),yyyy=date.getFullYear(),mm=("00"+(date.getMonth()+1)).slice(-2),dd=("00"+date.getDate()).slice(-2),ddd=["日","月","火","水","木","金","土"][date.getDay()],HH=("00"+date.getHours()).slice(-2),MM=("00"+date.getMinutes()).slice(-2),SS=("00"+date.getSeconds()).slice(-2);return eval("`"+format+"`")}function getISOWeek(t){var e=new Date(t);e.setHours(0,0,0,0),e.setDate(e.getDate()-e.getDay()+4);var a=new Date(e.getFullYear(),0,1);return Math.floor((e-a)/6048e5)}},"615b":function(t,e,a){},"74cb":function(t,e,a){},"81d5":function(t,e,a){"use strict";var n=a("7b0b"),r=a("23cb"),s=a("50c4");t.exports=function(t){var e=n(this),a=s(e.length),i=arguments.length,o=r(i>1?arguments[1]:void 0,a),c=i>2?arguments[2]:void 0,d=void 0===c?a:r(c,a);while(d>o)e[o++]=t;return e}},"84f7":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{staticClass:"day",attrs:{fluid:""}},[a("schedule-grid",{attrs:{value:t.calendars,ranges:t.ranges,label:t.label},on:{prev:t.prev,next:t.next,home:t.goToday,refresh:t.getEventsFromApi}})],1)},r=[],s=(a("cb29"),a("4160"),a("d81d"),a("d3b7"),a("159b"),a("96cf"),a("1da1")),i=a("5530"),o=a("2f62"),c=a("1e7c"),d=a("3e93"),l={components:{ScheduleGrid:c["a"]},props:{date:{type:String,default:void 0}},computed:Object(i["a"])({},Object(o["c"])({calendars:function(t){return t.calendars.map((function(t){return Object(i["a"])({},t,{loading:!1,events:[]})}))}}),{baseDate:function(){return this.date?new Date(this.date):new Date},label:function(){return Object(d["a"])(this.baseDate,"${yyyy}-${mm}-${dd}(${ddd})")},ranges:function(){var t=new Date(this.baseDate);t.setHours(0,0,0,0);var e=new Date(t);e.setDate(e.getDate()+1),e.setTime(e.getTime()-1);var a=new Array(24).fill().map((function(e,a){var n=new Date(t);n.setHours(n.getHours()+a);var r=Object(d["a"])(n,"${HH}:${MM}");return{text:r,date:n}}));return[{start:t,end:e,points:a}]}}),watch:{$route:function(){this.initialize()}},mounted:function(){this.initialize()},methods:{initialize:function(){var t=this;this.calendars.forEach((function(e){t.getEventsFromApi(e)}))},getEventsFromApi:function(t){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function a(){var n,r,s,i,o;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return n=t,n.loading=!0,r=n.url,a.next=5,fetch(r);case 5:return s=a.sent,a.next=8,s.text();case 8:i=a.sent,o=JSON.parse(i,e.reviver),setTimeout((function(){Array.isArray(o)&&(n.events=o),n.loading=!1}),3e3);case 11:case"end":return a.stop()}}),a)})))()},reviver:function(t,e){return"string"===typeof e&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(e)?new Date(e):e},prev:function(){var t=new Date(this.baseDate);t.setDate(t.getDate()-1),this.$router.push({params:{date:Object(d["a"])(t,"${yyyy}-${mm}-${dd}")}})},next:function(){var t=new Date(this.baseDate);t.setDate(t.getDate()+1),this.$router.push({params:{date:Object(d["a"])(t,"${yyyy}-${mm}-${dd}")}})},goToday:function(){var t=new Date;this.$router.push({params:{date:Object(d["a"])(t,"${yyyy}-${mm}-${dd}")}})}}},u=l,v=a("2877"),f=a("6544"),m=a.n(f),p=a("a523"),h=Object(v["a"])(u,n,r,!1,null,null,null);e["default"]=h.exports;m()(h,{VContainer:p["a"]})},b0af:function(t,e,a){"use strict";a("0481"),a("4069"),a("a9e3");var n=a("5530"),r=(a("615b"),a("10d2")),s=a("297c"),i=a("1c87"),o=a("58df");e["a"]=Object(o["a"])(s["a"],i["a"],r["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},outlined:Boolean,raised:Boolean,shaped:Boolean},computed:{classes:function(){return Object(n["a"])({"v-card":!0},i["a"].options.computed.classes.call(this),{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--outlined":this.outlined,"v-card--raised":this.raised,"v-card--shaped":this.shaped},r["a"].options.computed.classes.call(this))},styles:function(){var t=Object(n["a"])({},r["a"].options.computed.styles.call(this));return this.img&&(t.background='url("'.concat(this.img,'") center center / cover no-repeat')),t}},methods:{genProgress:function(){var t=s["a"].options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var e=this.generateRouteLink(),a=e.tag,n=e.data;return n.style=this.styles,this.isClickable&&(n.attrs=n.attrs||{},n.attrs.tabindex=0),t(a,this.setBackgroundColor(this.color,n),[this.genProgress(),this.$slots.default])}})},cb29:function(t,e,a){var n=a("23e7"),r=a("81d5"),s=a("44d2");n({target:"Array",proto:!0},{fill:r}),s("fill")}}]);
//# sourceMappingURL=chunk-b26964ea.a18ba695.js.map