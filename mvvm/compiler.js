function Compiler(vm) {
    this.vm = vm
    this.el = vm.$el
    // 编译模板
    this.Compile(this.el)
}
Compiler.prototype = {
    constructor: Compiler,
    Compile(el) {
        // 获取所有子节点
        const nodes = el.childNodes
        // 遍历所有子节点
        Array.from(nodes).forEach(node => {
            // 遍历完判断这些都是什么节点 找对应的函数
            if (this.isTextNode(node)) {
                this.compileText(node)
                // 文本节点
            } else if (this.isElementNode(node)) {
                // 元素节点
                this.compileElement(node)
            }
        })
    },
    // 编译元素节点
    compileElement(node) {
        Array.from(node.attributes).forEach(attrNode => {
            let name = attrNode.name
            let value = attrNode.value
            if (this.isDirective(name)) {
                // 去掉前面的v-
                name = name.substr(2)
                //  判断有没有这个方法  如果有就调用
                compileUtil[name] && compileUtil[name](node, this.vm, value)
            }
        })
        //  标签内文本
        this.compileText(node)
    },
    // 编译文本节点
    compileText(node) {
        // 文本节点判断是不是插值表达式
        compileUtil.mustache(node, this.vm)
    },
    // 判断是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    },
    // 判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    },
    // 判断当前属性是否是vue指令 判断是不是v-开头
    isDirective(attr) {
        return attr.startsWith('v-')
    }

}
const compileUtil = {
    //  插值表达式的操作
    mustache(node, vm) {
        const reg = /\{\{(.+)\}\}/
        const value = node.textContent
        // 如果正泽表达式匹配
        if (reg.test(value)) {
            // key 为差值表达式里面的属性
            const key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.getVMValue(vm, key))
        }
    },
    // v-开头对应的方法
    text(node, vm, expr) {
        node.textContent = this.getVMValue(vm, expr)
    },
    html(node, vm, expr) {
        node.innerHTML = this.getVMValue(vm, expr)
    },
    model(node, vm, expr) {
        node.value = this.getVMValue(vm, expr)
        node.addEventListener('input', (e) => {
            const newValue = e.target.value
            if (node.value === newValue) {
                return
            }
            this.setVMValue(vm, expr, newValue)
        })
    },
    getVMValue(vm, expr) {
        let data = vm.$data
        // 如果是嵌套对象 通过.进行分割成数组遍历 每次遍历出的值都赋值给data 到最后一层的时候直接赋值成功 return回去值
        expr.split('.').forEach(key => {
            data = data[key]
        })
        return data
    },
    setVMValue(vm, expr, value){
        let data = vm.$data
        const arr = expr.split('.')
        arr.forEach((key,index)=>{
            if(index<arr.length-1){
                data = data[key]
            }else{
                data[key] = value
            }
        })
    }

}