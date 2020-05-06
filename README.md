# android-project

Android App Development with NativeScript

## Environment

- OS:
    - Windows 10
- CLI:
    - Bash on Windows
- Node.js: 12.14.1
    - Yarn: 1.21.1

### Setup Android Smartphone
- NativeScript Playground アプリをインストールする
    - Google Play > 検索
        - キーワード: `NativeScript Playground`
        - => インストール

### Setup NativeScript-Vue Project
```bash
# vue-cli, nativescript をグローバルインストール
$ yarn global add @vue/cli @vue/cli-init nativescript

# yarn グローバル bin ディレクトリが PATH に追加されていない場合は追加
$ export PATH="`yarn global bin`:$PATH"

# vue-cli を用いて NativeScript プロジェクト作成
# $ vue init nativescript-vue/vue-cli-template <project-name>
$ vue init nativescript-vue/vue-cli-template app
$ cd app
$ yarn install

# NativeScript で preview 実行
$ tns preview
## => 生成するQRコードをAndroidスマホでスキャン
## => NativeScript Playground で実行される
```
