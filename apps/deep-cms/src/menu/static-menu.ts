export const staticMenu = [
  {
    path: '/home/index',
    name: 'home',
    component: '/home/index',
    meta: {
      icon: 'HomeFilled',
      title: '首页',
    },
  },
  {
    path: '/auth',
    name: 'auth',
    redirect: '/auth/menu',
    meta: {
      icon: 'Lock',
      title: '权限管理',
    },
    children: [
      {
        path: '/auth/menu',
        name: 'authMenu',
        component: '/auth/menu/index',
        meta: {
          icon: 'Menu',
          title: '菜单权限',
        },
      },
      {
        path: '/auth/button',
        name: 'authButton',
        component: '/auth/button/index',
        meta: {
          icon: 'Menu',
          title: '按钮权限',
        },
      },
    ],
  },
  {
    path: '/moment',
    name: 'moment',
    component: '/moment/index',
    meta: {
      icon: 'InfoFilled',
      title: '动态模块',
    },
    children: [
      {
        path: '/moment/list',
        name: 'momentList',
        component: '/moment/list/index',
        meta: {
          icon: 'Menu',
          title: '动态管理',
        },
      },
      {
        path: '/moment/comment',
        name: 'momentComment',
        component: '/moment/comment/index',
        meta: {
          icon: 'Menu',
          title: '评论管理',
        },
      },
    ],
  },
  {
    path: '/article/index',
    name: 'article',
    component: '/article/index',
    meta: {
      icon: 'InfoFilled',
      title: '文章模块',
    },
    children: [
      {
        path: '/article/list',
        name: 'articleList',
        component: '/article/list/index',
        meta: {
          icon: 'Menu',
          title: '文章管理',
        },
      },
      {
        path: '/article/comment',
        name: 'articleComment',
        component: '/article/comment/index',
        meta: {
          icon: 'Menu',
          title: '评论管理',
        },
      },
    ],
  },
  {
    path: '/user/index',
    name: 'user',
    component: '/user/index',
    meta: {
      icon: 'InfoFilled',
      title: '用户管理',
    },
  },
];
