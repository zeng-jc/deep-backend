<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## 深谙

**程序员交流的社区，寓意深刻理解和掌握编程技术**

## 项目启动说明

- `pnpm i `、`npm i -g cross-env` (node版本 ≥ 20.10.0)

- mysql中创建deep数据库，从上到下执行 index.sql 中的sql，数据库第一个用户是超级管理员，拥有后台接口权限不要删除

- 公钥和私钥需要自己生成项目根目录下创建`secretKey`目录，`secretKey`目录下需要生成`private.key`和`public.key`文件

- `private.key`和`public.key`创建流程：mac 电脑直接在终端输入如下代码，windows 电脑需要安装 git，在 gitBash 中输入

  1. 输入 openssl
  2. 输入genrsa -out private.key 2048生成私钥
  3. 输入rsa -in private.key -pubout -out public.key生成公钥
  4. 生成的密钥文件一般在c盘用户目录下

- 根据`config/local.config.ts`配置项目需要的依赖，邮箱服务可以不用配置不影响项目启动

- 查看 package.json 启动对应的服务
