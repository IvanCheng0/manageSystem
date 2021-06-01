<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409EFF"
    :unique-opened="true"
    :collapse="isCollapse"
    :collapse-transition="false"
    router
  >
    <!-- 一级菜单 -->
    <el-submenu :index="index.toString()" v-for="(menu,index) in menuList" :key="index">
      <template slot="title">
        <i :class="iconObj[index]"></i>
        <span>{{menu.authName}}</span>
      </template>
      <!-- 二级菜单    -->
      <el-menu-item :index=" '/'+item.path.toString()" v-for="item in menu.children" :key="item.id">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{item.authName}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      iconObj: {
        0: 'el-icon-s-custom',
        1: 'el-icon-reading',
        2: 'el-icon-suitcase',
        3: 'el-icon-tickets',
        4: 'el-icon-data-line',
      },
    }
  },
  props: ['menuList', 'isCollapse'],
}
</script>

<style>
</style>