<template>
  <el-container class="home_container">
    <el-header>
      <h3>电商后台管理系统</h3>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="!isCollapse?'64px':'200px' ">
        <div class="toggle-button" @click="toggle">|||</div>
        <Aside :menuList="menuList" :isCollapse="isCollapse"></Aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from './aside'
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false,
    }
  },
  methods: {
    logOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenu() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    toggle() {
      if (!this.isCollapse) {
        this.isCollapse = true
      } else {
        this.isCollapse = false
      }
    },
  },
  created() {
    this.getMenu()
  },
  components: { Aside },
}
</script>

<style>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  color: #fff;
  align-items: center;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>