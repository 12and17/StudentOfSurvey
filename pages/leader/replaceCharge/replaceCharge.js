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
    hidden: true,
    loadingHidden: true,
    chargeAccount: '',
    chargePassword: '',
    chargeName: '',
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
  /** 监听账号输入 */
  listenerAccountInput: function (e) {
    this.data.chargeAccount = e.detail.value;
  },
  /** 监听密码输入 */
  listenerPasswordInput: function (e) {
    this.data.chargePassword = e.detail.value;
    // console.log(this.data.mail);
  },
  /** 监听姓名输入 */
  listenerNameInput: function (e) {
    this.data.chargeName = e.detail.value;
    // console.log(this.data.mail);
  },
  finashAction: function () {
    var chargeAccount = this.data.chargeAccount;
    var chargePassword = this.data.chargePassword;
    var chargeName = this.data.chargeName;
    var that = this;

    if (chargeAccount === "" && chargePassword === "" && chargeName === "") {
      that.setData({
        loadingHidden: true,
        popErrorMsg: '三者不能都为空！'
      })
      setTimeout(function () {
        that.setData({
          popErrorMsg: ''
        })
      }, 2000)
      return;
    }

    var urlStr = app.globalData.url + 'leader/replaceOneCharge';
    wx.request({
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        chargeAccount: chargeAccount,
        chargePassword: chargePassword,
        chargeName: chargeName
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.success == true) {
          that.setData({
            text_value: ''
          })
          wx.showToast({
            title: '更换成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          that.setData({
            loadingHidden: true,
            popErrorMsg: res.data.error
          })
          setTimeout(function () {
            that.setData({
              popErrorMsg: ''
            })
          }, 2000)
        }
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
    var urlStr = app.globalData.url + 'leader/getChargeName';
    wx.request({
      method: "GET",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.success == true) {
          that.setData({
            charge_name: res.data.data.imformation
          })
        } else {
          that.setData({
            loadingHidden: true,
            popErrorMsg: res.data.error
          })
          setTimeout(function () {
            that.setData({
              popErrorMsg: ''
            })
          }, 2000)
        }
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
    this.setData({
      numShow: '',
      psdShow: 'none',
      modalHidden: true
    })
  },

})

var htmlToStr = require('../../utils/htmltostr.js');
