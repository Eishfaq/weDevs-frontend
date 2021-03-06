<template>
  <div class="action-icon">
    <a href="javascript:" class="center-align" @click="showModal">
      <a-icon type="edit" />
    </a>
    <a href="javascript:" class="center-align" @click="deleteData">
      <a-icon type="delete"/>
    </a>
    <a-modal v-model="visible" :title="`Edit`" @ok="handleOk">
      <a-card>
        <a-form :form="form">
          <a-form-item label="Title">
            <a-input
                v-decorator="['title', {initialValue:title,rules: [
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
                v-decorator="['description', {initialValue:description,rules: [ {
                                        required: true,
                                        message: 'Please enter your description',
                                      },
                                    ]}]"
                type="textarea"
            />
          </a-form-item>
          <a-form-item label="Price">
            <a-input
                v-decorator="['price', {initialValue:price,rules: [ {
                                        required: true,
                                        message: 'Please enter product price',
                                      },
                                    ]}]"
                type="number"
            />
          </a-form-item>
          <a-form-item label="Image">
            <div v-if="image">
              <img :src="imageUrl" alt="img" width="200" height="200">
              <a-button @click="deleteImage">
                <a-icon type="delete"></a-icon>
              </a-button>
            </div>
            <a-upload
                v-else
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
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import { Common } from "@/mixin/Helper";
import Swal from "sweetalert2";
import {bus} from "@/main";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  mixins: [Common],
  props: ["row"],
  data() {
    return {
      form: this.$form.createForm(this, {name: "dynamic_rule"}),
      title: "",
      description: "",
      price: "",
      image: "",
      images: "",
      imageUrl: "",
      visible: false,
      demo: "",
      loading: false,
      isLoading: false,
    };
  },
  mounted() {
    this.demo = this.publicPath+'demo';
  },
  // mounted() {
  //   this.edit = '/auth/brand/edit/'+this.row.id;
  // },
  methods: {
    deleteData() {
      Swal.fire({
        title: "Want to delete?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete Now"
      }).then((result) => {
        let instance = this;
        if (result.value) {
          instance.axiosGet('products/delete/'+instance.row.id,function(response) {
            bus.$emit('refreshDatatable');
            instance.successNoti(response.message);
          },function (error){
            instance.errorNoti(error);
          });
        }
      });
    },
    showModal() {
      let instance = this;
      instance.visible = true;
      instance.title = instance.row.title;
      instance.description = instance.row.description;
      instance.price = instance.row.price;
      instance.image = instance.row.image;
      instance.images = instance.row.images;
      instance.imageUrl = instance.mainPath+"images/uploads/"+instance.row.image;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let instance = this;
          instance.axiosPost(
              "products/update/"+instance.row.id,
              {
                title: values.title,
                description: values.description,
                price: values.price,
                image: instance.images
              },
              function (response) {
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
    deleteImage() {
      Swal.fire({
        title: "Want to delete?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete Now"
      }).then((result) => {
        let instance = this;
        if (result.value) {
          instance.axiosGet('products/image/delete/'+instance.row.id,function(response) {
            instance.imageUrl = "";
            instance.image = "";
            instance.successNoti(response.message);
          },function (error){
            instance.errorNoti(error);
          });
        }
      });
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

</style>
