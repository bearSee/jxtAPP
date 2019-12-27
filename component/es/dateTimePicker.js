function claerDate(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(claerDate(i));
  }
  return array;
}
function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}
function getNowDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = claerDate(newDate.getFullYear()),
    mont = claerDate(newDate.getMonth() + 1),
    date = claerDate(newDate.getDate()),
    hour = claerDate(newDate.getHours()),
    minu = claerDate(newDate.getMinutes()),
    seco = claerDate(newDate.getSeconds());

  return [year, mont, date, hour, minu, seco];
}
function getTimeData(startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  var indexList = [], dataList = [[], [], [], [], [], []];
  var start = startYear || 2000;
  var end = endYear || 2100;
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNowDateArry();
  // 处理联动列表数据
  /*年月日 时分秒*/
  dataList[0] = getLoopArray(start, end);
  dataList[1] = getLoopArray(1, 12);
  dataList[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dataList[3] = getLoopArray(0, 23);
  dataList[4] = getLoopArray(0, 59);
  dataList[5] = getLoopArray(0, 59);

  dataList.forEach((current, index) => {
    indexList.push(current.indexOf(defaultDate[index]));
  });

  return { dataList, indexList };
}
// 年月日时分的数组dataArr：[] 转为2019-10-11 10:25
function getDateStr(dataArr) {
  var y = claerDate(dataArr[0])
  var m = claerDate(dataArr[1] + 1)
  var d = claerDate(dataArr[2] + 1)
  var hour = claerDate(dataArr[3])
  var min = claerDate(dataArr[4])
  return `20${y}-${m}-${d} ${hour}:${min}`
}
// dateStr：2019-10-11 10:25转为年月日时分的数组
function getDateArr(dateStr) {
  const reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d$/;
  const regExp = new RegExp(reg);
  let arr = getNowDateArry();
  if (regExp.test(dateStr)) {
    if (dateStr.length > 16) {
      arr = [parseInt(dateStr.substring(2, 4)), parseInt(dateStr.substring(5, 7)) - 1, parseInt(dateStr.substring(8, 10)) - 1, parseInt(dateStr.substring(11, 13)), parseInt(dateStr.substring(14, 16)), parseInt(dateStr.substring(17))];
    } else {
      arr = [parseInt(dateStr.substring(2, 4)), parseInt(dateStr.substring(5, 7)) - 1, parseInt(dateStr.substring(8, 10)) - 1, parseInt(dateStr.substring(11, 13)), parseInt(dateStr.substring(14, 16))];
    }
  }
  return arr;
}
module.exports = {
  getTimeData,
  getDateArr,
  getDateStr,
}