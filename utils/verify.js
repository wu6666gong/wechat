const verify = {
  isCode: function (str) {        //验证码判断
    if (!str) {
      return {
        judge: false,
        val: '请填写验证码'
      }
    } else if (str.length != 6) {
      return {
        judge: false,
        val: "验证码不正确"
      }
    } else {
      return {
        judge: true,
        val: str
      }
    }
  },
  isPwd: function (str) {              //密码不能为空
    if (!str) {
      return {
        judge: false,
        val: "支付密码不能为空"
      }
    } else if (!(str.length >= 6 && str.length <= 18)){
      return {
        judge: false,
        val: "支付密码不能小于6位"
      }
    }else {
      return {
        judge: true,
        val: str
      }
    }
  },
  isConfirmPwd: function (str, str2) {   //重复密码
    if (!str) {
      return {
        judge: false,
        val: '重复密码不能为空'
      }
    } else if (str != str2) {
      return {
        judge: false,
        val: '两次密码不一致'
      }
    } else {
      return {
        judge: true,
        val: str
      }
    }
  }
}
module.exports = verify