<template>
  <div id="app" :style="styleWH">
   <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      style:{
        width: null,
        height: null
      }
    }
  },
  created(){
    let self = this
    //缩放获取浏览器宽、高
    window.onresize = function() {
    var w = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
    var h = window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
      self.style.width = w
      self.style.height = h
      self.$store.commit("resizeStyle", self.style)
    };
		
		if(document.createEvent) {
			var event = document.createEvent("HTMLEvents");
			event.initEvent("resize", true, true);
			window.dispatchEvent(event);
    } 
    else if(document.createEventObject) {
        window.fireEvent("onresize");
    }
  },
  computed:{
		styleWH(val){
			return this.style ={
        width: this.$store.state.style.width + 'px',
        height: this.$store.state.style.height + 'px'
      }
		}
	},
  
}
</script>

<style scoped>

#app {
  min-width: 100%;
  min-height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
