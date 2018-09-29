//获取应用实例
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../utils/util.js")
Page({
  data: {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wx_code: app.globalData.wx_code,
      my_email: app.globalData.my_email,
      my_phone: app.globalData.my_phone
    })
  },

      /**
 * 生命周期函数--监听页面初次渲染完成
 */
      onReady: function () {

      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function () {
        //执行初始化
      },

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: function () {

      },

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: function () {

      },

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: function () {
        // 显示顶部刷新图标  
        _page = 0;
        wx.showNavigationBarLoading();
        this.dataRefresh("init");
      },
      /**
       * ---------------------------------------
       */

      /**
    * Img处理函数
    */
      about_6_click: function (e) {

      },

      /**
      * text处理函数
      */
      about_7_click: function (e) {

      },

      /**
      * Img处理函数
      */
      about_8_click: function (e) {

      },

      /**
      * Img处理函数
      */
      about_9_click: function (e) {

      },

      /**
      * text处理函数
      */
      about_10_click: function (e) {

      },

      /**
      * text处理函数
      */
      about_11_click: function (e) {

      },

      /**
      * text处理函数
      */
      about_13_click: function (e) {

      },

      /**
      * Img处理函数
      */
      about_17_click: function (e) {

      },

      /**
      * text处理函数
      */
      about_18_click: function (e) {

      },

      /**
      * text处理函数
      */
      about_19_click: function (e) {

      },

      /**
      * Img处理函数
      */
      about_20_click: function (e) {

      },

      /**
      * Img处理函数
      */
      about_21_click: function (e) {

      },

      /**
      * text处理函数
      */
      about_22_click: function (e) {

      },

      /**
      * button处理函数
      */
      about_23_click: function (e) {
        var self = this;
        wx.setClipboardData({
          data: app.globalData.wx_code,
          success: function (res) {
            // self.setData({copyTip:true}),
            wx.showModal({
              title: '提示',
              content: '复制成功',
              success: function (res) {
                if (res.confirm) {
                  console.log('确定')
                } else if (res.cancel) {
                  console.log('取消')
                }
              }
            })
          }
        });
      },

      /**
      * Img处理函数
      */
      about_24_click: function (e) {

      },

      /**
      * text处理函数
      */
      about_25_click: function (e) {

      },

      /**
      * button处理函数
      */
      about_26_click: function (e) {
        var self = this;
        wx.setClipboardData({
          data: app.globalData.my_email,
          success: function (res) {
            // self.setData({copyTip:true}),
            wx.showModal({
              title: '提示',
              content: '复制成功',
              success: function (res) {
                if (res.confirm) {
                  console.log('确定')
                } else if (res.cancel) {
                  console.log('取消')
                }
              }
            })
          }
        });
      },

      /**
      * Img处理函数
      */
      about_27_click: function (e) {
        
      },

      /**
      * text处理函数
      */
      about_28_click: function (e) {

      },

      /**
      * button处理函数
      */
      about_29_click: function (e) {
        wx.makePhoneCall({
          phoneNumber: app.globalData.my_phone
        })
      },



      /**
       * ---------------------------------------
       */

      /**
      * 用户点击右上角分享
      */
      onShareAppMessage: function () {

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