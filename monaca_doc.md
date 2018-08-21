# monaca_doc
git と連携するためにも、 Monaca CLI を利用します。

## はじめに
1. npm をインストールしてください  
   [npmインストール方法](https://qiita.com/taikan/items/88ff45a12b4e06293794)

2. monaca をインストール
   ```bash 
   sudo npm install -g monaca
   ```
   
3. このリポジトリをクローンし、中に入る
   ```bash
   git clone git@github.com:MyDry/gait_tuner.git
   ```
   
4. monaca にログイン (Web上でアカウント作成を済ませておくこと)
   ```bash
   monaca login
   ```
   
5. 携帯端末に「Monaca デバッガー」をインストールし、
   ```bash
   monaca debug
   ```
   で、ペアリングする  
  **九工大Wi-Fiでは動かないので注意**  
  詳しくはこちら  
  [Monacaデバッガーとの連携](https://docs.monaca.io/ja/tutorials/monaca_cli/testing_debugging/)
