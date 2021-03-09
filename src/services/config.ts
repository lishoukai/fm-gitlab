// 正式环境接口地址
export const HOST = 'https://ths.com.cn/';
// 测试环境接口地址
// export const HOST = 'http://182.48.115.108:8887/';
// 文件上传和下载时的地址
export const uploadUrl = `${HOST}fileManager/file-manage/uploadFilesToPath?srcPath=`;
export const downLoadUrl = `${HOST}fileManager/file-manage/downLoadFile?srcPath=`;
export const api = {
  login: 'auth/login',
  getFilesByDir: 'file-manage/getFilesByDir', // 按路径获取文件夹
  createFileDir: 'file-manage/createFileDir', // 创建文件夹
  removeFileOrDir: 'file-manage/removeFileOrDir', // 删除文件
  uploadFilesToPath: 'file-manage/uploadFilesToPath', // 上传文件
  copyFileOrDir: 'file-manage/copyFileOrDir', // 复制文件
  moveFileOrDir: 'file-manage/moveFileOrDir', // 移动文件
  renameFileOrDir: 'file-manage/renameFileOrDir', // 重命名文件
  checkFileExists: 'file-manage/checkFileExists', // 检查文件是否存在
  getLogs: 'logs/getLogs', // 日志文件
  readFileContent: 'file-manage/readFileContent', // 读取文件内容
  writeFileContent: 'file-manage/writeFileContent', // 保存文件内容
};
// 正式环境下基础路径
export const baseUrl = '/ths-fm/';
// 测试环境下基础路径
// export const baseUrl = '/ths-dev/';

export const user = {
  token: '',
};
