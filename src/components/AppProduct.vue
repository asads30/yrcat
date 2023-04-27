<template>
    <div class="product" v-if="product">
        <div class="product-box">
            <div :style="'background-image: url(' + background(product.thumbnail_buffer.data) + ');'" class="product-img"></div>
            <div class="product-info">
                <div class="product-header">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-des">{{ product.description }}</div>
                </div>
                <div class="product-footer">
                    <button v-if="btnActive" class="item-add" type="button" @click="addToCart">{{ product.price/100 }} ₽</button>
                    <div v-if="!btnActive" class="quantity">
                        <button class="quantity-item quantity-item--minus" type="button" @click="reduceQuantity"></button>
                    <div class="quantity-val">{{ quantity }}</div>
                        <button class="quantity-item quantity-item--plus" type="button" @click="increaseQuantity"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
<script>
    import { api } from '@/services/api'
    export default {
        name: "AppCatalogProduct",
        data() {
            return {
                quantity: 0,
                product: null
            }
        },
        computed: {
            btnActive() {
                return this.$store.state.cart.find(product => product.id === this.product.id) ? this.product.isBtnActive : true;
            }
        },
        methods: {
            addToCart() {
                this.$store.commit('addToCart', this.product);
                this.quantity++
            },
            reduceQuantity() {
                this.$store.commit('reduceQuantity', this.product.id);
                this.quantity--
            },
            increaseQuantity() {
                this.$store.commit('increaseQuantity', this.product.id);
                this.quantity++
            },
            background (buffer) {
                var binary = '';
                var bytes = new Uint8Array( buffer );
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode( bytes[ i ] );
                }
                return 'data:image/png;base64,' + window.btoa( binary )
            },
            async fetchProduct(){
                const id_store = localStorage.getItem('id_store');
                const product_id = this.$route.params.id;
                try {
                    await api.get(`/product/${id_store}/products/${product_id}`).then((response) => {
                        this.product = response.data
                    })
                } catch (error) {
                    console.log(error)
                }
                this.quantity = this.$store.state.cart.find(product => product.id === this.product.id)?.quantity || null
                this.quantity = current
            },
            goMain(){
                this.$router.go(-1);
            }
        },
        mounted() {
            this.fetchProduct();
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.onEvent('backButtonClicked', this.goMain);
        }
  }
  </script>