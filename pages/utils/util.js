const app = getApp()

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

function getProblem(problemType, searchPageNum, callbackcount, searchKeyword, operation_type, teacherAccount, callback) {
  console.log('输入时:' + searchKeyword);
  var urlStr = '';
  if (operation_type == 'unprocess') {
    urlStr = app.globalData.url + 'processTeacher/getUnprocess'
  } else if (operation_type == 'toTeacher') {
    urlStr = app.globalData.url + 'processTeacher/getToTeacher'
  } else if (operation_type == 'unConfirm') {
    urlStr = app.globalData.url + 'processTeacher/getUnConfirm'
  } else if (operation_type == 'alreadyProcess'){
    urlStr = app.globalData.url + 'messenger/getAlreadyProcess'
  }
  if (problemType == 'richangjiaoxue') {
    problemType = '日常教学问题'
  } else if (problemType == 'shebei') {
    problemType = '设备问题'
  } else if (problemType == 'xuqiu') {
    problemType = '需求和建议'
  }
  console.log('账号是:' + teacherAccount)
  wx.request({
    url: urlStr,
    data: {
      problemType: problemType,  //返回数据的个数
      pageIndex: searchPageNum,
      nums: callbackcount,
      searchWord: searchKeyword,
      processTeacherAccount: teacherAccount
    },
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}

function getSearchMusic(problemType, searchPageNum, callbackcount, searchKeyword, operation_type, callback) {
  console.log('输入时:' + searchKeyword);
  var urlStr = '';
  if (operation_type == 'unassign') {
    urlStr = app.globalData.url + 'charge/getOrderNum'
  } else if (operation_type == 'unconfirm') {
    urlStr = app.globalData.url + 'charge/getOrderNumUnconfirm'
  } else if (operation_type == 'unprocess') {
    urlStr = app.globalData.url + 'processTeacher/getUnprocess'
  } else if (operation_type == 'unagreeToLeader') {
    urlStr = app.globalData.url + 'leader/getUnagree'
  }
  if (problemType == 'richangjiaoxue') {
    problemType = '日常教学问题'
  } else if (problemType == 'shebei') {
    problemType = '设备问题'
  } else if (problemType == 'xuqiu') {
    problemType = '需求和建议'
  }
  wx.request({
    url: urlStr,
    data: {
      problemType: problemType,  //返回数据的个数
      pageIndex: searchPageNum,
      nums: callbackcount,
      searchWord: searchKeyword
    },
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}

function conversionTime(dataTime) {
  return new Date(dataTime).toLocaleDateString().replace(/\//g, "-") +
    " " + new Date(dataTime).toTimeString().substr(0, 8)
}

module.exports = {
  getSearchMusic: getSearchMusic,
  getProblem: getProblem,
  conversionTime: conversionTime
}
