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
    messengerAccount: '',
    messengerPassword: '',
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
  /** 监听账号输入 */
  listenerAccountInput: function (e) {
    var that = this;
    this.data.messengerAccount = e.detail.value;
    // console.log(this.data.mail);
  },
  finashAction: function () {
    var messengerAccount = this.data.messengerAccount;
    var that = this;

    // console.log(messengerAccount + messengerPassword + classId);
    if (messengerAccount === "") {
      that.setData({
        loadingHidden: true,
        popErrorMsg: '账号不能为空！'
      })
      setTimeout(function () {
        that.setData({
          popErrorMsg: ''
        })
      }, 2000)
      return;
    }

    var urlStr = app.globalData.url + 'charge/getOneMessenger';
    wx.request({
      method: "GET",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        messengerAccount: messengerAccount,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.success == true) {
          that.setData({
            showModal: true,
            mess_account: res.data.data.messAccount,
            class_name: res.data.data.className,
            // demand_num: app.globalData.myInfo.count_num.unassignOfDemandNum
          })

          if (res.data.data.email == ''){
            that.setData({
              email: '未绑定'
            })
          }else{
            that.setData({
              email: res.data.data.email
            })
          }
        }else{
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
  //确定,确定删除
  determine: function () {
    var that = this;
    var urlStr = app.globalData.url + 'charge/deleteOneMessenger';
    wx.request({
      dataType: "json",
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        messengerAccount: this.data.messengerAccount
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // app.globalData.myInfo = res.data.data;
        // console.log(app.globalData.myInfo);
        // app.globalData.adminUserViewId = res.data.employees1;
        if (res.data.success == true) {
          that.setData({
            showModal: false,
            text_value: ''
          })
          wx.showToast({
            title: '删除成功',
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
          popErrorMsg: '服务器连接异常!',
        })
        setTimeout(function () {
          that.setData({
            popErrorMsg: ''
          })
        }, 2000)
      }
    })
  },
  go: function () {
    this.setData({
      showModal: false
    })
  },
  // 页面加载
  onLoad: function (options) {
    var that = this;
    this.setData({
      numShow: '',
      psdShow: 'none',
      modalHidden: true
    })
    var urlStr = 'http://localhost:8080/charge/getAllClass';
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
          var list = new Array();

          for (var i = 0; i < res.data.data.length; i++) {
            list[i] = res.data.data[i].className + '  ' + '(' + res.data.data[i].messengerNum + ')'
          }

          that.setData({
            selectData: list,
            selectValue: res.data.data
          })
        } else {
          this.setData({
            loadingHidden: true,
            popErrorMsg: '数据库连接错误!'
          })
          setTimeout(function () {
            that.setData({
              popErrorMsg: ''
            })
          }, 2000)
        }
      },
      fail: function () {
        this.setData({
          loadingHidden: true,
          popErrorMsg: '服务器异常!'
        })
        setTimeout(function () {
          that.setData({
            popErrorMsg: ''
          })
        }, 2000)
      }
    })
  },

})

var htmlToStr = require('../../utils/htmltostr.js');
