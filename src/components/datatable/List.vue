<template>
  <div class="datatable">
    <a-row :gutter="16">
      <div v-if="!isLoader">
        <div style="overflow: auto">
          <table id="table">
            <tr>
              <th v-for="(column, columnIndex) in options.columns"
                  :key="columnIndex">
                <span>{{ column.title }}</span>
              </th>
            </tr>
            <template v-if="dataSets.length > 0">
              <tr
                  v-for="(data,index) in dataSets" :key="index">
                <td v-for="(column, columnIndex) in options.columns" :key="columnIndex">
                                    <span v-if="column.type === 'image'">
                                        <img :src="mainPath+'images/uploads/'+data[column.key]" alt="img" width="100" height="100">
                                    </span>
                                    <span v-else>
                                      {{ data[column.key] }}
                                    </span>
                  <span v-if="column.type === 'component'">
                                        <component :is="column.name" :row="data"></component>
                                    </span>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr class="no-image">
                <td :colspan="options.colspan">
                  No Data Available!
                </td>
              </tr>
            </template>
          </table>
        </div>
      </div>
    </a-row>
    <a-row>
      <a-col :md="8">
        <div style="margin-top: 12px">
          Show
          <a-select
              @change="selectedDataAmount"
              v-model="showDataAmount"
              style="width: 80px; margin-right: 5px"
          >
            <a-select-option value="10">10</a-select-option>
            <a-select-option value="50">50</a-select-option>
            <a-select-option value="100">100</a-select-option>
            <a-select-option value="500">500</a-select-option>
            <a-select-option value="1000">1000</a-select-option>
          </a-select
          >
          records
        </div>
      </a-col>
      <a-col :md="16">
        <div class="pagination">
          <a-pagination href="javascript:"
                        :defaultCurrent="currentPage"
                        :page-size.sync="showDataAmount2"
                        :total="totalCount"
                        @change="newPage"
          />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {Common} from "@/mixin/Helper";
import {bus} from "@/main";
export default {
  name: "ListDatatable",
  mixins: [Common],
  props: ["options"],
  data() {
    return {
      dataSets: [],
      requestParams: {
        take: 10,
        skip: 0,
        search: "",
        sortedType: "desc",
        sortedKey: "id",
        filterData: [],
        type: 'all'
      },
      currentPage: 1,
      pages: [],
      showDataAmount: 10,
      showDataAmount2: 10,
      totalPage: 1,
      totalCount: 0,
      requestType: "",
      isLoader: false,
    }
  },
  mounted(){
    this.readData();
    let instance = this;
    bus.$on('refreshDatatable',function (){
      instance.readData();
    });
  },
  methods: {
    readData() {
      let instance = this;
      instance.isLoader = true;
      // if (this.options.filterDropdown) {
      //     this.requestParams.type = this.options.filterDropdown;
      // }
      this.axiosPost(
          this.options.source,
          this.requestParams,
          function (dataSet) {
            instance.dataSets = dataSet.data;
            instance.isLoader = false;
          },
          function (error) {
            instance.isLoader = false;
            instance.errorNoti(error);
          }
      );
    },
    selectedDataAmount() {
      this.requestParams.take = this.showDataAmount;
      this.showDataAmount2 = parseInt(this.showDataAmount);
      this.readData();
    },
    newPage(page) {
      this.requestParams.skip = (page - 1) * this.requestParams.take;
      this.currentPage = page;
      this.readData();
    },
    handleChange(value) {
      this.requestParams.type = value;
      this.readData();
    }
  }
}
</script>

<style scoped>
.drop-select {
  width: 120px;
}
</style>
