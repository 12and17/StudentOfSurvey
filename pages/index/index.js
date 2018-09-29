//index.js
var common = require('common.js')
//获取应用实例
var app = getApp()
const util = require("../../utils/util.js")
Page({
  data: {
    phonenumber: '',
    password: '',
    // bgimg: '../../images/0.jpg',
    bgimg: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/0.jpg',
    numShow: 'none',
    psdShow: 'none',
    modelInnerHtml: '123',
    loadingHidden: true,
    modalHidden: true,
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['请选择', '信息员', '管理教师', '处理教师', '领导'], //下拉列表的数据
    index: 0 //选择的下拉列表下标
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  //  点击城市组件确定事件  
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      inputValue: '',
      bgimg: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/' + e.detail.value + '.jpg'
      // bgimg: '../../images/' + e.detail.value + '.jpg'
    })
  },
  onLoad: function() {
    // common.sayHello()

    console.log('onLoad')
    var that = this
    //登录
    wx.login({
      success: function() {
        wx.getUserInfo({
          success: function(res) {
            that.setData({
              userInfo: res.userInfo
            })
            that.update()
          }
        })
      },
      fail: function(res) {
        console.log(res)
      }
    });
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 账号修改
  bindNumInput: function(e) {
    this.setData({
      numShow: 'none',
      phonenumber: e.detail.value
    })
    console.log(this.data.phonenumber)
  },
  // 密码修改
  bindPsdInput: function(e) {
    this.setData({
      psdShow: 'none',
      password: e.detail.value
    })
    console.log(this.data.password)
  },
  // 账号失去焦点
  numChange: function() {
    if (this.data.phonenumber == '') {
      this.setData({
        numShow: '',
        psdShow: 'none'
      })

      console.log('手机号不能为空' + this.data.numShow);
    }
  },
  // 密码失去焦点
  psdChange: function() {
    if (this.data.password == '') {
      this.setData({
        numShow: 'none',
        psdShow: ''
      })

      console.log('密码不能为空' + this.data.psdShow);
    }
  },
  // 弹窗消失
  modalChange: function() {
    this.setData({
      modalHidden: true
    })
  },
  // 点击提交按钮
  loginSubmit: function(e) {
    console.log(this);
    var that = this;
    var index = this.data.index;
    if (this.data.index != 0 && this.data.phonenumber != '' && this.data.password != '') {
      if (this.data.index == 1) {
        // var urlStr = 'http://localhost:8090/login/messenger';
        var urlStr = app.globalData.url + 'login/messenger';
      } else if (this.data.index == 2) {
        var urlStr = app.globalData.url + 'login/charge';
      } else if (this.data.index == 3) {
        var urlStr = app.globalData.url + 'login/processTeacher';
      } else if (this.data.index == 4) {
        var urlStr = app.globalData.url + 'login/leader';
      }
      this.setData({
        numShow: 'none',
        psdShow: 'none',
        loadingHidden: false
      })
      wx.request({
        dataType: "json",
        method: "GET",
        url: urlStr, //仅为示例，并非真实的接口地址
        data: {
          account: this.data.phonenumber,
          password: this.data.password
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        success: function(res) {
          app.globalData.myInfo = res.data.data;
          console.log(app.globalData.myInfo);
          // app.globalData.adminUserViewId = res.data.employees1;
          if (res.data.success == true) {
            // 设置全局变量的值
            // app.globalData.adminUserViewId = res.data;
            // 切换到首页
            // console.log(res.data.employees1[0].Value)
            setTimeout(function() {
              // this.data.loadingHidden = true;
              that.setData({
                loadingHidden: true
              })
              if (index == 1) {
                wx.redirectTo({
                  url: '../zhihu/zhihu'
                })
                if (app.globalData.myInfo.reject_problem.length > app.globalData.myInfo.unsumbit_problem.length) {
                  for (var i = 0; i < app.globalData.myInfo.reject_problem.length; i++) {
                    app.globalData.myInfo.reject_problem[i].sumbitTime = util.conversionTime(app.globalData.myInfo.reject_problem[i].sumbitTime);
                    if (i < app.globalData.myInfo.unsumbit_problem.length) {
                      app.globalData.myInfo.unsumbit_problem[i].sumbitTime = util.conversionTime(app.globalData.myInfo.unsumbit_problem[i].sumbitTime)
                    }
                  }
                } else {
                  for (var i = 0; i < app.globalData.myInfo.unsumbit_problem.length; i++) {
                    app.globalData.myInfo.unsumbit_problem[i].sumbitTime = util.conversionTime(app.globalData.myInfo.unsumbit_problem[i].sumbitTime)
                    if (i < app.globalData.myInfo.reject_problem.length) {
                      app.globalData.myInfo.reject_problem[i].sumbitTime = util.conversionTime(app.globalData.myInfo.reject_problem[i].sumbitTime);
                    }
                  }
                }
              } else if (index == 2) {
                wx.redirectTo({
                  url: '../charge/homepage/homepage'
                })
              } else if (index == 3) {
                wx.redirectTo({
                  url: '../processTeacher/homepage/homepage'
                })
              } else if (index == 4) {
                wx.redirectTo({
                  url: '../leader/homepage/homepage'
                })
              }
            }, 1000)
          } else {
            that.setData({
              loadingHidden: true,
              popErrorMsg: res.data.error
            })
            setTimeout(function() {
              that.setData({
                popErrorMsg: ''
              })
            }, 2000)
          }
        },
        fail: function() {
          that.setData({
            loadingHidden: true,
            popErrorMsg: '服务器君好累😫，请稍后重试'
          })
          setTimeout(function() {
            that.setData({
              popErrorMsg: ''
            })
          }, 2000)
          console.log("登录失败");
        }
      })
      console.log("Success");

    } else if (this.data.index == 0) {
      this.setData({
        numShow: '',
        psdShow: 'none',
        modelInnerHtml: '登陆者类型不能为空',
        modalHidden: false
      })
    } else if (this.data.index != 0 && this.data.phonenumber == '') {
      this.setData({
        numShow: '',
        psdShow: 'none',
        modelInnerHtml: '账号不能为空',
        modalHidden: false
      })

      console.log("phonenumber不能为空" + this.data.numShow)
    } else if (this.data.password == '' && this.data.phonenumber != '' && this.data.index != 0) {
      this.setData({
        numShow: 'none',
        psdShow: '',
        modelInnerHtml: '密码不能为空',
        modalHidden: false
      })

      console.log("password不能为空" + this.data.psdShow)
    } else {
      this.setData({
        numShow: '',
        psdShow: '',
        modelInnerHtml: '账号密码不能为空',
        modalHidden: false
      })

      console.log("phonenumber不能为空" + this.data.numShow + "password不能为空" + this.data.psdShow)
    }
  },
  // 点击找回密码
  RandP: function() {
    this.setData({
      modelInnerHtml: '暂不支持注册和密码找回',
      modalHidden: false
    })
    console.log("暂不支持注册和密码找回")
  }
})