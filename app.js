//app.js
App({
  globalData: {
    myInfo:"",
    // url: 'http://localhost:8090/',
    url: 'https://www.gy1217.club/studentOfSurvey-1.0-SNAPSHOT/',
    chargeName: '',
    wx_code: "jjj_ggg",
    my_email: "1064265810@qq.com",
    my_phone: "15982719207"
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  }
})
