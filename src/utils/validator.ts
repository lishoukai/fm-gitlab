interface ValidatorStrategies {
  [key: string]: (value: string, errorMsg: string) => string | undefined;
}
/**
 * 验证策略
 */
const validatorStrategies: ValidatorStrategies = {
  // 必填
  required(value: string, errorMsg: string): string | undefined {
    return value === '' ? errorMsg || '不能为空' : undefined;
  },
  // 手机号
  mobile(value: string, errorMsg: string): string | undefined {
    // 第二位必须是大于等于3的数字
    return !/^1(3|4|5|6|7|8|9)[0-9]{9}$/.test(value) ? errorMsg || '手机号格式不正确' : undefined;
  },
  // 邮箱
  email(value: string, errorMsg: string): string | undefined {
    return !/^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) ? errorMsg || '邮件格式不正确' : undefined;
  },
  // 中文，数字或英文
  normal(value: string, errorMsg: string): string | undefined {
    return !/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value) ? errorMsg || '只能输入中文，数字或英文' : undefined;
  },
  // 整数
  integer(value: string, errorMsg: string): string | undefined {
    return !/^(-?[1-9]\d*|0)$/.test(value) ? errorMsg || '只能输入整数' : undefined;
  },
  // 中文
  chinese(value: string, errorMsg: string): string | undefined {
    return !/^[\u4e00-\u9fa5]/.test(value) ? errorMsg || '只能输入中文' : undefined;
  },
  // url
  url(value: string, errorMsg: string): string | undefined {
    return !/(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(value) ? errorMsg || 'URL格式不正确' : undefined;
  },
  // 身份证
  IDCard(value: string, errorMsg: string): string | undefined {
    return !/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(value) ? errorMsg || '身份证格式不正确' : undefined;
  },
};

/**
 * 表单验证
 * @param rule 规则
 * @param value 输入框的值
 * @param callback 回调
 */
export default function validator(rule: { required: boolean; type: string; message: string }, value: string,
  callback: (message?: string | undefined) => unknown): void {
  if (rule.required && value === '') {
    callback(validatorStrategies.required(value, rule.message));
    return;
  }
  if (Object.keys(validatorStrategies).indexOf(rule.type) >= 0) {
    callback(validatorStrategies[rule.type](value, rule.message));
  } else {
    callback();
  }
}
