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
    messengerAccount: '',
    problemId: '',
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
      searchKeyword = that.data.searchKeyword, //键盘输入的搜索词
      messengerAccount = app.globalData.myInfo.messenger_imformation.messAccount; //信息员账号
    console.log('页数' + searchPageNum + searchKeyword)
    //访问网络
    util.getProblem('', searchPageNum, callbackcount, searchKeyword, 'alreadyProcess', messengerAccount, function (data) {
      console.log(data)
      //判断是否有数据，有则取数据
      if (data.data.length != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        that.data.isFromSearch ? searchList = data.data : searchList = that.data.searchSongList.concat(data.data);
        for (var i = 0; i < searchList.length; i++) {
          searchList[i].submitTime = util.conversionTime(searchList[i].submitTime),
            searchList[i].assignmentTime = util.conversionTime(searchList[i].assignmentTime),
            searchList[i].confirmTime = util.conversionTime(searchList[i].confirmTime),
            searchList[i].processTime = util.conversionTime(searchList[i].processTime),
            searchList[i].agreeTime = util.conversionTime(searchList[i].agreeTime)
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
    var index_text = e.currentTarget.dataset.id;
    this.setData({
      img_process2: '',
      img_process3: '',
      img_process4: '',
      img_process5: '',
      img_process6: '',
    })
    console.log(index_text);
    if (this.data.searchSongList[index_text].isAssignmentTeacher == '1') {
      this.setData({
        showModal: true,
        img_process2: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/gou2.jpg',
        sumbit_time: this.data.searchSongList[index_text].submitTime,
        assignment_time: this.data.searchSongList[index_text].assignmentTime,
        process_time: this.data.searchSongList[index_text].processTime,
        confirm_time: this.data.searchSongList[index_text].confirmTime,
        agree_time: this.data.searchSongList[index_text].agreeTime,
      })
    }

    if (this.data.searchSongList[index_text].isProcess == '1') {
      this.setData({
        showModal: true,
        img_process3: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/gou2.jpg',
        img_process4: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/gou2.jpg'
      })
    }
    if (this.data.searchSongList[index_text].isConfirm == '1') {
      this.setData({
        showModal: true,
        img_process5: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/gou2.jpg'
      })
    }
    if (this.data.searchSongList[index_text].isAgree == '1') {
      this.setData({
        showModal: true,
        img_process6: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/gou2.jpg'
      })
    }
    this.setData({
      showModal: true,
      img_process1: 'https://lg-52bo0bvm-1253678560.cos.ap-shanghai.myqcloud.com/gou2.jpg'
    })
  },
  go: function () {
    this.setData({
      showModal: false
    })
  },
  // 页面加载
  onLoad: function (options) {
    var that = this
    that.fetchSearchList();
    that.setData({
      searchLoading: false,
    });
  }
})

var htmlToStr = require('../../utils/htmltostr.js');