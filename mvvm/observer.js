function Observer (data) {
    // 开始转换
    this.walk(data)
}
Observer.prototype = {
    walk(data){
        // 判断data是不是对象 如果不是对象不能进行下一步
        if(!data || typeof data !== 'object'){
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data,key,data[key])
        })
    },
    // data：data key：属性名 data[当前的值]
    defineReactive(data, key, value){
        const that = this
        // 添加多层嵌套对象的setter/getter 调用walk函数  把值传过去判断是不是对象 如果不是直接return 如果是再次进行嵌套内部的添加setter/getter
        this.walk(value)
        Object.defineProperty(data,key,{
            configurable: false,
            enumerable: true,
            get(){
                return value
            },
            set(newValue){
                if(value === newValue){
                    return
                }
                // 设置值的时候因为可能是对象 所以需要递归循环 如果还是对象的话 会在执行一遍函数  如果不是递归 判断可以直接return
                that.walk(newVlaue)
                value = newVlaue
            }
        })
    }
}