//获取应用实例
var start_clientX;
var end_clientX;
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s） 
var interval = null;
const app = getApp()
const util = require("../../../utils/util.js")
Page({
  data: {
    pssword: "",
    password1: "",
    password2: "",
    getCode: "",
    time: currentTime,
    text: "点击获取",
    email: "",
    code: "",
    hidden: true,
    loadingHidden: true,
    windowWidth: wx.getSystemInfoSync().windowWidth
  },
  // 滑动开始
  touchstart: function (e) {
    start_clientX = e.changedTouches[0].clientX
  },
  // 滑动结束
  touchend: function (e) {
    end_clientX = e.changedTouches[0].clientX;
    if (end_clientX - start_clientX > 120) {
      // console.log(this.data.windowWidth * 0.7);
      this.setData({
        display: "block",
        translate: 'transform: translateX(' + this.data.windowWidth * 0.5 + 'px);',
        zindex: '1'
      })
    } else if (start_clientX - end_clientX > 0) {
      this.setData({
        display: "none",
        translate: '',
        zindex: '-1'
      })
    }
  },
  // 遮拦
  hideview: function () {
    this.setData({
      display: "none",
      translate: '',
      zindex: '-1'
    })
  },
  //侧滑栏碰触开始
  mytouchstart: function (e) {
    console.log('触碰开始')
  },
  //侧滑栏碰触结束
  my_home_end: function (e) {
    console.log('触碰结束');
  },
  //点击侧滑栏选项
  home: function (e) {
    console.log('点击');
  },
  /** 监听邮箱输入 */
  listenerMailInput: function (e) {
    var that = this;
    this.data.email = e.detail.value;
    // console.log(this.data.mail);
    if (e.detail.value != "") {
      //  var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      var reg = /^\w+((-\w+)|(\.\w+))*\@(qq|QQ)+((\.)(com|cn))/;
      var isok = reg.test(e.detail.value);
      if (!isok) {
        this.setData({
          loadingHidden: true,
          popErrorMsg: '邮箱格式不对'
        })
        setTimeout(function () {
          that.setData({
            popErrorMsg: ''
          })
        }, 500)
      }
    }
  },
  /** 监听验证码输入 */
  listenerCodeInput: function (e) {
    this.data.code = e.detail.value;
  },
  getCode: function () {
    var reg = /^\w+((-\w+)|(\.\w+))*\@(qq|QQ)+((\.)(com|cn))/;
    var email = this.data.email;
    var isok = reg.test(email);
    if (!isok){
      this.setData({
        loadingHidden: true,
        popErrorMsg: '邮箱格式不对'
      })
      setTimeout(function () {
        that.setData({
          popErrorMsg: ''
        })
      }, 500)
      return
    }
    if (currentTime >= 0 && currentTime === maxTime) {
      var that = this
      currentTime = maxTime
      interval = setInterval(function () {
        currentTime--
        that.setData({
          time: currentTime
        })
        var time = currentTime;
        that.setData({
          text: "重新获取(" + time + ")",
          color: 'darkgray'
        })

        if (currentTime == 0) {
          that.setData({
            text: "点击重新获取",
            color: 'white'
          })
          currentTime = maxTime;
          clearInterval(interval);
          return;
        }
      }, 1000)
      console.log(email);
      var that = this;
      var urlStr = app.globalData.url + 'messenger/getVerification';
      wx.request({
        method: "GET",
        url: urlStr, //仅为示例，并非真实的接口地址
        data: {
          mailAccount: email
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.success == true) {
            that.data.getCode = res.data.data.imformation
          } else {
            that.setData({
              loadingHidden: true,
              popErrorMsg: '获取失败'
            })
            setTimeout(function () {
              that.setData({
                popErrorMsg: ''
              })
            }, 1000)

          }
        },
        fail: function () {
          that.setData({
            loadingHidden: true,
            popErrorMsg: '服务器异常'
          })
          setTimeout(function () {
            that.setData({
              popErrorMsg: ''
            })
          }, 2000)
        }
      })
    } else {
      wx.showToast({
        title: '已发到您的邮箱，请稍后重试!',
        icon: 'loading',
        duration: 700
      })
    }
  },
  finashAction: function () {
    var leaderAccount = app.globalData.myInfo.leader_imformation.leaderAccount;
    var email = this.data.email;
    var code = this.data.code;
    var that = this;

    console.log(this.data.getCode);
    if (code === "") {
      that.setData({
        loadingHidden: true,
        popErrorMsg: '验证码不能为空！'
      })
      setTimeout(function () {
        that.setData({
          popErrorMsg: ''
        })
      }, 2000)
      return;
    }
    if (code !== this.data.getCode) {
      that.setData({
        loadingHidden: true,
        popErrorMsg: '验证码错误！'
      })
      setTimeout(function () {
        that.setData({
          popErrorMsg: ''
        })
      }, 2000)
      return;
    }

    //加载提示框
    wx.showToast({
      title: '正在绑定',
      icon: 'loading',
      duration: 10000
    })

    var urlStr = 'http://localhost:8080/leader/modifyEmail';
    wx.request({
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        leaderAccount: leaderAccount,
        email: email
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })

        wx.redirectTo({
          url: '../homepage/homepage'
        })
      },
      fail: function () {
        that.setData({
          loadingHidden: true,
          popErrorMsg: '服务器错误！'
        })
        setTimeout(function () {
          that.setData({
            popErrorMsg: ''
          })
        }, 2000)
      }
    })
  },
  // 页面加载
  onLoad: function (options) {
    var that = this;
    if (app.globalData.myInfo.leader_imformation.email == '' || app.globalData.myInfo.leader_imformation.email == null) {
      this.setData({
        email: '暂无'
      })
    } else {
      this.setData({
        email: app.globalData.myInfo.leader_imformation.email
      })
    }
    this.setData({
      numShow: '',
      psdShow: 'none',
      modelInnerHtml: '',
      modalHidden: true
    })
  },

})

var htmlToStr = require('../../utils/htmltostr.js');
