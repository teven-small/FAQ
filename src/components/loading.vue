<template>
    <div v-loading="true"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)" :style="style">
    </div>
</template>

<script>
export default {
    data(){
        return{
           
        }
    },
    computed:{
        style(){
            var style
			return style ={
                width: this.$store.state.style.width - 520 + 'px',
                height: this.$store.state.style.height - 178 + 'px'
            }
        }
    }
}
</script>


