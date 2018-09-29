//获取应用实例
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../utils/util.js")
Page({
  data: {
    loadingHidden: true,
    texts: "至少5个字",
    pro_type: '',
    min: 5,//最少字数
    max: 200, //最多字数 (根据自己需求改变)
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
        zindex:'-1'
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
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    console.log(value);

    //最少字数限制
    if (len <= this.data.min)
      this.setData({
        texts: "够5个字可以提交"
      })
    else if (len > this.data.min)
      this.setData({
        texts: " "
      })
    
    wx.setStorageSync('edit_value', value);
    //字数满了10个字缓存
    if (len % 10 == 5){
      var that = this;
      this.setData({
        hint_text: "已缓存" //当前字数  
      });
      setTimeout(function () {
        //要延时执行的代码
        that.setData({
          hint_text: "" //当前字数  
        });
      }, 1000) //延迟时间 这里是1秒
    }
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
      // 页面加载
      onLoad: function (options) {
        var that = this;
        this.data.pro_type = options.type;
        console.log(wx.getStorageSync('edit_value'));
        var realType = '';
        if (options.type == 'richangjiaoxue'){
          realType = '日常教学问题'
        }else if(options.type == 'shebei'){
          realType = '设备问题'
        }else{
          realType = '需求和建议'
        }
        this.setData({
          edit_text: wx.getStorageSync('edit_value'),
          problem_type: realType,
        })
      },
      //提交按钮
      loginAction: function () {
        this.setData({
          hint_text: "正在提交服务器..." //当前字数  
        });
        var that = this;
        var urlStr = app.globalData.url + 'messenger/sumbit';
        var messengerAccount = app.globalData.myInfo.messenger_imformation.messAccount;
        var problemDiscrible = wx.getStorageSync('edit_value');
        var problemType = '';
        if (this.data.pro_type == 'richangjiaoxue') {
          problemType = '日常教学问题'
        } else if (this.data.pro_type == 'shebei') {
          problemType = '设备问题'
        } else {
          problemType = '需求和建议'
        }
        // console.log(this.data.pro_type + '值是' + problemDiscrible + '账号' + messengerAccount);
        wx.request({
          dataType: "json",
          method: "POST",
          url: urlStr, //仅为示例，并非真实的接口地址
          data: {
            messengerAccount: messengerAccount,
            // messengerAccount: "20151943",
            problemType: problemType,
            // problemType: '676987384',
            problemDiscrible: problemDiscrible
            // problemDiscrible: '1232343534543343243'
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          success: function (res) {
            // app.globalData.myInfo = res.data.data;
            // console.log(app.globalData.myInfo);
            // app.globalData.adminUserViewId = res.data.employees1;
            if (res.data.success == true) {
              // 设置全局变量的值
              // app.globalData.adminUserViewId = res.data;
              // 切换到首页
              // console.log(res.data.employees1[0].Value)
              wx.setStorageSync('edit_value', '');
              that.setData({
                edit_text: wx.getStorageSync('edit_value')
              })
              that.setData({
                hint_text: "" //当前字数  
              });
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              })
              app.globalData.myInfo.problem_num.unprocessOfTeachNum = app.globalData.myInfo.problem_num.unprocessOfTeachNum + 1
            } else {
              that.setData({
                loadingHidden: true,
                popErrorMsg: '提交失败'
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
              popErrorMsg: '服务器异常'
            })
            setTimeout(function () {
              that.setData({
                popErrorMsg: ''
              })
            }, 2000)
          }
        })
      }

  })

var htmlToStr = require('../../utils/htmltostr.js');

// var htmlToStr = function(hStr) {
//   var rootArr = hStr.split('');
//   var finalArr = [],j = 0;
//   for(var i = 0 ; i < rootArr.length ; i ++ ) {
//     if(rootArr[i] == '<') {

//       while(1){
//         if(rootArr[j] == '>') {
//           break;
//         }else {
//           j++;
//         }
//       }
//     }else {
//       finalArr[j] = rootArr[i];
//       j++;
//     }
//   }

//   return finalArr.join('');
// }