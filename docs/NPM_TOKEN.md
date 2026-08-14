# npm 发布用 Token（给你自己用，勿提交到 git）

页面上的 **Recovery Codes** 只用于丢验证器时找回账号，**不是** publish OTP，也**不要发给任何人**。

## 你要做的：建一个 Automation Token

1. 打开：https://www.npmjs.com/settings/~/tokens/create  
   （或 Account → Access Tokens → Generate New Token）
2. 选择类型：**Granular Access Token**（推荐）或 **Automation**
3. 权限至少包含：
   - **Read and write**（或 Packages：publish）
   - 勾选 **Bypass two-factor authentication**（若有此选项；Automation 类型通常自带）
4. 生成后复制整段 token（一般以 `npm_` 开头）

## 给我用时怎么发

任选一种（发完用完建议删除或轮换）：

**A. 对话里只发 token 一行**（我会写入本机临时 env，不写进仓库）

**B. 你自己本机执行：**

```sh
cd /Users/chenyang/Movies/study/dsh-shop-assistant
npm publish --access public --registry https://registry.npmjs.org/ --otp=验证器里的6位数字
```

或用 token：

```sh
cd /Users/chenyang/Movies/study/dsh-shop-assistant
NPM_TOKEN='npm_你的token' npm publish --access public --registry https://registry.npmjs.org/
# 若 npm 读 ~/.npmrc，也可：
# echo '//registry.npmjs.org/:_authToken=npm_你的token' >> ~/.npmrc
```

## 6 位 OTP 在哪

手机 Authenticator 里 **npm** 条目上滚动的 6 位数字（每约 30 秒变一次）。  
Recovery Codes 页面上那串长十六进制 **不能**当 `--otp=` 用。
