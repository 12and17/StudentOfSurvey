//获取应用实例
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../../utils/util.js")
Page({
  data: {
    pssword: "",
    password1: "",
    password2: "",
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
  // 页面加载
  onLoad: function (options) {
    var that = this;
    this.setData({
      numShow: '',
      psdShow: 'none',
      modelInnerHtml: '',
      modalHidden: true
    })
  },
  //修改方法
  /**监听原密码输入*/
  listenerAgo: function (e) {
    this.data.password = e.detail.value;
  }
  ,
  /** 监听密码输入 */
  listenerPasswordInput1: function (e) {
    this.data.password1 = e.detail.value;
  },
  /**监听确认密码输入 */
  listenerPasswordInput2: function (e) {
    this.data.password2 = e.detail.value;
  },
  // 弹窗消失
  modalChange: function () {
    this.setData({
      modalHidden: true
    })
  },
  // 提交按钮点击事件
  loginAction: function () {
    var password3 = app.globalData.myInfo.charge_imformation.chargePassword;
    var passwords1 = this.data.password1;
    var passwords2 = this.data.password2;
    var password = this.data.password;
    var that = this;

    if (password === "") {
      this.setData({
        numShow: '',
        psdShow: 'none',
        modelInnerHtml: '原密码不能为空！',
        modalHidden: false
      })
      return;
    }
    if (passwords1 === "") {
      this.setData({
        numShow: '',
        psdShow: 'none',
        modelInnerHtml: '新密码不能为空！',
        modalHidden: false
      })
      return;
    }
    if (passwords2 === "") {
      this.setData({
        numShow: '',
        psdShow: 'none',
        modelInnerHtml: '确认不能为空！',
        modalHidden: false
      })
      return;
    }
    if (passwords1 !== passwords2) {
      this.setData({
        numShow: '',
        psdShow: 'none',
        modelInnerHtml: '两次密码不一致！',
        modalHidden: false
      })
      return;
    }
    console.log(password3 + "," + password);
    if (password3 !== password) {
      this.setData({
        numShow: '',
        psdShow: 'none',
        modelInnerHtml: '原密码错误！',
        modalHidden: false
      })
      return;
    }
    //加载提示框
    wx.showToast({
      title: '正在修改',
      icon: 'loading',
      duration: 10000
    })

    console.log(app.globalData.myInfo.charge_imformation.chargeAccount)
    var urlStr = app.globalData.url + 'charge/modify';
    wx.request({
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        chargeAccount: app.globalData.myInfo.charge_imformation.chargeAccount,
        password: passwords1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.success == true) {
          that.setData({
            numShow: '',
            psdShow: 'none',
            modelInnerHtml: '修改成功！即将跳转到登录界面...',
            modalHidden: false
          })
          setTimeout(function () {
            // this.data.loadingHidden = true;
            wx.redirectTo({
              url: '../../index/index'
            })
          }, 2000)
        } else {
          that.$wuxToast.show({
            type: 'text',
            timer: 2000,
            color: '#fff',
            text: res.data.employees[0].message,
            success: () => console.log('登录失败，请稍后重试。' + res.data.employees[0].message)
          })

        }
      },
      fail: function () {
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
        console.log("登录失败");
        that.$wuxToast.show({
          type: 'text',
          timer: 2000,
          color: '#fff',
          text: '服务器君好累😫，请稍后重试',
          success: () => console.log('登录失败，请稍后重试。')
        })
      }
    })
  }

})

var htmlToStr = require('../../utils/htmltostr.js');
