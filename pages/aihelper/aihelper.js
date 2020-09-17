// pages/aihelper/aihelper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    textPro: {
      type: String,
      value: 'dafault value',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    person: {
      age: 18,
      name: 'xaioming'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showToast(){
      wx.showToast({
        title: '成！' + this.data.person.age,
      })
    }
  }
})
