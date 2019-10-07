<template>
    <div v-html="content" @input="result" id="editor"></div>
</template>

<script>
import WangEditor from 'wangeditor'
export default {
    props: ['content', 'path'],
    data() {
        return {
            editor: '',
            editorContent: ''
        }
    },
    mounted() {
        const editor = new WangEditor('editor')
        const that = this
        editor.config.menus = [/*'source', '|', */'bold', 'underline', 'italic', 'strikethrough', 'eraser', 'forecolor', 'bgcolor', /*'|',*/  'quote',
            'fontfamily', 'fontsize', 'head', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright','link', 'unlink', 'table',
             'img', /*'video', 'insertcode', '|',*/ 'undo', 'redo' //'fullscreen'
        ]
        editor.config.uploadImgUrl = this.path
        editor.config.uploadImgFileName = 'uploadIfy'
        editor.config.uploadImgFns.onload = function (resultText, xhr) {
            var res = JSON.parse(resultText),
                img = res.data.replace(/temp\\/g, '')
            console.log(img)
            if(res.code)
                that.$message({
                    type: 'warning',
                    duration: 1000,
                    message: res.msg
                })
            
            that.$emit("imageFn", img)
            // resultText 服务器端返回的text
            // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
            
            // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
            var originalName = editor.uploadImgOriginalName || '';  
            
            // 如果 resultText 是图片的url地址，可以这样插入图片：
            editor.command(null, 'insertHtml', '<img src="' + img + '" alt="' + originalName + '" style="max-width:100%;"/>');
            // 如果不想要 img 的 max-width 样式，也可以这样插入：
            // editor.command(null, 'InsertImage', resultText);
        };
        editor.onchange = function () {
                // onchange 事件中更新数据
                that.editorContent = editor.$txt.html();
        };
        editor.create()
        this.editor = editor
    },
    methods: {
        result() {
            this.$emit('input', this.editor.$txt.html())
        }
    },
    watch:{
        editorContent(val){
            //console.log(val)
            this.$emit("sendEditormsg", val)
        }
    }
}
</script>
<style scoped>
#editor {
    height: 440px;
}
.wangEditor-container {
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid #CCC;
}
</style>