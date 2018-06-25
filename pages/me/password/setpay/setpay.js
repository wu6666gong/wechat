let app = getApp();
const verify = require("../../../../utils/verify.js")
let timerName;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd1:'',
    pwd2:'',
    code:'',
    getBtn:'获取',
    imgUrl:"",
    imgVal:""
  },
  /**
   * 支付密码
   */
  pwd1(e){
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
   * 输入验证码
   */
  code(e){
    let val = e.detail.value
    this.setData({
      code: val
    })
  },
  /**
  * 图形验证码
  */
  imgCode(e) {
    let val = e.detail.value;
    this.setData({
      imgVal: val
    })
  },
    /**
   * 获取图片验证码
   */
  getImgCode(){
    let unionId = wx.getStorageSync('logs').openId;
    let imgUrl = app.globalData.url + "gainImgCode/" + unionId + "?" + Math.random();
    this.setData({
      imgUrl: imgUrl
    })
  },
   /**
   * 获取验证码
   */
  get(){
    var the = this;
    let id = app.globalData.getId();
    let UnionId = app.globalData.getUnionId();
    let imgVal = verify.isImgCode(the.data.imgVal);
    if (!imgVal.judge) {
      wx.showToast({
        title: imgVal.val,
        icon: "none"
      })
      return false
    }
    the.setData({
      getBtn:60
    })
    wx.request({
      url: app.globalData.url + 'wxapp/send/sms ',
      data:{
        unionId: UnionId,
        num:id,
        imgCode: imgVal.val
      },
      method:'POST',
      success(res){
        res = res.data;
        if(res.code == 0){
          the.timer()
          wx.showToast({
            title: '发送成功',
            icon:'none'
          })
        }else{
          the.setData({
            getBtn: '重新获取'
          })
          wx.showToast({
            title: res.message ,
            icon: 'none'
          })
        }
      },
      fail(){
        the.setData({
          getBtn: '重新获取'
        })
        wx.showToast({
          title: '网络发生错误',
          icon: 'none'
        })
      },
      complete(){

      }
    })
  },
  /**
   * 提交
   */
  sure(){
      const the = this;
      const id = app.globalData.getId();
      const UnionId = app.globalData.getUnionId();
      let pwd1 = verify.isPwd(the.data.pwd1);
      let pwd2 = verify.isConfirmPwd(the.data.pwd2, the.data.pwd1);
      let code = verify.isCode(the.data.code);
      let imgVal = verify.isImgCode(the.data.imgVal);
      if (!pwd1.judge){
        wx.showToast({
          title: pwd1.val,
          icon:"none"
        })
      } else if (!pwd2.judge){
        wx.showToast({
          title: pwd2.val,
          icon: "none"
        })
      } else if (!imgVal.judge ){
        wx.showToast({
          title: imgVal.val,
          icon: "none"
        })
      }else if (!code.judge){
        wx.showToast({
          title: code.val,
          icon: "none"
        })
      }else{
        wx.showLoading({
          title: '',
        })
        let data = {};
        data.userNum = id;
        data.password = pwd1.val;
        data.code = code.val;
        data.UnionId = UnionId;
        data.imgCode = imgVal.val;
        wx.request({
          url: app.globalData.url +'wxapp/set/psd',
          method:'POST',
          data:data,
          success(res){
            wx.hideLoading()
            console.log(res)
            if (res.data.code == 0){
              the.paySuccess();
            }else{
              wx.showToast({
                title: res.data.message,
                icon:"none"
              })
            }
          },
          fail(){
            wx.hideLoading()
            wx.showToast({
              title: '网路错误',
              icon:'none'
            })
          }
        })
      }
  },
  paySuccess(){
    wx.showModal({
      title: 'Artval提示',
      content: '恭喜设置支付密码成功，您可以进行艺术品估价等操作',
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
  timer(){
    let the = this;
    timerName = setInterval(()=>{
      let num = the.data.getBtn;
      if (num <= 1){
        clearInterval(timerName)
        the.setData({
          getBtn:'重新获取'
        })
        return false;
      }
      num--
      the.setData({
        getBtn: num
      })  
    },1000);
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
    this.getImgCode()
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