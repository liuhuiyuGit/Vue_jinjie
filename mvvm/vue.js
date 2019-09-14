function vue (options) {
// options传入进来的就是new Vue的内部对象
    this.$options = options || {}
    // 判断类型是否是字符串 如果是字符串说明是#app  如果不是说明是document
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    this.$data = options.data || {}
    // 把data成员注入实例的第一层属性 并且转换成setter/getter 
    this._proxyData()
    // 把data中的成员转换成setter/getter  把data值作为形参传入到observer函数中
    new Observer(this.$data)
    new Compiler(this)
}
vue.prototype._proxyData = function(){
    Object.keys(this.$data).forEach(key => {
        Object.defineProperty(this,key,{
            configurable: false,
            enumerable: true,
            get(){
                return this.$data[key]
            },
            set(value){
                // value是改变成的数据
                // 判断是否相等  如果相等直接结束函数
                if(this.$data[key] === value){
                    return
                }
                this.$data[key] = value
            }
        })
    })
}