<template>
  <!-- list -->
  <div class="w-100" v-if="Array.isArray(jdata)">
    <v-list>
      <v-list-item v-for="item in jdata" :key="item.name">
        <v-list-item-content>
          <DargsItem :jdata="item" ref="subitem" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
  <div class="w-100 mx-1" v-else-if="jdata.object == 'Argument'">
    <v-row class="w-100">
      <v-col cols="auto">
        <v-checkbox v-model="check" v-if="jdata.optional"></v-checkbox> </v-col
      ><v-col>
        <!-- text areas for list -->
        <v-textarea
          v-if="jdata.type.includes('list')"
          v-model="value"
          :hint="jdata.doc"
          :placeholder="
            Array.isArray(jdata.type) ? jdata.type.join(' or ') : jdata.type
          "
          :rules="!jdata.optional ? rules.required : []"
          clearable
          @input="up"
        >
          <template v-slot:label>
            <div>
              {{ jdata.name }} <small v-if="jdata.optional">(optional)</small>
            </div>
          </template>
          <template v-slot:message="{ message, key }">
            <div v-html="message.replaceAll('\n', '<br/>')" :key="key"></div>
          </template>
        </v-textarea>
        <!-- text field for str, int, float -->
        <v-text-field
          :hint="jdata.doc"
          v-model="value"
          :placeholder="
            Array.isArray(jdata.type) ? jdata.type.join(' or ') : jdata.type
          "
          :rules="[
            ...(!jdata.optional ? rules.required : []),
            ...(!jdata.type.includes(['str']) ? rules.number : []),
          ]"
          v-else-if="
            ['str', 'int', 'float'].some((tt) => jdata.type.includes(tt))
          "
          clearable
          @input="up"
        >
          <template v-slot:label>
            <div>
              {{ jdata.name }} <small v-if="jdata.optional">(optional)</small>
            </div>
          </template>
          <template v-slot:message="{ message, key }">
            <div v-html="message.replaceAll('\n', '<br/>')" :key="key"></div>
          </template>
        </v-text-field>

        <!-- switch for bool -->
        <v-switch
          v-else-if="jdata.type.includes('bool')"
          v-model="value"
          :hint="jdata.doc"
          :disabled="!check"
        >
          <template v-slot:label>
            <div>
              {{ jdata.name }} <small v-if="jdata.optional">(optional)</small>
            </div>
          </template>
          <template v-slot:message="{ message, key }">
            <div
              v-html="message.replaceAll('\n', '<br/>')"
              :key="key"
            ></div> </template
        ></v-switch>

        <div v-else-if="jdata.type.includes('dict')">
          <!-- dict sub_fields -->
          <v-list v-if="Object.keys(jdata.sub_fields).length">
            <v-list-item-title> {{ jdata.name }}</v-list-item-title>
            <v-list-item-subtitle> {{ jdata.doc }}</v-list-item-subtitle>
            <v-list-item v-for="item in jdata.sub_fields" :key="item.name">
              <!-- jdata.sub_fields is object -->
              <v-list-item-content>
                <DargsItem :jdata="item" ref="subitem" />
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <!-- dict variant -->
          <v-list v-if="Object.keys(jdata.sub_variants).length" subheader>
            <v-list-item-title> {{ jdata.name }}</v-list-item-title>
            <v-list-item-subtitle> {{ jdata.doc }}</v-list-item-subtitle>
            <v-list-item v-for="item in jdata.sub_variants" :key="item.name">
              <!-- jdata.sub_fields is object -->
              <v-list-item-content>
                <DargsItem :jdata="item" ref="subvariant" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
    </v-row>
  </div>
  <div class="w-100" v-else-if="jdata.object == 'Variant'">
    <v-tabs v-model="tab" show-arrows>
      <v-tab v-for="item in jdata.choice_dict" :key="item.name">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <!-- important: use eager prop to let this.$refs["subitem"][this.tab] not undefined -->
      <v-tab-item v-for="item in jdata.choice_dict" :key="item.name" eager>
        <v-card flat>
          <DargsItem :jdata="item" ref="subitem" />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "DargsItem",
  props: {
    jdata: [Object, Array],
  },
  data() {
    var tab = 0;
    if (this.jdata.object == "Variant") {
      if (this.jdata.default_tag) {
        tab = Object.keys(this.jdata.choice_dict).indexOf(
          this.jdata.default_tag
        );
      }
      if (tab < 0) tab = 0;
    }
    return {
      tab: tab,
      value: null,
      check: !this.jdata.optional,
      rules: {
        required: [(value) => !!value || "Required."],
        number: [(value) => !value || !isNaN(value) || "Number required."],
      },
    };
  },
  methods: {
    /**
     * Get a object.
     * @returns {object} The returned obj.
     */
    dvalue: function () {
      if (Array.isArray(this.jdata)) {
        return Object.fromEntries(
          new Map(
            this.$refs["subitem"]
              .filter((vv) => !vv.jdata.optional || vv.check)
              .map((vv) => [vv.jdata.name, vv.dvalue()])
          )
        );
      } else if (this.jdata.object == "Argument") {
        if (this.jdata.type.includes("list")) {
          // textarea -> list
          if (!this.value) return [];
          return this.value
            .trim()
            .split("\n")
            .map((v) => {
              if (v.toLowerCase() == "null") {
                return null;
              } else if (v.toLowerCase() == "true") {
                return true;
              } else if (v.toLowerCase() == "false") {
                return false;
              } else if (!isNaN(v)) {
                // number
                return Number.parseFloat(v);
              }
              try {
                return JSON.parse(v);
              } catch (e) {
                return v;
              }
            });
        } else if (
          ["str", "int", "float"].some((tt) => this.jdata.type.includes(tt))
        ) {
          if (!this.value) {
            if (this.jdata.type.includes("str")) return "";
            else return 0;
          }
          if (!this.jdata.type.includes("str")) {
            return Number.parseFloat(this.value);
          }
          return this.value;
        } else if (this.jdata.type.includes("bool")) {
          if (!this.check) return null;
          return this.value;
        } else if (this.jdata.type.includes("dict")) {
          const sub_fields = Object.keys(this.jdata.sub_fields).length
            ? Object.fromEntries(
                new Map(
                  this.$refs["subitem"]
                    .filter((vv) => !vv.jdata.optional || vv.check)
                    .map((vv) => [vv.jdata.name, vv.dvalue()])
                )
              )
            : Object();

          const sub_variants = Object.keys(this.jdata.sub_variants).length
            ? Object.assign(
                ...this.$refs["subvariant"].map((vv) => vv.dvalue())
              )
            : Object();
          return {
            ...sub_fields,
            ...sub_variants,
          };
        }
      } else if (this.jdata.object == "Variant") {
        // the current vaiant: this.tab
        const flag = Object.fromEntries(
          new Map([
            [
              this.jdata.flag_name,
              Object.keys(this.jdata.choice_dict)[this.tab],
            ],
          ])
        );
        return {
          ...flag,
          ...this.$refs["subitem"][this.tab].dvalue(),
        };
      }
      return null;
    },
    up: function () {
      if (this.value) {
        this.check = true;
      }
    },
    /**
     * Load data from an object.
     * @param {object} obj the object to load
     */
    load: function (obj) {
      const load_subitem = () => {
        if (this.$refs["subitem"])
          this.$refs["subitem"].forEach((vv) => {
            // check if it exists, name and alias
            if (vv.jdata.name in obj) {
              // exists
              vv.load(obj[vv.jdata.name]);
            }
            if (vv.jdata.optional) {
              vv.check = vv.jdata.name in obj;
            }
          });
      };
      if (Array.isArray(this.jdata)) {
        // array
        load_subitem();
      } else if (this.jdata.object == "Argument") {
        if (this.jdata.type.includes("list") && Array.isArray(obj)) {
          // list -> multiple line str
          this.value = obj.map(String).join("\n");
        } else if (
          ["str", "int", "float"].some((tt) => this.jdata.type.includes(tt))
        ) {
          // str, int, float -> str
          this.value = String(obj);
        } else if (this.jdata.type.includes("bool")) {
          // bool
          this.value = obj;
        } else if (this.jdata.type.includes("dict")) {
          load_subitem();
          if (this.$refs["subvariant"])
            this.$refs["subvariant"].forEach((vv) => {
              vv.load(obj);
            });
        }
      } else if (this.jdata.object == "Variant") {
        this.tab = Object.keys(this.jdata.choice_dict).indexOf(
                  obj[this.jdata.flag_name] || this.jdata.default_tag
        );
        this.$refs["subitem"][this.tab].load(obj);
      }
    },
  },
};
</script>

<style scoped>
.v-tab {
  text-transform: none !important;
}
.w-100 {
  width: 100%;
}
.mx-1 {
  margin-left: 1em;
}
</style>
