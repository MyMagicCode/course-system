## 👋介绍

本项目是一个排课系统，支持管理员、教师、学生三类用户，密码采用MD5加密后的密文存储，只有管理员才能对系统操作数据；系统功能模块有学期、课程、考试，排期、添加用户等。排期完成后会可以在课程表模块查看排课信息。

**主要技术栈：**nextjs + prisma + MySQL + next-auth+ant-design；

![](.\doc\home.png)

## 😃开始启动

首先启动验证码服务（只有验证码服务是通过python启动）

```bash
cd ./server
python ./index.py
```

然后（需要确定终端是在项目根目录）

```bash
npm run dev
# 打包
npm run build
# 打包后启动
npm run start
```
