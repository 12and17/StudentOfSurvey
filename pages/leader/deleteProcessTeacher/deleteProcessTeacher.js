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
    processTeacherAccount: '',
    processTeacherPassword: '',
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
    this.data.processTeacherAccount = e.detail.value;
    // console.log(this.data.mail);
  },
  finashAction: function () {
    var processTeacherAccount = this.data.processTeacherAccount;
    var that = this;

    // console.log(processTeacherAccount + processTeacherPassword + classId);
    if (processTeacherAccount === "") {
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

    var urlStr = app.globalData.url + 'leader/getOneProcessTeacher';
    wx.request({
      method: "GET",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        processTeacherAccount: processTeacherAccount,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.success == true) {
          that.setData({
            showModal: true,
            teacher_account: res.data.data.processTeacherAccount,
            teacher_name: res.data.data.processTeacherName,
            process_type: res.data.data.processTeacherType
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
    var processTeacherAccount = this.data.processTeacherAccount;
    var urlStr = app.globalData.url + 'leader/deleteOneProcessTeacher';
    wx.request({
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        processTeacherAccount: processTeacherAccount
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
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
    this.setData({
      numShow: '',
      psdShow: 'none',
      modalHidden: true
    })
  },

})

var htmlToStr = require('../../utils/htmltostr.js');
