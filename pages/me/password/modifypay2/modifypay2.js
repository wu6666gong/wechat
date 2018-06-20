const app = getApp();
const verify = require("../../../../utils/verify.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd1: '',
    pwd2: ''
  },
  /**
   * 支付密码
   */
  pwd1(e) {
    let val = e.detail.value
    this.setData({
      pwd1: val
    })
  },
  /**
  * 重复支付密码
  */
  pwd2(e) {
    let val = e.detail.value
    this.setData({
      pwd2: val
    })
  },
  /**
   * 提交
   */
  sure() {
    const the = this;
    const id = app.globalData.getId();
    let pwd1 = verify.isPwd(the.data.pwd1);
    let pwd2 = verify.isConfirmPwd(the.data.pwd2, the.data.pwd1);
    if (!pwd1.judge) {
      wx.showToast({
        title: pwd1.val,
        icon: "none"
      })
    } else if (!pwd2.judge) {
      wx.showToast({
        title: pwd2.val,
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '',
      })
      let data = {};
      data.userNum = id;
      data.password = pwd1.val;
      wx.request({
        url: app.globalData.url + 'wxapp/modify/psd',
        method: 'POST',
        data: data,
        success(res) {
          wx.hideLoading()
          console.log(res)
          if (res.data.code == 0) {
            the.paySuccess();
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
          }
        },
        fail() {
          wx.hideLoading()
          wx.showToast({
            title: '网路错误',
            icon: 'none'
          })
        }
      })
    }
  },
  paySuccess() {
    wx.showModal({
      title: 'Artval提示',
      content: '修改密码成功',
      showCancel: false,
      confirmColor: "#33A695",
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1,
          })
        }
      },
      fail() {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})