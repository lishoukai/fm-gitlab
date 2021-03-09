/* eslint-disable no-bitwise */
/* eslint-disable radix */
import { MessageBox, Notification, Message } from 'element-ui';

/**
 * 防抖 在事件被触发一定事件后再执行回调，如果在这段事件内又被触发，则重新计时
 * 使用场景：
 * 1、搜索框中，用户在不断输入值时，用防抖来节约请求资源
 * 2、window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次
 * @param fn 回调
 * @param delay 时间间隔的阈值(单位：ms) 默认500ms
 */
export function debounce(fn: Function, delay = 500) {
  let timer: number;
  // eslint-disable-next-line func-names
  return function (this: void, ...args: any) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流 规定在一段时间内，只能触发一次函数。如果这段时间内触发多次函数，只有一次生效
 * 使用场景：
 * 1、鼠标不断点击触发，mousedown(单位时间内只触发一次)
 * 2、监听滚动事件，比如是否滑到底部自动加载更多
 * @param fn 回调
 * @param delay 时间间隔的阈值(单位：ms) 默认500ms
 * @this throttle
 */
export function throttle(fn: Function, delay = 500) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0;
  let timer: any = null;
  // 将throttle处理结果当作函数返回
  // eslint-disable-next-line func-names
  return function (this: void) {
    // 保留调用时的this上下文
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    // 保留调用时传入的参数
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // 记录本次触发回调的时间
    const now = +new Date();

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, delay);
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now;
      fn.apply(context, args);
    }
  };
}

/**
 * 判断是移动端还是 pc 端 ，true 表示是移动端，false 表示是 pc 端
 */
export function isMobileOrPc() {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

// 提示信息类型
enum MessageType {
  success = 'success',
  error = 'error',
  warning = 'warning'
}

/**
 * 中间提示信息
 * @param type 类型
 * @param info 提示内容
 */
export function MessagePop(type: MessageType, info: string) {
  switch (type) {
    case 'success':
      Message.success(info);
      break;
    case 'error':
      Message.error(info);
      break;
    case 'warning':
      Message.warning(info);
      break;
    default:
      Message.success(info);
      break;
  }
}

/**
 * 需确认弹框
 * @param message  弹框信息
 */
export function confirmPop(message: string, type: 'warning') {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type,
      // center: true,
      customClass: 'custom-message-box',
    })
      .then(() => {
        resolve('confirm');
      })
      .catch((error: string) => {
        reject(error);
      });
  });
}

/**
 * 消息弹框
 * @param message  弹框信息
 * @param type 消息类型
 */
export function messagePop(message: string, type: 'info') {
  MessageBox({
    type,
    message,
    showClose: true,
    customClass: 'custom-message-box',
  });
}

/**
 * 带输入的弹框
 * @param message  弹框信息
 * @param title 标题
 * @param inputValue  输入框的初始文本
 * @param inputPattern  输入框的校验表达式
 * @param inputErrorMessage 校验未通过时的提示文本
 */
export function promptPop(params: any) {
  return new Promise((resolve, reject) => {
    MessageBox.prompt(params.message, params.title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: params.inputPattern,
      inputValue: params.inputValue,
      inputErrorMessage: params.inputErrorMessage,
      customClass: 'custom-message-box',
      // center: true,
    })
      .then((value) => {
        resolve(value);
      })
      .catch((error: string) => {
        reject(error);
      });
  });
}

/**
 * 通知消息
 * @param message  通知信息
 * @param type 消息类型
 */
export function noticePop(message: string, type: 'info') {
  Notification({
    title: '',
    message,
    type,
  });
}

/**
 * 判断屏幕的尺寸（xs:"< 768px" sm:"≥768px" md:"≥992px" lg:"≥1200px" xl:"≥1920px"）
 */
export function judgeScreenSizeType() {
  const screenWidth = window.screen.availWidth;
  if (screenWidth < 768) {
    return 'xs';
  }
  if (screenWidth >= 768 && screenWidth < 992) {
    return 'sm';
  }
  if (screenWidth >= 992 && screenWidth < 1200) {
    return 'md';
  }
  if (screenWidth >= 1200 && screenWidth < 1920) {
    return 'lg';
  }
  return 'xl';
}

/**
 * 十六进制颜色转换rgb
 * @param color  十六进制颜色
 */
export function colorRgb(color: string) {
  let sColor = color.toLowerCase();
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    // 处理六位的颜色值
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      // eslint-disable-next-line radix
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
    }
    return sColorChange.join(',');
  }
  return sColor;
}

/**
 * rgb转换十六进制颜色
 * @param color  rgb进制颜色
 */
export function colorRgbToHex(color: string) {
  const rgb = color.split(',');
  const r = parseInt(rgb[0].split('(')[1]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2].split(')')[0]);
  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
  return hex;
}
