import store from '../../store/index'

export default{

    //获取浏览器宽高
    styleWHFn(){
        const obj={
            width: store.state.style.width + 'px',
            height: store.state.style.height + 'px'
        }
        return obj
    },
    wFn(){
        return store.state.style.width - 220 + 'px' 
    },
    styleFn(){
        const style = {
            width: store.state.style.width - 520 + 'px',
            height: store.state.style.height - 178 + 'px'
        }
        return style
    },
    //时间戳取
    changeTimeFn(value, arg) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        //MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        //d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        
        if(arg)
            return y + '-' + MM + '-' + d + ' ' + h + ':' + m;
        else
            return y + '年' + MM + '月' + d + '日 ' + h + ':' + m;
    },

    //判断是否传参
    parameterFn(arg){
        const arr = Object.keys(arg);
        if(arr.length == 0)              //没参数
            return false                                
        else
            return true                  //有参数        
    },
 
}