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

  submit: function (e) {
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        showModal: true,
        teach_num: app.globalData.myInfo.problem_num.unprocessOfTeachNum,
        equipment_num: app.globalData.myInfo.problem_num.unprocessOfEquipmentNum,
        demand_num: app.globalData.myInfo.problem_num.unprocessOfDemandNum
      })
    }

    if (e.currentTarget.dataset.id == 2) {
      this.setData({
        showModal: true,
        teach_num: app.globalData.myInfo.problem_num.rejectOfTeachNum,
        equipment_num: app.globalData.myInfo.problem_num.rejectOfEquipmentNum,
        demand_num: app.globalData.myInfo.problem_num.rejectOfDemandNUm
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
      this.setData({
        display: "block",
        translate: 'transform: translateX(' + this.data.windowWidth * 0.5 + 'px);',
        zindex: '1'
      })
    } else if (start_clientX - end_clientX > 0) {
      this.setData({
        display: "none",
        translate: ''
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
          className: app.globalData.myInfo.messenger_imformation.className,
          unprocess_num: app.globalData.myInfo.problem_num.unprocessTeacherNum,
          reject_num: app.globalData.myInfo.problem_num.rejectNum,
          zindex: '-1'
        })
      }
  })

var htmlToStr = require('../../utils/htmltostr.js');
