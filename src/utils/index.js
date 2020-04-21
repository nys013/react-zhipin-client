/* 
    包含多个工具函数的模块
*/

// 返回正确的重定向路径的工具函数
export function getRedirectPath(type,header){
    let path = type === 'boss' ? '/boss' : '/dashen'
    if (!header) {
        path += 'info'
    }
    return path
}