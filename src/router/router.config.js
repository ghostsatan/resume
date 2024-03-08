/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('@/views/home/index'),
    meta: {
      title: '首页',
      keepAlive: false
    },
  },
  // {
  //   path: '/upload',
  //   component: () => import('@/views/menu/upload'),
  //   meta: {
  //     title: '简历上传',
  //     keepAlive: false
  //   },
  // },
  {
    path: '/pdf',
    component: () => import('@/views/menu/pdf'),
    meta: {
      title: '简历详情',
      keepAlive: false
    },
  }
]
