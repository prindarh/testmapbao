// import transpage from '../../../pages/transTemp/transpage'
const isLogOpen = true

export function consoleLog(title, msg) {
  if (!title) {
    title = '输出日志'
  }
  console.log(title, msg)
}

export function checkReg(format, value) {
  let isPass = true
  let reg = new RegExp(format)
  isPass = reg.test(value)
  return isPass
}

export function checkFileType(fileName) {
  let isPass = false
  let typeArr = ['.gz', '.zip', '.doc', '.docx', '.xls', '.xlsx', '.log', '.txt', '.pdf', '.xml', '.md']
  let tempName = fileName.toLowerCase()
  for (let item of typeArr) {
    if (tempName.lastIndexOf(item) > -1) {
      isPass = true
      break
    }
  }
  return isPass
}

export function checkBigFileType(fileName) {
  let isPass = true
  let typeArr = ['.doc', '.docx']
  let tempName = fileName.toLowerCase()
  for (let item of typeArr) {
    if (tempName.lastIndexOf(item) > -1) {
      isPass = false
      break
    }
  }
  return isPass
}


//汉字
export const reg_chinese = '^[\\u4e00-\\u9fa5]$'
//电话号码
export const reg_telnum = '^1[3|4|5|8][0-9]{9}$'
//整数
export const reg_num = '^[0-9]\\d*$'
//大于0的整数
export const reg_pnum = '^[1-9]\\d*$'
//邮编
export const reg_post = '^[1-9][0-9]{5}$'
//网址
export const reg_net = '^(www.[A-Za-z0-9]{1,15})(.com|.cn)*$'
//QQ号
export const reg_qq = '^[1-9][0-9]{4,}$'
//邮箱
export const reg_email = '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$'

export const uPattern = /^[a-zA-Z0-9_-]{4,16}$/

//数字，字母
// export const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8}$/;
//数字，字母，    特殊字符
export const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,16}$/

export const reg_yearmonth = '^[1-9][0-9]{3}[0][1-9]|[1-9][0-9]{3}[1][0-2]$'

// 字符串格式 20200101
export function formatTimeCode(timeCode) {
  if (!timeCode) {
    return '';
  }
  let formatTime = timeCode.slice(0, 4) + '-' + timeCode.slice(4, 6) + '-' + timeCode.slice(6);
  return formatTime;
}

export function formatTime(time, flag) {
  if (!time || time.length == 0) {
    return ''
  }
  var now = new Date(time)
  var year = now.getFullYear()
  var month = now.getMonth() + 1 < 10 ?
    '0' + (now.getMonth() + 1) :
    now.getMonth() + 1
  var date = now.getDate() < 10 ?
    '0' + now.getDate() :
    now.getDate()
  var hour = now.getHours() < 10 ?
    '0' + now.getHours() :
    now.getHours()
  var minute = now.getMinutes() < 10 ?
    '0' + now.getMinutes() :
    now.getMinutes()
  var second = now.getSeconds() < 10 ?
    '0' + now.getSeconds() :
    now.getSeconds()
  if (flag) {
    return year + '-' + month + '-' + date
  }
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

export function formatDateNoSign(datevalue) {
  if (datevalue == null || datevalue.length == 0) {
    return ''
  }
  let y = datevalue.getFullYear()
  let m = datevalue.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = datevalue.getDate()
  d = d < 10 ? ('0' + d) : d
  return y.toString() + m + d
}

export function formatDateNoSignYM(datevalue) {
  if (datevalue == null || datevalue.length == 0) {
    return ''
  }
  let y = datevalue.getFullYear()
  let m = datevalue.getMonth() + 1
  m = m < 10 ? '0' + m : m
  return y.toString() + m
}

//获取全部菜单对象
export function getAuthObj() {
  let allAuthArr = [{
      index: 0,
      name: '首页',
      isShow: false,
      pid: 0,
      routePath: ['/mainchart']
    },
    {
      index: 1,
      name: '数据分发',
      isShow: false,
      pid: 0,
      routePath: ['/dataissue', '/issuedetail', '/issueview', '/flowchart']
    },
    {
      index: 2,
      name: '数据下载',
      isShow: false,
      pid: 0,
      routePath: ['/datadownload']
    },
    {
      index: 3,
      name: '数据日志',
      isShow: false,
      pid: 0,
      routePath: ['/datalog']
    },
    {
      index: 4,
      name: '事项管理',
      isShow: false,
      pid: 0
      // routePath:['/businessaudit','/businessaudititem','/businessauditcyclic','/businessaudit','/businessaudititem','/businessauditcyclic','/safetyaudit','/safetyaudititem','/safetyauditcyclic','/validityaudit','/serverconfig','/serverconfigdetails','/spotcheck','/spotdetails'],
    },
    {
      index: 5,
      name: '业务审核',
      isShow: false,
      pid: 4,
      routePath: ['/businessaudit', '/businessaudititem', '/businessauditcyclic']
    },
    {
      index: 6,
      name: '安全审核',
      isShow: false,
      pid: 4,
      routePath: ['/safetyaudit', '/safetyaudititem', '/safetyauditcyclic', '/validityaudit']
    },
    {
      index: 7,
      name: '服务配置',
      isShow: false,
      pid: 4,
      routePath: ['/serverconfig', '/serverconfigdetails']
    },
    {
      index: 8,
      name: '事后抽检',
      isShow: false,
      pid: 4,
      routePath: ['/spotcheck', '/spotdetails']
    },
    {
      index: 9,
      name: '系统管理',
      isShow: false,
      pid: 0
      // routePath:['/deptmanage','/institution','/rolemanage','/roledetail','/usermanage','/userdetail','/safeconfig','/emailconfig','/bulletinconfig'],
    },
    {
      index: 10,
      name: '机构管理',
      isShow: false,
      pid: 9,
      routePath: ['/deptmanage', '/institution']
    },
    {
      index: 11,
      name: '角色管理',
      isShow: false,
      pid: 9,
      routePath: ['/rolemanage', '/roledetail']
    },
    {
      index: 12,
      name: '用户管理',
      isShow: false,
      pid: 9,
      routePath: ['/usermanage', '/userdetail']
    },
    {
      index: 13,
      name: '安全设置',
      isShow: false,
      pid: 9,
      routePath: ['/safeconfig']
    },
    {
      index: 14,
      name: '邮箱设置',
      isShow: false,
      pid: 9,
      routePath: ['/emailconfig']
    },
    {
      index: 15,
      name: '上报设置',
      isShow: false,
      pid: 9,
      routePath: ['/bulletinconfig']
    },
    {
      index: 16,
      name: '审计管理',
      isShow: false,
      pid: 0
      // routePath:['/sysreport','/sysreportdetail','/loginlog','/operationlog'],
    },
    {
      index: 17,
      name: '系统报告',
      isShow: false,
      pid: 16,
      routePath: ['/sysreport', '/sysreportdetail']
    },
    {
      index: 18,
      name: '登录日志',
      isShow: false,
      pid: 16,
      routePath: ['/loginlog']
    },
    {
      index: 19,
      name: '操作日志',
      isShow: false,
      pid: 16,
      routePath: ['/operationlog']
    }
  ]
  return allAuthArr
}

export function setSysAuth() {
  let allAuthArr = getAuthObj()
  let tempArr = []
  for (let item of allAuthArr) {
    tempArr.push(item.name)
  }
  return tempArr
}

//判断左侧菜单权限
export function getAuthList(authArr) {
  let allAuthArr = getAuthObj()
  for (let item of allAuthArr) {
    for (let auth of authArr) {
      if (auth == item.name) {
        item.isShow = true
        if (item.pid > 0) {
          allAuthArr[item.pid].isShow = true
        }
      }
    }
  }
  return allAuthArr
}

export function getFirstPath(modName) {
  let allAuthArr = getAuthObj()
  let id = ''
  for (let item of allAuthArr) {
    if (item.name == modName) {
      if (item.pid == 0) {
        id = item.index
        break
      }
    }
  }
  if (id) {
    for (let item of allAuthArr) {
      if (item.pid == id) {
        return item.routePath[0]
      }
    }
  }
  for (let item of allAuthArr) {
    if (item.name == modName) {
      if (item.routePath && item.routePath.length > 0) {
        return item.routePath[0]
      }
    }
  }
  return ''
}

//返回空跳转到login, path跳转到前一个路径
export function errPageGoBack() {
  let authCode = localStorage.getItem('authCode')
  if (!authCode || authCode.length == 0) {
    return ''
  }
  let authCodeArr = JSON.parse(authCode)
  if (!authCodeArr || authCodeArr.length == 0) {
    return ''
  }
  let path = getFirstPath(authCodeArr[0])
  if (!path || path.length == 0) {
    return ''
  }
  return path
  // this.$router.replace({path: path});
}


/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 */
export function randomWord(randomFlag, min, max) {
  // eslint-disable-next-line one-var
  let str = '',
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

/**
 * 产生随机数
 * @param {随机个数} range
 * @param {最小值} min
 * @param {最大值} max
 */
export function randomNum(range, min, max) {
  let randomList = [];
  for (let i = 0; i < range; i++) {
    let x = Math.floor(Math.random() * (max - min + 1)) + min;
    randomList.push(x);
  }
  return randomList
}

/**
 * 获取2个日期之间的每个日期
 * @param {开始日期} startDate 
 * @param {结束日期} endDate
 */
export function getDateBetweenTwoDay(startDate, endDate) {
  //初始化日期列表，数组
  let diffdate = new Array();
  let i = 0;
  //开始日期小于等于结束日期,并循环
  while (startDate <= endDate) {
    diffdate[i] = startDate;
    //获取开始日期时间戳
    let stime_ts = new Date(startDate).getTime();
    // console.log('当前日期：' + startDate + '当前时间戳：' + stime_ts);
    //增加一天时间戳后的日期
    let next_date = stime_ts + (24 * 60 * 60 * 1000);
    //拼接年月日，这里的月份会返回（0-11），所以要+1
    let next_dates_y = new Date(next_date).getFullYear() + '-';
    let next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' +
      (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-';
    let next_dates_d = (new Date(next_date).getDate() < 10) ? '0' +
      new Date(next_date).getDate() : new Date(next_date).getDate();
    startDate = next_dates_y + next_dates_m + next_dates_d;
    //增加数组key
    i++;
  }
  //   console.log(diffdate);
  return diffdate;
}

/**
 * 根据今天获取之前或者之后的日期
 * @param {天数带正负，负代表之前，正代表之后} dayCount 
 */
export function getDatePreOrAfter(dayCount) {
  let dd = new Date();
  dd.setDate(dd.getDate() + dayCount); //获取p_count天后的日期
  let y = dd.getFullYear();
  let m = dd.getMonth() + 1; //获取当前月份的日期
  if (m < 10) {
    m = '0' + m;
  }
  let d = dd.getDate();
  if (d < 10) {
    d = '0' + d;
  }
  return y + "-" + m + "-" + d;
}

/**
 * 文件大小转换（保留两位小数）
 * @param {number} bytes 字节数
 * return {string} 转换后的文件大小(带单位)
 */
export function bytesToSize(bytes) {
  if (bytes == 0) return '0 B'
  // eslint-disable-next-line one-var
  let k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  let value = (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
  console.log(i)
  return value
}



/**
 * 文件大小转换（保留两位小数）
 * @param {number} bytes 字节数
 * return {obj} 转换后的文件大小对象{value：大小,unit:单位}
 */
export function bytesToSizeObj(bytes) {
  if (bytes == 0) return '0 B'
  // eslint-disable-next-line one-var
  let k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  let sizeObj = {
    value: 0,
    unit: ''
  }
  sizeObj.value = (bytes / Math.pow(k, i)).toFixed(2)
  sizeObj.unit = sizes[i]
  // console.log(value)
  return sizeObj
}


// 退出登录以后
export function afterLoginOut() {
  sessionStorage.removeItem('loginkey')
  localStorage.removeItem('realName')
  localStorage.removeItem('deptId')
  localStorage.removeItem('authCode')
  sessionStorage.removeItem('userKey')
  sessionStorage.removeItem('userId')
  localStorage.removeItem('loginentry')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('oldVal')
  sessionStorage.removeItem('breadCode')
  sessionStorage.removeItem('curtranspath')
  sessionStorage.removeItem('transpathcode')
  sessionStorage.removeItem('transpath')
  sessionStorage.removeItem('taskList')
  sessionStorage.removeItem('firstpage')
  sessionStorage.removeItem('Authorization')
  sessionStorage.removeItem('tasksb')
  sessionStorage.removeItem('transkey')
  sessionStorage.removeItem('promData')
  sessionStorage.removeItem('repData')
}
//判断浏览器
export function getBrowserType() {
  let userAgent = navigator.userAgent
  if (userAgent.indexOf('Trident') > -1) {
    return 'IE'
  } else if (userAgent.indexOf('Presto') > -1) // opera内核
  {
    return 'opera'
  } else if (userAgent.indexOf('AppleWebKit') > -1) //苹果、谷歌内核)
  {
    return 'webKit'
  }
  return 'Other'
}

/**
 * 请求接口返回文件流下载文件（小文件）
 * @param data
 * @param filename
 */
export function downloadFile(data, filename) {
  if (!data) {
    return
  }
  let b_type = getBrowserType()
  if (b_type == 'IE') {
    window.navigator.msSaveBlob(new Blob([data]), filename)
  } else {
    let url = window.URL.createObjectURL(new Blob([data]))
    // console.log(url)
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
  }
}

/**
 *请求接口下载文件，地址为接口地址（下载大文件时用）
 * @param url
 * @param filename
 */
export function downloadFileForUrl(url, filename) {
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
}

/**
 * 倒计时方法
 * @param {number} times 循环次数
 * @param {number} step 间隔毫秒数
 * @param {Function} callback(time, isEnd) 回掉函数
 */
export function CountDown(times = 60, step = 1000, callback) {
  callback(times, false)
  window._countDownTimmer = setInterval(() => {
    times--
    if (times === 0) {
      clearInterval(window._countDownTimmer)
      callback(times, true)
    } else {
      callback(times, false)
    }
  }, step)
  this.cancel = function (callback) {
    clearInterval(window._countDownTimmer)
    callback(0, true)
  }
}

var sizes = [
  'Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB'
]

/**
Pretty print a size from bytes
@method pretty
@param {Number} size The number to pretty print
@param {Boolean} [nospace=false] Don't print a space
@param {Boolean} [one=false] Only print one character
@param {Number} [places=1] Number of decimal places to return
@param {Boolen} [numOnly] Return only the converted number and not size string
*/

export function prettysize(size, nospace, one, places, numOnly) {
  if (typeof nospace === 'object') {
    var opts = nospace
    nospace = opts.nospace
    one = opts.one
    places = opts.places || 1
    numOnly = opts.numOnly
  } else {
    places = places || 1
  }

  var mysize

  for (var id = 0; id < sizes.length; ++id) {
    var unit = sizes[id]

    if (one) {
      unit = unit.slice(0, 1)
    }

    var s = Math.pow(1024, id)
    var fixed
    if (size >= s) {
      fixed = String((size / s).toFixed(places))
      if (fixed.indexOf('.0') === fixed.length - 2) {
        fixed = fixed.slice(0, -2)
      }
      mysize = fixed + (nospace ? '' : ' ') + unit
    }
  }

  // zero handling
  // always prints in Bytes
  if (!mysize) {
    var _unit = (one ? sizes[0].slice(0, 1) : sizes[0])
    mysize = '0' + (nospace ? '' : ' ') + _unit
  }

  if (numOnly) {
    mysize = Number.parseFloat(mysize)
  }

  return mysize
};


/**
 * 检验密码（至少包含数字、字母、特殊字符）
 * @param pwd
 */
export function checkPwd(pwd) {
  let isPass = checkReg(passwordReg, pwd)
  return isPass
}

/**
 * 获取当前页面名称(从session里面获取)
 */
export function getCurrentPageName() {
  let breadCode = sessionStorage.getItem('breadCode');
  if (!breadCode) {
    return '';
  }
  let breadArr = JSON.parse(breadCode);
  let breadLength = breadArr.length;
  let currName = breadArr[breadLength - 1];
  return currName;
}

/**
 * 获取图表数据配色
 * @param {颜色类型1-对比方案,2-冷色调,3-暖色调} colorType 
 * @param {数据条数,支持不超过7条} dataCount 
 */
export function getChartColorList(colorType, dataCount) {
  if (dataCount < 4) {
    dataCount = 3;
  }
  let switchKey = colorType + '-' + dataCount
  let colorList = [];
  switch (switchKey) {
    case '1-3':
      colorList = ['#60acfc', '#5bc49f', '#feb64d'];
      break;
    case '1-4':
      colorList = ['#60acfc', '#5bc49f', '#feb64d', '#fa816d'];
      break;
    case '1-5':
      colorList = ['#60acfc', '#5bc49f', '#d4ec59', '#feb64d', '#fa816d'];
      break;
    case '1-6':
      colorList = ['#60acfc', '#23c2db', '#63d5b2', '#d4ec59', '#feb64d', '#fa816d'];
      break;
    case '1-7':
      colorList = ['#60acfc', '#23c2db', '#63d5b2', '#d4ec59', '#feb64d', '#fa816d', '#d15b7f'];
      break;
    case '2-3':
      colorList = ['#60acfc', '#32d3eb', '#afe39b'];
      break;
    case '2-4':
      colorList = ['#60acfc', '#23c2db', '#66d7d2', '#afe39b'];
      break;
    case '2-5':
      colorList = ['#60acfc', '#23c2db', '#63d5b2', '#9cdc82', '#d4ec59'];
      break;
    case '2-6':
      colorList = ['#60acfc', '#23c2db', '#32d3eb', '#9cdc82', '#d4ec59', '#ffe168'];
      break;
    case '2-7':
      colorList = ['#668ed6', '#60acfc', '#23c2db', '#32d3eb', '#9cdc82', '#d4ec59', '#ffe168'];
      break;
    case '3-3':
      colorList = ['#7079df', '#fb6e6c', '#feb64d'];
      break;
    case '3-4':
      colorList = ['#7079df', '#d15b7f', '#fb6e6c', '#feb64d'];
      break;
    case '3-5':
      colorList = ['#7079df', '#d15b7f', '#fb6e6c', '#feb64d', '#ffda43'];
      break;
    case '3-6':
      colorList = ['#7079df', '#d15b7f', '#fb6e6c', '#ff9f69', '#feb64d', '#ffe168'];
      break;
    case '3-7':
      colorList = ['#7079df', '#d15b7f', '#fb6e6c', '#ff9f69', '#feb64d', '#ffda43', '#ffe88e'];
      break;
    default:
      break;
  }
  return colorList;
}

/**
 * 四舍五入
 * @param {*} num -数据
 * @param {*} digits -保留小数位数
 * @returns 
 */
export function numRound(num,digits){
  let tempNum = Math.round((num + Number.EPSILON) * 10000) / 10000;
	let resNum = tempNum.toFixed(digits);
  return resNum
}

//深拷贝
export function deepCopy(obj) {
  if (!obj) {
    return {};
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  //判断对象是否是数组
  if ((Object.prototype.toString.call(obj)) === '[object Array]') {
    let tempArr = [];
    for (let item of obj) {
      let tempValue = deepCopy(item);
      tempArr.push(tempValue);
    }
    return tempArr;
  } else {
    let tempObj = {};
    for (let prop in obj) {
      tempObj[prop] = deepCopy(obj[prop]);
    }
    return tempObj;
  }
}

//深拷贝
export function getPropAndVal(obj, propName) {
  if (!obj) {
    return {};
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  //判断对象是否是数组
  if ((Object.prototype.toString.call(obj)) === '[object Array]') {
    let tempArr = [];
    for (let item of obj) {
      let tempValue = deepCopy(item);
      tempArr.push(tempValue);
    }
    return tempArr;
  } else {
    let tempObj = {};
    for (let prop in obj) {
      tempObj[prop] = deepCopy(obj[prop]);
    }
    return tempObj;
  }
}