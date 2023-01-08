<template>
  <div class="mev">
    <div class="dashboard">
      <InputText
        v-model="pool"
        placeholder="Search for a Curve Pool"
      ></InputText>

      <Trades></Trades>

      <Bonding></Bonding>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { InputText } from "@/Framework";
import Trades from "@/Pages/Curve/MEV/Components/Trades.vue";
import Bonding from "@/Pages/Curve/MEV/Components/Bonding.vue";

const pool = $ref("");
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("mev");
</style>
