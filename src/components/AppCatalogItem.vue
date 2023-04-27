<template>
  <div class="category__box" v-show="products.length > 0" >
    <div class="catalog-title">{{ name }}</div>
    <div class="catalog-des">{{ description }}</div>
    <div class="category-list" style="display: flex;flex-wrap: wrap;gap: 12px;">
      <AppCatalogProduct 
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script>
import { api } from '@/services/api'
import AppCatalogProduct from '@/components/AppCatalogProduct'

export default {
  name: "AppCatalogItem",
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  components: {
    AppCatalogProduct
  },
  data() {
    return {
      products: []
    }
  },
  mounted() {
    const id_store = localStorage.getItem('id_store')
    try {
      api.get(`/product/${id_store}/categories/${this.id}`).then((response) => {
        const activeProducts = response.data.products.filter((product) => product.status == 1)
        const isActive = (activeProducts.length > 0) ? true : false;
        const activeCategory = {
          id: this.id,
          name: this.name,
          description: this.description
        }
        if(isActive){
          this.products = activeProducts;
          this.$store.commit('addProducts', {
            products: activeProducts
          });
          this.$store.commit('addActiveCategories', {
            categories: activeCategory
          });
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style scoped>
  .catalog-list{
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>