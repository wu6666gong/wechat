var initial={
  mask: true,
  maskCon: false,
  RMB: '',  //估价人民币
  multiple: "", //估价的倍数
  pwd: ""
}
Component({
  properties:{
    innerText:{
      type:String,
      value:"default value"
    }
  },
  data:{
    mask: true,
    maskCon: false,
    RMB: '',  //估价人民币
    multiple: "", //估价的倍数
    pwd: ""
  },
  methods:{
    tapName:function(){
      console.log('aaa');
      wx.previewImage({
        current: 'https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/PbiwZrwtez/cover.png',
        urls: ["https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/PbiwZrwtez/cover.png", "https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/QsE2h3rkxB/cover.png"] // 需要预览的图片http链接列表
      })
    },
    appraisal(){
      var the = this;
      wx.getSetting({
        success: function (res){
          if (res.authSetting['scope.userInfo']){
            the.setData({
              mask: false
            })
          }else{
            wx.navigateTo({
              url: '/pages/login/login?url=/pages/login/login'
            })
          }
        }
      })
    },
    //弹窗取消按钮
    cancel(){
      this.setData(initial)
    },
    //弹窗确认按钮
    sure(){
      let data = this.data;
      if (!data.RMB){
        wx.showToast({
          title: '填写估价金额',
          icon: 'none'
        })
      } else if(!data.multiple){
        wx.showToast({
          title: '填写估价倍数',
          icon: 'none'
        })
      }else{
        this.setData({
          maskCon: true
        });
      }
    },
    //弹窗上一步
    prev(){
      this.setData({
        maskCon:false
      })
    },
    // 绑定金额
    bindRMB(e) {
      let val = e.detail.value;
      this.setData({
        RMB: val
      })
    },
    //绑定倍数
    bindMultiple(e){
      let val = e.detail.value;
      this.setData({
        multiple: val
      })
    },
    bindPwd(e){
      let val = e.detail.value;
      this.setData({
        pwd: val
      })
    },
    sub(){
      let the = this;
      let data = the.data;
      if (!data.pwd) {
        wx.showToast({
          title: '填写支付密码',
          icon: 'none'
        })
      }else{
        wx.showLoading({
          title:"提交中",
          mask:true,
          complete(){
            setTimeout(()=>{
              the.setData(initial);
              wx.hideLoading();
            },3000)
          }
        })
       
      }
     
    }
  },
  created:function(){
  }
})