<template>
  <div class="item" v-if="product">
    <router-link :to="'/product/' + product.id" class="item-top">
      <div :style="'background-image: url(' + background(product.post_id) + ');'" class="item-img"></div>
    </router-link>
    <div class="item-info">
      <router-link :to="'/product/' + product.id" class="item-name">{{ product.name }}</router-link>
      <router-link :to="'/product/' + product.id" class="item-des">{{ product.description }}</router-link>
      <button v-if="btnActive" class="item-add" type="button" @click="addToCart">{{ product.price/100 }} ₽</button>
      <div v-if="!btnActive" class="quantity">
        <button class="quantity-item quantity-item--minus" type="button" @click="reduceQuantity"></button>
        <div class="quantity-val">{{ quantity }}</div>
        <button class="quantity-item quantity-item--plus" type="button" @click="increaseQuantity"></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "AppCatalogProduct",
props: {
  product: {
    type: Object,
    required: true
  }
},
data() {
  return {
    quantity: 0
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
  fetchData(){
    let current = this.$store.state.cart.find(product => product.id === this.product.id)?.quantity || null
    this.quantity = current
  },
  background (post_id) {
    const url = 'http://90.156.227.182:4000/' + post_id + '/' + post_id + '_thumbnail200.webp';
    return url
  }
},
mounted() {
  this.fetchData()
},
watch: {
  $route: 'fetchData'
}
}
</script>