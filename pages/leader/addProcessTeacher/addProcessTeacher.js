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
    processTeacherAccount: '',
    processTeacherPassword: '',
    processTeacherName: '',
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
  listenerPasswordInput: function (e) {
    var that = this;
    this.data.processTeacherPassword = e.detail.value;
    // console.log(this.data.mail);
  },
  listenerNameInput: function (e) {
    var that = this;
    this.data.processTeacherName = e.detail.value;
    // console.log(this.data.mail);
  },
  finashAction: function () {
    var processTeacherAccount = this.data.processTeacherAccount;
    var processTeacherPassword = this.data.processTeacherPassword;
    var processTeacherName = this.data.processTeacherName;
    var process_type = '';
    if (this.data.index == 0) {
      process_type = '日常教学问题'
    } else if (this.data.index == 1) {
      process_type = '设备问题'
    } else if (this.data.index == 2) {
      process_type = '需求和建议'
    }
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

    if (processTeacherPassword === "") {
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

    if (processTeacherName === "") {
      that.setData({
        loadingHidden: true,
        popErrorMsg: '教师姓名不能为空！'
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

    var urlStr = app.globalData.url + 'leader/addOneProcessTeacher';
    console.log('值是：' + process_type);
    wx.request({
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        processType: process_type,
        processTeacherAccount: processTeacherAccount,
        password: processTeacherPassword,
        processTeacherName: processTeacherName
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (res) {
        if (res.data.success == true) {
          if (process_type == 'richangjiaoxue'){
            app.globalData.myInfo.count_num.teachTeacherNum += 1
          }else if(process_type == 'shebei'){
            app.globalData.myInfo.count_num.equipmentTeacherNum += 1
          }else if (process_type == 'xuqiu'){
            app.globalData.myInfo.count_num.demandTeacherNum += 1
          }
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(function () {
            wx.redirectTo({
              url: '../addProcessTeacher/addProcessTeacher'
            })
          }, 2000)
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
    var list = new Array();

    list[0] = '日常教学问题' + '(' + app.globalData.myInfo.count_num.teachTeacherNum + ')';
    list[1] = '设备问题' + '(' + app.globalData.myInfo.count_num.equipmentTeacherNum + ')';
    list[2] = '需求和建议' + '(' + app.globalData.myInfo.count_num.demandTeacherNum + ')';

    that.setData({
      selectData: list,
      selectValue: list[0]
    })
  },

})

var htmlToStr = require('../../utils/htmltostr.js');
