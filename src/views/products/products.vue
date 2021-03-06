<template>
<div class="product">
  <a-row class="logout">
    <a-col :span="24">
      <div>
        <a-button @click="logout">
          Logout
        </a-button>
      </div>
    </a-col>
  </a-row>
  <a-row>
    <a-col :sm="24" :md="12" :lg="12">
      <h2>Add Product</h2>
      <a-form :form="form">
        <a-form-item label="Title">
          <a-input
              v-decorator="['title', {rules: [
                                      {
                                        required: true,
                                        message: 'Please enter action title',
                                      }
                                    ]}]"
              type="text"
          />
        </a-form-item>
        <a-form-item label="Description">
          <a-input
              v-decorator="['description', {rules: [ {
                                        required: true,
                                        message: 'Please enter your description',
                                      },
                                    ]}]"
              type="textarea"
          />
        </a-form-item>
        <a-form-item label="Price">
          <a-input
              v-decorator="['price', {rules: [ {
                                        required: true,
                                        message: 'Please enter your description',
                                      },
                                    ]}]"
              type="number"
          />
        </a-form-item>
        <a-form-item label="Image">
          <a-upload
              name="images"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :action="demo"
              :before-upload="beforeUpload"
              @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" width="200" height="150"/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <div class="float-left login-submit-button">
          <a-button type="primary" @click="submit" v-if="!isLoading">Submit</a-button>
          <a-button type="primary" loading v-else>Loading</a-button>
        </div>
      </a-form>
    </a-col>
    <a-col :sm="24" :md="12" :lg="12" class="table-left">
      <h2>All Products</h2>
      <data-table :options="tableOptions"></data-table>
    </a-col>
  </a-row>
</div>
</template>

<script>
import {Common} from "@/mixin/Helper";
import {bus} from "@/main";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  name: "products",
  mixins: [Common],
  data() {
    return {
      form: this.$form.createForm(this, {name: "dynamic_rule"}),
      images: "",
      imageUrl: "",
      demo: "",
      loading: false,
      isLoading: false,
      tableOptions: {}
    }
  },
  created() {
    this.demo = this.publicPath+'demo';
    this.getData();
  },
  methods: {
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let instance = this;
          instance.axiosPost(
              "products/store",
              {
                title: values.title,
                description: values.description,
                price: values.price,
                image: instance.images
              },
              function (response) {
                instance.title = "";
                instance.description = "";
                instance.price = "";
                instance.images = "";
                instance.imageUrl = "";
                instance.form.resetFields();
                instance.successNoti(response.message);
                bus.$emit('refreshDatatable');
              },
              function (error) {
                if (error.response.data.errors.name) {
                  instance.errorNoti(error.response.data.errors.name[0]);
                } else {
                  instance.errorNoti(error);
                }
              }
          );
        }
      });
    },
    getData() {
      let instance = this;
      instance.tableOptions = {
        tableName: 'products',
        columns: [
          {
            title: 'Title',
            key: 'title',
            type: 'text'
          },
          {
            title: 'Description',
            key: 'description',
            type: 'text'
          },
          {
            title: 'price',
            key: 'price',
            type: 'text'
          },
          {
            title: 'Image',
            key: 'image',
            type: 'image',
          },
          {
            title: 'Action',
            type: 'component',
            name: 'product-action'
          }
        ],
        source: 'products/list',
        sortedType: 'desc',
        sortedKey: 'id',
        colspan: 5
      }
    },
    logout() {
      let instance = this;
      this.axiosGet(
          "logout",
          function (response) {
            console.log(response);
            localStorage.setItem("token", "");
            instance.redirect("/login");
          },
          function (error) {
            instance.errorNoti(error);
          }
      );
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.images = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
      if (!isJPG) {
        this.$message.error("You can only upload JPG or file!");
      }
      const isLt2M = file.size / 1024 <= 1000;
      if (!isLt2M) {
        this.$message.error("Image must equal or smaller than 1MB!");
      }
      return isJPG && isLt2M;
    },
  }
}
</script>

<style scoped>
.product {
  padding: 5%;
}
.table-left {
  padding-left: 15px;
}
.logout{
  margin-bottom: 20px;
}
</style>
