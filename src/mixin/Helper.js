import axios from 'axios'

export const Common = {
    data() {
        return {
            data: {},
            publicPath: 'http://api.wedevs.local/api/',
            mainPath: 'http://api.wedevs.local/',
        }
    },
    methods: {
        config() {
            let token = localStorage.getItem('token');
            return {
                headers: { Authorization: `bearer ${token}` }
            }
        },
        axiosGet(route,success,error) {
            let instance = this;
            axios.get(instance.publicPath + route,instance.config())
                .then((response) => {
                    success(response.data)
                }).catch(function (err) {
                if (err.response.status == 401) {
                    localStorage.setItem('token','');
                    instance.redirect('/auth/login');
                } else {
                    error(err);
                }
            })
        },
        axiosGetWithoutToken(route, success, error) {
            axios.get(this.publicPath + route)
                .then(function (response) {
                    console.log(response)
                    success(response.data);
                })
                .catch(function (err) {
                    error(err);
                });
        },
        axiosPost(route, data, success, error) {
            let instance = this;
            axios.post(this.publicPath + route, data, this.config())
                .then(function (response) {
                    success(response.data);
                }.bind())
                .catch(function (err) {
                    if (err.response.status == 401) {
                        localStorage.setItem('token', '');
                        instance.redirect('/auth/login');
                    } else {
                        error(err);
                    }
                });
        },
        axiosPostWithoutToken(route, data, success, error) {
            console.log(route);
            axios.post(this.publicPath + route, data)
                .then(function (response) {
                    success(response.data);
                }.bind())
                .catch(function (err) {
                    error(err);
                });
        },
        redirect(route) {
            window.location.href = route;
        },
        successNoti(msg) {
            this.$toaster.success(msg)
        },
        errorNoti(msg) {
            if (msg.response === undefined) {
                this.$toaster.error(msg);
            } else if (msg.response.data.message === undefined) {
                this.$toaster.error(msg);
            } else {
                this.$toaster.error(msg.response.data.message);
            }
        },
    }
}
