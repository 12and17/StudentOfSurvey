//获取应用实例
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../utils/util.js")
Page({
  data: {
    loadingHidden: true,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    searchKeyword: '',  //需要搜索的字符
    employees: '', //放置返回数据的数组
    error_text: '正在载入查询结果...',
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 5,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏
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
  //输入框事件，每输入一个字符，就会触发一次
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function (e) {
    this.setData({
      employees: '',
      searchPageNum: 1,   //第一次加载，设置1
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false, //把“没有数据”设为false，隐藏
      error_text: '正在载入查询结果...'
    })
    // this.fetchSearchList();
    var that = this;
    var urlStr = app.globalData.url + 'messenger/select';
    var messengerAccount = app.globalData.myInfo.messenger_imformation.messAccount;
    console.log(this.data.searchKeyword + messengerAccount);
    wx.request({
      dataType: "json",
      method: "GET",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        messengerAccount: messengerAccount,
        describeWord: this.data.searchKeyword
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
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
          var bar_num = res.data.data.length;
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].sumbitTime = util.conversionTime(res.data.data[i].sumbitTime)
          }
          that.setData({
            searchLoading: false,  //把"上拉加载"的变量设为true，显示
            searchLoadingComplete: true, //把“没有数据”设为false，隐藏
            employees: res.data.data,
            bar_num: bar_num
          })
        } else {
          that.setData({
            searchLoading: false,  //把"上拉加载"的变量设为true，显示
            searchLoadingComplete: true, //把“没有数据”设为false，隐藏
            error_text: '搜索失败...'
          })
        }
      },
      fail: function () {
        that.setData({
          searchLoading: false,  //把"上拉加载"的变量设为true，显示
          searchLoadingComplete: true, //把“没有数据”设为false，隐藏
          error_text: '服务器异常...'
        })
      }
    })
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.fetchSearchList();
    }
  },
  submit: function (e) {
    var index_text = e.currentTarget.dataset.id;
    console.log(index_text);
    // console.log('该序列是:' + e.currentTarget.dataset.id);
    this.setData({
      showModal: true,
      img_process1: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/gou2.jpg',
      img_process2: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/cha2.jpg',
      sumbit_time: util.conversionTime(app.globalData.myInfo.reject_problem[index_text].sumbitTime),
      reject_time: util.conversionTime(app.globalData.myInfo.reject_problem[index_text].rejectTime),
      reject_reason: app.globalData.myInfo.reject_problem[index_text].rejectReason
    })
  },
  go: function () {
    this.setData({
      showModal: false
    })
  },
  // 页面加载
  onLoad: function () {
    var that = this;
    this.setData({
      employees: app.globalData.myInfo.reject_problem,
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