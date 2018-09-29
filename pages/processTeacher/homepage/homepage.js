//获取应用实例
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../utils/util.js")
Page({
  data: {
    loadingHidden: true,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    showModal: false
  },
  go: function () {
    this.setData({
      showModal: false
    })
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
      // 页面加载
      onLoad: function () {
        var that = this;
        this.setData({
          process_teacher_name: app.globalData.myInfo.process_teacher_imformation.processTeacherName,
          process_teacher_type: app.globalData.myInfo.process_teacher_imformation.processTeacherType,
          unprocess_num: app.globalData.myInfo.count_num.noprocessNum,
          unconfirm_num: app.globalData.myInfo.count_num.unconfirmNum, 
          to_teacher_num: app.globalData.myInfo.count_num.toTeacherNum
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