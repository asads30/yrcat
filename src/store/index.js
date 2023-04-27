import Vue from 'vue'
import Vuex from 'vuex'
import { api } from '@/services/api';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        categories: [],
        products: [],
        cart: [],
        data: null,
        activeCategories: []
    },
    getters: {
        sendCart(state){
            let result = [];
            for (let product of state.cart) {
                result.push(product.postId);
            }
            let data = {
                "arrayOfPostIds": result
            }
            return data;
        },
        getProducts(state){
            const activeProducts = state.products.filter((product) => product.status == 1)
            return activeProducts
        },
        getActiveCategories(state){
            return state.activeCategories.sort();
        }
    },
    mutations: {
        setCategories: (state, categories) => {
            state.categories = categories;
        },
        addProducts: (state, payload) => {
            state.products.push(payload.products)
        },
        addActiveCategories: (state, payload) => {
            state.activeCategories.push(payload.categories)
        },
        addToCart: (state, product) => {
            product.isBtnActive = false;
            product.quantity = 1;
            state.cart.push(product);
            let result = []
            for (let item of state.cart) {
                result.push(item.price.toFixed(2) * item.quantity.toFixed(2))
            }
            result = result.reduce(function (sum, el) {
                return sum + el
            });
            window.Telegram.WebApp.MainButton.show()
            window.Telegram.WebApp.MainButton.enable()
            window.Telegram.WebApp.MainButton.setParams({
                text: 'Оплатить ' + result.toFixed(2)/100 + ' ₽'
            })
        },
        increaseQuantity: (state, productId) => {
            state.cart.map(product => {
                if (product.id === productId) {
                    product.quantity++;
                    if (product.quantity > 0) {
                        product.isBtnActive = false;
                        window.Telegram.WebApp.MainButton.show()
                        window.Telegram.WebApp.MainButton.enable() 
                    }
                    let result = [];
                    for (let item of state.cart) {
                        result.push(item.price.toFixed(2) * item.quantity.toFixed(2));
                    }
                    result = result.reduce(function (sum, el) {
                        return sum + el;
                    })
                    window.Telegram.WebApp.MainButton.setParams({
                        text: 'Оплатить ' + result.toFixed(2)/100 + ' ₽'
                    })
                }
            })
        },
        reduceQuantity: (state, productId) => {
            state.cart.map(product => {
                if (product.id === productId) {
                    if (product.quantity > 0) {
                        product.quantity--;
                        let result = [];
                        for (let item of state.cart) {
                            result.push(item.price.toFixed(2) * item.quantity.toFixed(2));
                        }
                        result = result.reduce(function (sum, el) {
                            return sum + el;
                        })
                        window.Telegram.WebApp.MainButton.setParams({
                            text: 'Оплатить ' + result.toFixed(2)/100 + ' ₽'
                        })
                    }
                    if (product.quantity === 0) {
                        product.isBtnActive = true;
                        state.cart = state.cart.filter(product => product.id !== productId);
                        if(state.cart.length === 0){
                            window.Telegram.WebApp.MainButton.hide();
                            window.Telegram.WebApp.MainButton.disable();
                        } else{
                            let result = [];
                            for (let item of state.cart) {
                                result.push(item.price.toFixed(2) * item.quantity.toFixed(2));
                            }
                            result = result.reduce(function (sum, el) {
                                return sum + el;
                            })
                            window.Telegram.WebApp.MainButton.setParams({
                                text: 'Оплатить ' + result.toFixed(2)/100 + ' ₽'
                            })
                        }
                    }
                }
            })
        }
    },
    actions: {
        async fetchCategories({commit}) {
            const id_store = localStorage.getItem('id_store')
            try {
                const res = await api.get(`category/${id_store}`)
                commit('setCategories', res.data.categories);
            } catch (err) {
                console.error(err)
            }
        }
    }
})
