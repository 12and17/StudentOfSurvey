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
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    email: "",
    hidden: true,
    loadingHidden: true,
    selectValue: '',
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
  listenerAccountInput: function (e) {
    var that = this;
    this.data.messengerAccount = e.detail.value;
  },
  listenerPasswordInput: function (e) {
    var that = this;
    this.data.messengerPassword = e.detail.value;
  },
  finashAction: function () {
    var messengerAccount = this.data.messengerAccount;
    var messengerPassword = this.data.messengerPassword;
    var classId = this.data.selectValue[this.data.index].classId;
    var that = this;

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

    if (messengerPassword === "") {
      that.setData({
        loadingHidden: true,
        popErrorMsg: '密码不能为空！'
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
      title: '正在添加',
      icon: 'loading',
      duration: 10000
    })

    var urlStr = app.globalData.url + 'charge/addOneMessenger';
    wx.request({
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        classId: classId,
        messengerAccount: messengerAccount,
        messengerPassword: messengerPassword
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.success == true) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(function () {
            wx.redirectTo({
              url: '../addMessenger/addMessenger'
            })
          }, 2000)
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
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  // 页面加载
  onLoad: function (options) {
    var that = this;
    this.setData({
      numShow: '',
      psdShow: 'none',
      modalHidden: true
    })
    var urlStr = app.globalData.url + 'charge/getAllClass';
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
