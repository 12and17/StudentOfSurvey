//获取应用实例
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../../utils/util.js")
Page({
  data: {
    loadingHidden: true,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    showModal: false
  },

  submit: function (e) {
    // var index_text = e.currentTarget.dataset.id;
    // console.log('序列是:' + app.globalData.myInfo.unsumbit_problem[1]);
    if (e.currentTarget.dataset.id == 1){
      this.setData({
        showModal: true,
        teach_num: app.globalData.myInfo.count_num.unassignOfTeachNum,
        equipment_num: app.globalData.myInfo.count_num.unassignOfEquipmentNum,
        demand_num: app.globalData.myInfo.count_num.unassignOfDemandNum
      })
    }

    if (e.currentTarget.dataset.id == 2) {
      this.setData({
        showModal: true,
        teach_num: app.globalData.myInfo.count_num.noConfiremOfTeachNum,
        equipment_num: app.globalData.myInfo.count_num.noConfiremOfEquipmentNum,
        demand_num: app.globalData.myInfo.count_num.noConfiremOfDemandNum
      })
    }
  },

  preventTouchMove: function () {

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
          chargeName: app.globalData.myInfo.charge_imformation.chargeName,
          unassign_num: app.globalData.myInfo.count_num.unassignTeacherNum,
          no_confirem_num: app.globalData.myInfo.count_num.noConfiremNum
        })
      }
  })

var htmlToStr = require('../../../utils/htmltostr.js');

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