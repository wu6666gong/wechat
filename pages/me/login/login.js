const app = getApp();
const verify = require("../../../utils/verify.js");
let timerName;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"",
    isNext:false,
    tel:"",
    imgVal:"",
    messageCode:"",
    getBtn: '获取'
  },
  /**
   * 手机号码
   */
  tel(e){
    let val = e.detail.value;
    this.setData({
      tel:val
    })
  },
   /**
   * 点击获取图片
   */
  getImg() {
    this.getImgUrl()
  },
   /**
   * 获取图片url
   */
  getImgUrl(){
    let unionId = app.globalData.getUnionId();
    let imgUrl = app.globalData.url + "gainImgCode/" +unionId+"?" + Math.random();
    this.setData({
      imgUrl: imgUrl
    })
  },
   /**
   * 图形验证码
   */
  imgCode(e){
    let val = e.detail.value;
    this.setData({
      imgVal: val
    })
  },
  // 短信验证码
  messageCode(e){
    let val = e.detail.value;
    this.setData({
      messageCode: val
    })
  },
  next(){
    let the = this;
    let unionId = app.globalData.getUnionId();
    let tel = verify.isPhone(the.data.tel);
    let imgVal = verify.isImgCode(the.data.imgVal);
    if (!tel.judge){
        wx.showToast({
          title: tel.val,
          icon:"none"
        })
    } else if (!imgVal.judge){
        wx.showToast({
          title: imgVal.val,
          icon: "none"
        })
    }else{
      wx.showLoading({
        title: '',
      })
      wx.request({
        url: app.globalData.url +'wxapp/verify/imgCode',
        data: {
          unionId: unionId,
          mobile: tel.val,
          imgCode: imgVal.val
        },
        method: 'POST',
        success(res) {
          wx.hideLoading()
          if (res.data.code == 0){
            the.setData({
              isNext:true
            })
            the.get();
          }else{
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
          }
        },
        fail(){
          wx.hideLoading()
          wx.showToast({
            title: '发生网络错误',
            icon: "none"
          })
        }
      })
    }
    
  },
  // 获取短信验证码
  get() {
    var the = this;
    let id = app.globalData.getId();
    let tel = the.data.tel;
    let imgVal = the.data.imgVal;
    let unionId = wx.getStorageSync('logs').openId;
    the.setData({
      getBtn: 60
    })
    wx.request({
      url: app.globalData.url + 'wxapp/send/code',
      data: {
        mobile: tel,
        imgCode: imgVal,
        unionId: unionId
      },
      method: 'POST',
      success(res) {
        res = res.data;
        if (res.code == 0) {
          the.timer()
          wx.showToast({
            title: '发送成功',
            icon: 'none'
          })
        } else {
          the.setData({
            getBtn: '重新获取'
          })
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      },
      fail() {
        the.setData({
          getBtn: '重新获取'
        })
        wx.showToast({
          title: '网络发生错误',
          icon: 'none'
        })
      },
      complete() {

      }
    })
  },
  //确认提交信息
  sure(){
    let the = this;
    let tel = the.data.tel;
    let code = verify.isCode(the.data.messageCode);
    let UnionId = app.globalData.getUnionId();
    if (!code.judge){
      wx.showToast({
        title: code.val,
        icon: "none"
      })
    }else{
      wx.showLoading({
        title: '',
      })
      wx.request({
        url: app.globalData.url + '/wxapp/reg/login',
        method:'POST',
        data:{
          mobile: tel,
          code: code.val,
          unionId: UnionId
        },
        success(res){
          wx.hideLoading()
          if(res.data.code == 0){
            wx.setStorageSync('userNum', res.data.data.userNum)
            wx.navigateBack({
              delta: 1,
            })
          }else{
            wx.showToast({
              title:res.data.message,
              icon: "none"
            })
          }
        },
        fail(){
          wx.hideLoading()
          wx.showToast({
            title: '网络发生错误',
            icon: "none"
          })
        }
      })
    }
  },
  timer() {
    let the = this;
    timerName = setInterval(() => {
      let num = the.data.getBtn;
      if (num <= 1) {
        clearInterval(timerName)
        the.setData({
          getBtn: '重新获取'
        })
        return false;
      }
      num--
      the.setData({
        getBtn: num
      })
    }, 1000);
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
  onShow: function (options) {
    this.getImgUrl()
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