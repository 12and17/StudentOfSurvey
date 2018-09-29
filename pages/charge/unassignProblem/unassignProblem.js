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
    rejectReason: '',
    selectWord: '',
    max: 40, //最多字数 (根据自己需求改变) 
    items: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' }
    ],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏
  },
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    console.log(value);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
    this.data.rejectReason = value;
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.data.teacherAccount = e.detail.value
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
    console.log('页数' + searchPageNum + problemType)
    //访问网络
    util.getSearchMusic(problemType, searchPageNum, callbackcount, searchKeyword, 'unassign', function (data) {
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
    // var index_text = e.currentTarget.dataset.id;
    var that = this;
    this.data.problemId = e.currentTarget.dataset.id;
    // console.log('序列是:' + this.data.teacherAccount);
    var urlStr = app.globalData.url + 'charge/getAllTeacher';
    var process_type = '';
    if (this.data.problemType == 'richangjiaoxue') {
      process_type = '日常教学问题'
    } else if (this.data.problemType == 'shebei') {
      process_type = '设备问题'
    } else if (this.data.problemType == 'xuqiu') {
      process_type = '需求和建议'
    }
    wx.request({
      dataType: "json",
      method: "GET",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        problemType: process_type,
        // teacherAccount: this.data.teacherAccount
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (res) {
        // app.globalData.myInfo = res.data.data;
        // console.log(app.globalData.myInfo);
        // app.globalData.adminUserViewId = res.data.employees1;
        if (res.data.success == true) {
          that.data.items = res.data.data;
          that.setData({
            items: res.data.data,
            showModal: true,
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
  //确定1,分配教师
  determine: function () {
    var that = this;
    if (this.data.items.length == 0){
      that.setData({
        loadingHidden: true,
        popErrorMsg: '无教师，无法分配处理'
      })
      setTimeout(function () {
        that.setData({
          popErrorMsg: ''
        })
      }, 2000)
      return
    }
    if (this.data.teacherAccount == '') {
      // console.log("进入1")
      console.log("长度是" + this.data.items.length)
      for (var i = 0; i < this.data.items.length; i++) {
        if (this.data.items[i].imformation == 'true') {
          this.data.teacherAccount = this.data.items[i].processTeacherAccount;
          console.log("进入2")
        }
      }
    }
    var urlStr = app.globalData.url + 'charge/assignTeacher';
    wx.request({
      dataType: "json",
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        problemId: this.data.problemId,
        teacherAccount: this.data.teacherAccount
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (res) {
        // app.globalData.myInfo = res.data.data;
        // console.log(app.globalData.myInfo);
        // app.globalData.adminUserViewId = res.data.employees1;
        if (res.data.success == true) {
          that.setData({
            showModal: false,
            searchSongList: [], //获取数据数组
            searchLoading: true   //把"上拉加载"的变量设为false，显示
          })
          wx.showToast({
            title: '分配成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            searchPageNum: 1,
          });
          app.globalData.myInfo.count_num.unassignTeacherNum = app.globalData.myInfo.count_num.unassignTeacherNum - 1;
          if (that.data.problemType === 'richangjiaoxue') {
            app.globalData.myInfo.count_num.unassignOfTeachNum = app.globalData.myInfo.count_num.unassignOfTeachNum - 1
          } else if (that.data.problemType === 'shebei') {
            app.globalData.myInfo.count_num.unassignOfEquipmentNum = app.globalData.myInfo.count_num.unassignOfEquipmentNum - 1
          } else if (that.data.problemType === 'xuqiu') {
            app.globalData.myInfo.count_num.unassignOfDemandNum = app.globalData.myInfo.count_num.unassignOfDemandNum - 1
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
  submit2: function (e) {
    this.setData({
      showModa2: true,
      problemId: e.currentTarget.dataset.id
    })
  },
  //确定2,驳回问题
  determine2: function () {
    var that = this;
    console.log(this.data.rejectReason + "," + this.data.problemId);
    var urlStr = app.globalData.url + 'charge/reject';
    wx.request({
      dataType: "json",
      method: "POST",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        problemId: this.data.problemId,
        rejectReason: this.data.rejectReason
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;charset=utf-8"
      },
      success: function (res) {
        // app.globalData.myInfo = res.data.data;
        // console.log(app.globalData.myInfo);
        // app.globalData.adminUserViewId = res.data.employees1;
        if (res.data.success == true) {
          that.setData({
            showModa2: false,
            searchSongList: [], //获取数据数组
            searchLoading: true   //把"上拉加载"的变量设为false，显示
          })
          wx.showToast({
            title: '驳回成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            searchPageNum: 1,
          });
          app.globalData.myInfo.count_num.unassignTeacherNum = app.globalData.myInfo.count_num.unassignTeacherNum - 1;
          if (that.data.problemType === 'richangjiaoxue') {
            app.globalData.myInfo.count_num.unassignOfTeachNum = app.globalData.myInfo.count_num.unassignOfTeachNum - 1
          } else if (that.data.problemType === 'shebei') {
            app.globalData.myInfo.count_num.unassignOfEquipmentNum = app.globalData.myInfo.count_num.unassignOfEquipmentNum - 1
          } else if (that.data.problemType === 'xuqiu') {
            app.globalData.myInfo.count_num.unassignOfDemandNum = app.globalData.myInfo.count_num.unassignOfDemandNum - 1
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
    console.log('问题类型是' + options.type);
    that.fetchSearchList();
    that.setData({
      searchLoading: false,
      problemType: options.type
    });
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