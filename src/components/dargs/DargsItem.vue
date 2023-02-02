<template>
  <!-- list -->
  <div
    v-if="Array.isArray(jdata)"
    class="w-100"
  >
    <v-list>
      <v-list-item
        v-for="item in jdata"
        :key="item.name"
      >
        <DargsItem
          ref="subitem"
          :jdata="item"
        />
      </v-list-item>
    </v-list>
  </div>
  <div
    v-else-if="jdata.object == 'Argument'"
    class="w-100 mx-1"
  >
    <v-row class="w-100">
      <v-col cols="auto">
        <v-checkbox
          v-if="jdata.optional"
          v-model="check"
        />
      </v-col><v-col>
        <v-row v-if="jdata.type.length > 1">
          <v-col cols="auto">
            <v-list-subheader>
              {{ $t('message.typeof', { name: jdata.name }) }}
              <small v-if="jdata.optional">{{ jdata.default ? $t('message.optional_default', { default: jdata.default }) : $t('message.optional') }}</small>
            </v-list-subheader>
          </v-col>
          <v-col>
            <v-select
              v-model="select_type"
              :items="jdata.type"
              :hint="$t('message.select_type', {name: jdata.name})"
            />
          </v-col>
        </v-row>
        <!-- list of arguments, repeat=True -->
        <v-row
          v-if="select_type == 'list' && jdata.repeat"
          class="w-100"
        >
          <v-col cols="auto">
            <v-list>
              <v-card variant="outlined">
                <v-card-title class="font-weight-black">
                  {{ jdata.name }}
                </v-card-title>
                <v-card-text class="text--secondary">
                  {{ jdata.doc }}
                </v-card-text>
                <v-list>
                  <v-list-item
                    v-for="(rr_jdata, index) in repeat_jdata"
                    :key="index"
                  >
                    <v-card variant="outlined">
                      <v-card-title class="font-weight-bold">
                        {{ jdata.name }} - Item {{ index }}
                      </v-card-title>
                      <v-card-actions>
                        <v-btn
                          block
                          prepend-icon="fa-solid fa-trash"
                          color="error"
                          @click="remove_repeat(index)"
                        >
                          {{ $t('message.remove_repeat', { index }) }}
                        </v-btn>
                      </v-card-actions>
                      <v-list>
                        <v-list-item
                          v-for="item in rr_jdata.sub_fields"
                          :key="item.name"
                        >
                          <!-- jdata.sub_fields is object -->
                          <DargsItem
                            :ref="'subitem_' + index"
                            :jdata="item"
                          />
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-list-item>
                </v-list>
                <v-card-actions>
                  <v-btn
                    block
                    prepend-icon="fa-solid fa-plus"
                    @click="add_repeat()"
                  >
                    {{ $t('message.add_repeat') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-list>
          </v-col>
        </v-row>

        <!-- text areas for list -->
        <v-textarea
          v-else-if="select_type == 'list'"
          v-model="value"
          :hint="$t('message.one_element_per_row') + '\n' + jdata.doc"
          :placeholder="select_type"
          :rules="!jdata.optional ? rules.required : []"
          clearable
          @input="up"
        >
          <template #label>
            <div>
              {{ jdata.name }} <small v-if="jdata.optional">{{ jdata.default ? $t('message.optional_default', { default: jdata.default }) : $t('message.optional') }}</small>
            </div>
          </template>
          <template #message="{ message, key }">
            <div
              :key="key"
              v-html="message.replaceAll('\n', '<br/>')"
            />
          </template>
        </v-textarea>
        <!-- text field for str, int, float -->
        <v-text-field
          v-else-if="['str', 'int', 'float'].includes(select_type)"
          v-model="value"
          :hint="jdata.doc"
          :placeholder="select_type"
          :rules="[
            ...(!jdata.optional ? rules.required : []),
            ...(['int', 'float'].includes(select_type) ? rules.number : []),
          ]"
          clearable
          @input="up"
        >
          <template #label>
            <div>
              {{ jdata.name }} <small v-if="jdata.optional">{{ jdata.default ? $t('message.optional_default', { default: jdata.default }) : $t('message.optional') }}</small>
            </div>
          </template>
          <template #message="{ message, key }">
            <div
              :key="key"
              v-html="message.replaceAll('\n', '<br/>')"
            />
          </template>
        </v-text-field>

        <!-- switch for bool -->
        <v-switch
          v-else-if="select_type == 'bool'"
          v-model="value"
          :messages="jdata.doc"
          :disabled="!check"
        >
          <template #label>
            <div>
              {{ jdata.name }} <small v-if="jdata.optional">{{ jdata.default ? $t('message.optional_default', { default: jdata.default }) : $t('message.optional') }}</small>
            </div>
          </template>
          <template #message="{ message, key }">
            <div
              :key="key"
              v-html="message.replaceAll('\n', '<br/>')"
            />
          </template>
        </v-switch>

        <div v-else-if="select_type == 'dict'">
          <!-- dict sub_fields -->
          <v-card
            v-if="Object.keys(jdata.sub_fields).length"
            variant="outlined"
          >
            <v-card-title class="font-weight-black">
              {{ jdata.name }}
            </v-card-title>
            <v-card-text class="text--secondary">
              {{ jdata.doc }}
            </v-card-text>
            <v-list>
              <v-list-item
                v-for="item in jdata.sub_fields"
                :key="item.name"
              >
                <!-- jdata.sub_fields is object -->
                <DargsItem
                  ref="subitem"
                  :jdata="item"
                />
              </v-list-item>
            </v-list>
          </v-card>

          <!-- dict variant -->
          <v-list
            v-if="Object.keys(jdata.sub_variants).length"
            subheader
          >
            <v-list-item-title class="font-weight-black">
              {{ jdata.name }}
            </v-list-item-title>
            <p class="text--secondary">
              {{ jdata.doc }}
            </p>
            <v-list-item
              v-for="item in jdata.sub_variants"
              :key="item.name"
            >
              <!-- jdata.sub_fields is object -->
              <DargsItem
                ref="subvariant"
                :jdata="item"
              />
            </v-list-item>
          </v-list>

          <!-- if length == 0, assume it allows any arguments -->
          <!-- textarea for dict -->
          <v-textarea
            v-else-if="!Object.keys(jdata.sub_fields).length && !Object.keys(jdata.sub_variants).length"
            v-model="value"
            :hint="jdata.doc"
            :placeholder="select_type"
            :rules="!jdata.optional ? rules.required : []"
            clearable
            @input="up"
          >
            <template #label>
              <div>
                {{ jdata.name }} <small v-if="jdata.optional">{{ jdata.default ? $t('message.optional_default', { default: jdata.default }) : $t('message.optional') }}</small>
              </div>
            </template>
            <template #message="{ message, key }">
              <div
                :key="key"
                v-html="message.replaceAll('\n', '<br/>')"
              />
            </template>
          </v-textarea>
        </div>
      </v-col>
    </v-row>
  </div>
  <v-card
    v-else-if="jdata.object == 'Variant'"
    class="w-100"
    variant="outlined"
  >
    <v-tabs
      v-model="tab"
      show-arrows
    >
      <v-tab
        v-for="item in jdata.choice_dict"
        :key="item.name"
      >
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <!-- important: use eager prop to let this.$refs["subitem"][this.tab] not undefined -->
      <v-window-item
        v-for="item in jdata.choice_dict"
        :key="item.name"
        eager
      >
        <DargsItem
          ref="subitem"
          :jdata="item"
        />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
export default {
  name: "DargsItem",
  props: {
    jdata: [Object, Array],
  },
  data() {
    var tab = 0;
    const repeat_jdata = [];
    if (this.jdata.object == "Variant") {
      if (this.jdata.default_tag) {
        tab = Object.keys(this.jdata.choice_dict).indexOf(
          this.jdata.default_tag
        );
      }
      if (tab < 0) tab = 0;
    } else if (this.jdata.object == "Argument" && this.jdata.repeat) {
      // init with one element
      repeat_jdata.push(this.jdata);
    }
    return {
      tab: tab,
      value: null,
      check: !this.jdata.optional,
      rules: {
        required: [(value) => !!value || "Required."],
        number: [(value) => !value || !isNaN(value) || "Number required."],
      },
      select_type: this.jdata.type && this.jdata.type[0],
      repeat_jdata,
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
        if (this.select_type == "list") {
          if (this.jdata.repeat) {
            return [...Array(this.repeat_jdata.length).keys()].map((ii) => {
              return Object.keys(this.jdata.sub_fields).length
                ? Object.fromEntries(
                    new Map(
                      this.$refs[`subitem_${ii}`]
                        .filter((vv) => !vv.jdata.optional || vv.check)
                        .map((vv) => [vv.jdata.name, vv.dvalue()])
                    )
                  )
                : Object();
            });
          } else {
          // textarea -> list
          if (!this.value) return [];
          return this.value
            .trim()
            .split("\n")
            .map((v) => {
              try {
                return JSON.parse(v);
              } catch (e) {
                return v;
              }
            });
          }
        } else if (["str", "int", "float"].includes(this.select_type)) {
          if (!this.value) {
            if (this.select_type == "str") return "";
            else return 0;
          }
          if (!(this.select_type == "str")) {
            return Number.parseFloat(this.value);
          }
          return this.value;
        } else if (this.select_type == "bool") {
          return this.value;
        } else if (this.select_type == "NoneType") {
          return null;
        } else if (this.select_type == "dict") {
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
          const any_arguments = (!Object.keys(this.jdata.sub_fields).length && !Object.keys(this.jdata.sub_variants).length)
            ? JSON.parse(this.value)
            : Object();
          return {
            ...sub_fields,
            ...sub_variants,
            ...any_arguments,
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
            vv.jdata.alias.forEach((aa) => {
              if (aa in obj) vv.load(obj[aa]);
            });
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
          if(this.jdata.repeat){
            this.repeat_jdata = [];
            [...Array(obj.length).keys()].forEach((ii) => {
              this.repeat_jdata.push(this.jdata);
            });
            [...Array(obj.length).keys()].forEach((ii) => {
              var subobj = obj[ii];
              if (this.$refs[`subitem_${ii}`])
                this.$refs[`subitem_${ii}`].forEach((vv) => {
                  // check if it exists, name and alias
                  if (vv.jdata.name in subobj) {
                    // exists
                    vv.load(subobj[vv.jdata.name]);
                  }
                  vv.jdata.alias.forEach((aa) => {
                    if (aa in subobj) vv.load(subobj[aa]);
                  });
                  if (vv.jdata.optional) {
                    vv.check = vv.jdata.name in subobj;
                  }
                });
            });
          }else{
          // list -> multiple line str
          this.select_type = "list";
          this.value = obj.map(JSON.stringify).join("\n");
          }
        } else if (this.jdata.type.includes("str") && typeof obj == "string") {
          this.select_type = "str";
          this.value = obj;
        } else if (
          ["int", "float"].some((tt) => this.jdata.type.includes(tt)) &&
          typeof obj == "number"
        ) {
          // str, int, float -> str
          this.value = String(obj);
          if (this.jdata.type.includes("float")) {
            this.select_type = "float";
          }
          else if (this.jdata.type.includes("int")) {
            this.select_type = "int";
          }
        } else if (
          this.jdata.type.includes("bool") &&
          typeof obj == "boolean"
        ) {
          // bool
          this.value = obj;
          this.select_type = "bool";
        } else if (this.jdata.type.includes("NoneType") && obj === null) {
          this.value = obj;
          this.select_type = "NoneType";
        } else if (this.jdata.type.includes("dict")) {
          this.select_type = "dict";
          load_subitem();
          if (this.$refs["subvariant"])
            this.$refs["subvariant"].forEach((vv) => {
              vv.load(obj);
            });
          else if (!this.$refs["subitem"] && !this.$refs["subvariant"])
            // both subfields and subvariants are empty
            this.value = JSON.stringify(obj);
        }
      } else if (this.jdata.object == "Variant") {
        var tab = Object.keys(this.jdata.choice_dict).indexOf(
          obj[this.jdata.flag_name] || this.jdata.default_tag
        );
        // loop alias
        if (tab < 0)
          this.$refs["subitem"].some((vv, index) => {
            if (
              vv.jdata.alias.includes(
                obj[this.jdata.flag_name] || this.jdata.default_tag
              )
            ) {
              tab = index;
              return true;
            }
            return false;
          });
        this.tab = tab;
        this.$refs["subitem"][this.tab].load(obj);
      }
    },
    add_repeat: function() {
      this.repeat_jdata.push(this.jdata);
    },
    remove_repeat: function(index) {
      this.repeat_jdata.splice(index, 1);
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
