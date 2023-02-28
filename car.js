const apiUrl = 'https://vue3-course-api.hexschool.io/v2'
const apiPath = 'ksin588'
const productModal = {
    props: ['addToCar'],
    data() {
        return {
            tempProduct: {},
            modal: {},
            qty: 1
        }
    },
    methods: {
        openModal(tempProduct) {
            this.tempProduct = tempProduct
            this.modal.show()
        },
        closeModal() {
            this.modal.hide()
        }

    },
    mounted() {
        //ref當作dom元素
        this.modal = new bootstrap.Modal(this.$refs.modal)



    },
    template: '#userProductModal'

}
const app = Vue.createApp({
    data() {
        return {
            products: [],
            tempProduct: {},
            detailLoading: false,
            carLoading: false,
            carts: {},
            loadingItem: '',
            form: {
                "user": {
                    "name": "",
                    "email": "",
                    "tel": "",
                    "address": ""
                },
                "message": ""
            }

        }
    },
    methods: {
        getAllproducts() {
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then((res) => {
                    this.products = res.data.products

                })
                .catch((error) => {
                    alert('出現錯誤')

                })
        },
        //查看更多
        detailProduct(id) {
            this.detailLoading = true

            axios.get(`${apiUrl}/api/${apiPath}/product/${id}`)
                .then((res) => {

                    this.detailLoading = false
                    this.tempProduct = res.data.product
                    this.$refs.Modal.openModal(this.tempProduct)

                })
                .catch((err) => {
                    alert('api錯誤')

                })
        },
        //加入購物車
        addToCar(product_id, qty = 1) {
            this.carLoading = true
            this.loadingItem = true
            const data = {
                product_id,
                qty
            }
            axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
                .then((res) => {
                    this.carLoading = false
                    this.loadingItem = false

                    alert('加入購物車成功')
                    this.$refs.Modal.closeModal()
                    this.getCarts()

                })
                .catch((error) => {
                    alert('api出現錯誤')

                })


        },
        //購物車列表
        getCarts() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then((res) => {
                    this.carts = res.data.data


                })
                .catch((err) => {
                    alert(err)
                })
        },
        //修改購物車
        editCarts(cart_id, product_id, qty) {
            this.loadingItem = cart_id
            const data = {
                product_id,
                qty
            }
            axios.put(`${apiUrl}/api/${apiPath}/cart/${cart_id}`, { data })
                .then((res) => {

                    //alert('購物車已更新')
                    this.getCarts()
                    this.loadingItem = ' '
                })
                .catch((err) => {
                    alert(err)
                })



        },
        //刪除購物車
        deleteCart(cart_id, product_title) {
            this.loadingItem = cart_id
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${cart_id}`)
                .then((res) => {

                    alert(product_title + '刪除成功')
                    this.getCarts()
                    this.loadingItem = ' '
                })
                .catch((err) => {
                    alert(err)
                })
        },
        //清空購物車
        deleteAllCart() {
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then((res) => {
                    alert('已清空')
                    this.getCarts()
                })
                .catch((err) => {
                    alert(err.data.message)
                })

        },
        //驗證電話規則
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        //建立訂單
        createOrder() {
            const data = this.form
            axios.post(`${apiUrl}/api/${apiPath}/order`, { data })
                .then((res) => {

                    alert(res.data.message)
                    this.getCarts()
                    this.$refs.form.resetForm()
                    this.form.message = ''


                })
                .catch((err) => {
                    alert(err.data.message)
                    this.$refs.form.resetForm()
                    this.form.message = ''
                })

        }
    },
    mounted() {
        this.getAllproducts()
        this.getCarts()
    },
    components: { productModal }
})
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});
app.mount('#app')