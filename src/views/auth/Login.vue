<template>
  <div class="login">
    <div class="layout">
      <div class="layout-card">
        <a-card
            :bordered="false"
            style="-webkit-box-shadow: 0 2px 16px -11px rgba(0, 0, 0, 0.5);"
            class="auth-card-width"
        >
          <a-form :form="form" :layout="formLayout" :hideRequiredMark="hideRequiredMark">
            <a-col span="24">
              <a-form>
                <h2>WeDevs Task Panel</h2>
              </a-form>
            </a-col>
            <a-col span="24" style="margin-bottom:12px">
              <a-alert :message="errMessage" type="error" v-if="errMessage!==''" />
            </a-col>
            <a-col :md="24">
              <a-form-item label="Email">
                <a-input
                    v-decorator="['email', {initialValue:email,rules: [
                                      {
                                        required: true,
                                        message: 'Please enter your email address',
                                      }
                                    ]}]"
                    type="text"
                />
              </a-form-item>
              <a-form-item label="Password">
                <a-input
                    v-decorator="['password', {initialValue:password,rules: [ {
                                        required: true,
                                        message: 'Please enter your password',
                                      },
                                    ]}]"
                    type="password"
                />
              </a-form-item>
            </a-col>
            <a-col span="24">
              <div class="float-left login-submit-button">
                <a-button type="primary" @click="submit" v-if="!isLoading">Submit</a-button>
                <a-button type="primary" loading v-else>Loading</a-button>
              </div>
            </a-col>
          </a-form>
        </a-card>
      </div>
    </div>
  </div>
</template>
<script>
import { Common } from "@/mixin/Helper";
export default {
  mixins: [Common],
  data() {
    return {
      form: this.$form.createForm(this, { name: "dynamic_rule" }),
      hideRequiredMark: true,
      formLayout: "vertical",
      isLoading: false,
      email: "",
      password: "",
      errMessage:'',
    };
  },
  methods: {
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.isLoading = true;
          let instance = this;
          instance.axiosPostWithoutToken('login',
              {
                email: values.email,
                password: values.password
              },
              function (response) {
                localStorage.setItem("token", response.access_token);
                instance.redirect("/products");
              },
              function (error) {
                console.log(error)
                instance.isLoading = false;
                instance.errorNoti('Wrong username or password!');
              })
        }
      });
    },
  },
};
</script>
