import request from '@/utils/request';
import { api } from './config';

export function login(userName: string, pwd: string) {
  return request.post(api.login, { userName, pwd });
}
export function logout(token: string) {
  return request.get(api.login, { params: { token } });
}
export function allFiles(params: { srcPath: string }) {
  return request.get(api.getFilesByDir, { params });
}
export function createFiles(srcPath: string) {
  return request.post(api.createFileDir, { srcPath });
}
export function deletedFiles(srcPath: string) {
  return request.post(api.removeFileOrDir, { srcPath });
}
export function uploadFilesToPath(formData: any) {
  return request.post(api.uploadFilesToPath, { formData });
}
export function copyFileOrDir(srcPath: string, destPath: string) {
  return request.post(api.copyFileOrDir, { srcPath, destPath });
}
export function moveFileOrDir(srcPath: string, destPath: string) {
  return request.post(api.moveFileOrDir, { srcPath, destPath });
}
export function renameFileOrDir(srcPath: string, destPath: string) {
  return request.post(api.renameFileOrDir, { srcPath, destPath });
}
export function checkFileExists(srcPath: string) {
  return request.get(api.checkFileExists, { params: { srcPath } });
}
export function getLogs(pageIndex: number, pageSize: number, userName: string, requestUrl: string, startTime: string, endTime: string) {
  const startTimeNew = startTime === '' || startTime === null ? new Date('2020-01-01 00:00:00') : startTime;
  const endTimeNew = endTime === '' || endTime === null ? new Date() : endTime;
  return request.get(api.getLogs, {
    params: {
      pageIndex,
      pageSize,
      userName,
      requestUrl,
      startTime: startTimeNew,
      endTime: endTimeNew,
    },
  });
}
// 读取文件内容
export function readFileContent(srcPath: string) {
  return request.post(api.readFileContent, { srcPath });
}
// 保存文件内容
export function writeFileContent(srcPath: string, content: string) {
  return request.post(api.writeFileContent, { srcPath, content });
}
