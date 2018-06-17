## CNS Project Proposal — Security Issues of Shorten URLs

b04902012 劉瀚聲（組長）、
b04902002 許志軒、
b04902007 楊舒瑄、
b04902111 林廷衛

---

### Introduction
短網址幫助人們易於輸入、記憶或在文字受限的地方（例如 SMS 訊息中）放上網址。
然而短網址簡短的特性卻使得它可能被不相干的人經由其他方法（例如暴力嘗試）取得該網址，進而造成原本的網址和網站中的內容外洩，形成隱私上的隱憂。

我們嘗試研究現有的公開線上短網址服務以及 github 上的開源短網址專案是否有被不相干的人找出連結的特性，並且試著提出一些方法來設計不易被找到網址的短網址服務。

---

### Attacker Model and Security Properties

一個沒有透過其他管道取得原本網址或其縮短網址的攻擊者，藉由對短網址服務送出大量請求或根據短網址服務產生短網址的特性，得到縮短的網址並連結到原本網址內的資料。
假設攻擊者擁有與一般人相當的運算資源（一或二台個人電腦以及一或二個網路上的 IP 位置），並且攻擊者也能以一般使用者的身份使用短網址服務。

此攻擊最主要侵犯了創造短網址的使用者的隱私；同時，網址本身與其所連到的內容可能是非公開的，因此也侵犯了使用者資料的保密性。

---

### Related Work
* Martin Georgiev, and Vitaly Shmatikov. [Gone in Six Characters: Short URLs Considered Harmful for Cloud Services](https://arxiv.org/pdf/1604.02734v1.pdf)
  主要以 bit.ly 短網址服務以及 Onedrive 雲端服務為研究對象，嘗試暴力攻擊短網址，存取到使用者放進去的連結。實驗發現 bit.ly 的有效短網址密度非常高（估計約42%），很容易就可以利用隨機產生的短網址存取到別人的連結，侵犯隱私。另外，部份短網址可連結到有編輯權限的雲端檔案，不僅危害保密性，也無法確保資料不被竄改。


* How is it done today?

  現今有許多線上的短網址服務，包括較著名的
    * goo.gl（六碼）
    * bit.ly（七碼）
    * tinyurl（五～八碼）

  以上三者服務自動產生的短網址皆為 [a-z][A-Z][0-9] 的組合。另外 bit.ly 為了中文使用者好記方便，支援自訂中文短網址服務，但僅限於使用者自訂網址，不會隨機產生中文網址。


* What are the limits of current practice?
  如果短網址服務所產生的短網址的 token 長度太短，則有遭人以暴搜的方式窮舉所有 token，建表還原出所有原先網址的風險；而若所產生的短網址 token 長度太長，反而會因此失去了短網址服務的初衷；此外，若是所產生的 token 是根據某些 random generator 所產生的，則有所用的 random generator 不夠 random，導致所產生的 random token 有被預測的可能。

### Plan
#### What is your initial approach?
* Attack
  * 暴力攻擊
  * 研究 token 的產生方式，並嘗試預測它
    若能成功預測 token 的產生，則可以大幅提升攻擊的破壞性，也不會像暴力攻擊一樣受有效短網址的密度限制。
  * 研究開源專案的程式碼，並鑽研其安全性漏洞

* Defense
  * 使用中文當作短網址的 token 

    讓短網址服務產生出基於中文字的 token，中文常用字的個數大約為 5000 個字，比大小寫英文加上數字的 62 個字元多不少，因此如果同樣產生 6 個隨機的字作為 token，則在 random generator 足夠隨機的前提下，產生中文字的短網址服務會比產生英文字＋數字的短網址服務來的安全。
    * 優點：短網址的 token space 增加，大大提昇暴力搜索破解所需消耗的資源。
    * 缺點：可能因語言隔閡，不夠普及，變相侷限了使用者的族群範圍。
  * 使用 word-based 方式生成 token

    現今的短網址服務都是將網址轉成一串英數或是大小寫英文字元混合的字串，這是 character-based 的 token，然而或許可以使用 word-based 的方式產生 token，即是隨機使用數個英文單字拼成短網址服務的 token。
    * 優點：現今常用的英文單字約為 7000 個，同樣可使短網址的 token space 增加，提升暴力搜索破解所需消耗的資源。
    * 缺點：如果一個英文單字以 5 個字元來做估算，6 個英文單字所組成的 token 長度就達 30 個字元，如此或許只是讓使用者較好輸入，但未必能達到縮短網址的初衷。
  * 設定短網址 token 的有效時間

    設定每一筆短網址 token 在資料庫內的存活時間，若存活時間已至，則移除該 token，使其不再有效，並且該 token 可再被重複利用來縮短其他網址。
    * 優點：如此一來的話每一筆網址的縮短都只是暫時的，若是真的遭到攻擊者暴力搜索建表反查，造成的損失比較小，同時也能有效節約資料庫的空間。
    * 缺點：對於使用者來說，一筆短網址若只能在某段時間內存取到，可能不便於某些需求。
  * 使用者不要用短網址服務來縮短重要的資料



#### What is your plan for evaluation?
* Attack
  * 線上各短網址服務的有效網址密度（i.e. 平均試多少個網址可連到有效網頁）
  * 各 github 專案產生短網址的方式是否可以被預測（找到有效網址的平均嘗試次數比暴力搜尋的期望值還要好）
  * 各 github 專案是否有其他漏洞

* Defense
  * token space 大小
  * usability

### Timeline

|  Schedule|                   Objective|
|----------|----------------------------|
|~ 5/20 |  Survey online url shortener services |
|~ 6/05 |  Study token generators of open source url shortener|
|~ 6/15 |  Design defense approach and evaluate it |
|6/19 , 6/26|  Final project presentation|
|      7/03|        Final project report|

---

### Deliverables

* 調查線上服務的統計結果
* 針對開源專案的攻擊方式與成果
* 防禦方法的設計概念與簡單評估

### Todo List
* 暴力搜尋（分析密度）
    * bit.ly
    * goo.gl
    * tinyurl
    
* 以中文詞彙搜尋（bit.ly）

* 分析開源專案
    * [YOURLS/YOURLS](https://github.com/YOURLS/YOURLS)
    * [edwardhotchkiss/short](https://github.com/edwardhotchkiss/short)
    * [cydrobolt/polr](https://github.com/cydrobolt/polr)
    * [thedevs-network/kutt](https://github.com/thedevs-network/kutt)
    * [alanhogan/lessnmore](https://github.com/alanhogan/lessnmore)

* 
