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
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 4,      //返回数据的个数
    problemType: '',
    teacherAccount: '',
    problemId: '',
    process_course: '',
    selectWord: '',
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
  //搜索，访问网络
  fetchSearchList: function () {
    let that = this;
    let problemType = that.data.problemType,//输入框字符串作为参数
      searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数
      callbackcount = that.data.callbackcount, //返回数据的个数
      searchKeyword = that.data.searchKeyword; //键盘输入的搜索词
    console.log('页数' + problemType)
    //访问网络
    util.getSearchMusic(problemType, searchPageNum, callbackcount, searchKeyword, 'unagreeToLeader', function (data) {
      console.log(data)
      //判断是否有数据，有则取数据
      if (data.data.length != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        that.data.isFromSearch ? searchList = data.data : searchList = that.data.searchSongList.concat(data.data)
        for (var i = 0; i < searchList.length; i++) {
          searchList[i].sumbitTime = util.conversionTime(searchList[i].sumbitTime);
          searchList[i].processTime = util.conversionTime(searchList[i].processTime)
        }
        if (searchList.length < 4) {
          that.setData({
            searchSongList: searchList, //获取数据数组
            searchLoading: false,
            searchLoadingComplete: true, //把“没有数据”设为true，显示
          });
        } else {
          that.setData({
            searchSongList: searchList, //获取数据数组
            searchLoadingComplete: false,
            searchLoading: true   //把"上拉加载"的变量设为false，显示
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏
        });
      }
    })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function (e) {
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1
      searchSongList: [],  //放置返回数据的数组,设为空
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    console.log("底部");
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
    var that = this;
    this.data.problemId = e.currentTarget.dataset.id;
    var urlStr = app.globalData.url + 'leader/agreeProblem';

    wx.request({
      dataType: "json",
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        problemId: this.data.problemId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.success == true) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            searchPageNum: 1,
          });
          app.globalData.myInfo.count_num.unagreeNum = app.globalData.myInfo.count_num.unagreeNum - 1;
          if (that.data.problemType === 'richangjiaoxue') {
            app.globalData.myInfo.count_num.unagreeOfTeachNum = app.globalData.myInfo.count_num.unagreeOfTeachNum - 1
          } else if (that.data.problemType === 'shebei') {
            app.globalData.myInfo.count_num.unagreeOfEquipmentNum = app.globalData.myInfo.count_num.unagreeOfEquipmentNum - 1
          } else if (that.data.problemType === 'xuqiu') {
            app.globalData.myInfo.count_num.unagreeOfDemandNum = app.globalData.myInfo.count_num.unagreeOfDemandNum - 1
          }
          that.fetchSearchList();
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
  //确定2,处理问题
  determine2: function () {

  },
  go: function () {
    this.setData({
      showModal: false,
      showModa2: false
    })
  },
  // 页面加载
  onLoad: function (options) {
    var that = this
    this.data.problemType = options.type;
    that.fetchSearchList();
    // console.log(options.type)
    that.setData({
      searchLoading: false,
    });
  }
})

var htmlToStr = require('../../utils/htmltostr.js');