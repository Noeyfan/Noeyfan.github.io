---
layout: page
title: "10. Regular Expression Matching"
categories: interview
date: 2017-06-07 1:30
comments: true
sharing: true
footer: true
---

准备督促自己刷刷题／打打codejam，保持手感，记录一些难倒过自己的题目，从错误开始到正确思路，（也许）包括一些深入的拓展。

#### 题目

第一题就从[Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/)开始好了，简言之写个方法:

```c++
bool isMatch(string s, string regex);
```

#### 思路

超简化的Regular Expression Matching，通常只包含：`* . [a-Z]`几种元素，所以从简单入手分析所有可能的match情形:

* `[a-Z]` 和 `[a-Z]`，属于exact match，只需要关注当前位置
* `[a-Z]` 和 `.`， 属于any match，与上种情况类似，但是`\0` 和 `.` 是不能match的
* `[a-Z]` 和 `([a-Z]|.)*`，属于repeat match, 也是这题的唯一难点，有两种情况，且可以用DFS暴力解决：
  * `* ` match >=1 次: `[a-Z]` match `[a-Z]|.`  && `s+1` 也要match `regex`
  * `*` match 0 次: `s` match `regex+2`

#### 曾犯错误

之下都是我在面试或者写题中出现过的错误：

* 与WildCardMatching混淆，认为一个for loop可以解决（非DP）
* 边界情况 `""` 与 `.*`的match
* For loop 和DFS 在此处混用，逻辑不清（紧张？？？）
* 强行用c++ string 进DFS却又不想用index （`string::data() -> const char*`）
* 没有处理`\0` 和 `.` 的情况

不怕笑话，试着回忆一些面试写的丑逼代码：

##### 丑1:

```c++
bool isMatch(string s, string regex) {
  if (s.empty() && regex.empty()) return false;
  int r_i = 0;
  for (int i = 0; i < s.size(); ++i) {
    if (s[i] == regex[r_i]) {
      return isMatch(s.substr(i), regex.substr(r_i));
    }
    if (regex[r_i] == '*') { // should be regex[r_i+1] == '*'
      return isMatch(s.substr(i+1), regex.substr(r_i-1))
        || isMatch(s.substr(i), regex.substr(r_i+1));
    }
    if (regex[r_i] == '.') {
      return isMatch(s.substr(i+1), regex.substr(r_i+1));
    }
    return false;
  }
  return false;
}
```

##### 丑2：

```c++
bool isMatch(string s, string p) {
  return imp(s.data(), p.data());
}

bool imp(const char* c, const char* p) {
    if (*c == '\0' && *p == '\0') {
        return true;
    }
    if (*p == '\0' || *c == '\0') return false; // ??? patching
    if (*(p+1) == '*') {
        return isMatch(c+1, p) || isMatch(c+1, p+2); // should be || isMatch(c, p+2)
    }
    if (*c == *p || *p == '.') {  // '\0' and '.'
        return isMatch(c+1, p+1);
    }
    return false;
}
```

#### 正确姿势

##### DFS

算法清晰的情况下，DFS 解法基本等同于直接翻译：

```c++
bool isMatch(string s, string p) {
  return imp(s.data(), p.data());
}

bool imp(const char* c, const char* p) {
  	// only when regex reaches the end, *c check make sense
    if (*p == '\0') return *c == '\0';
    if (*(p+1) == '*') {
        return
          imp(c, p+2)
          // test if c is end of string then we can safely
          // recursively call imp(c+1, p)
          || ((*p == *c || (*c != '\0' && *p == '.'))
                && imp(c+1, p));
    }
    if (*c == *p || (*c != '\0' && *p == '.')) {
        return imp(c+1, p+1);
    }
    return false;
}
```

##### DP

DP的关键在于构建状态转移矩阵，而此处构建的方法为：令 `bool f[i][j]`为 `s[i-1]` match `p[j-1]` 的情况，然后写出 `f[i][j]` 与 `p[i-1]` `j[i-1]` 的关系，相同**思路**。

其中初始化`f[0][j]`要有讲究（也就是`empty string` 与 什么样的`regex`算matching）。

详细请看代码注释：

```c++
// Copy from Leetcode
bool isMatch(string s, string p) {
    /**
     * f[i][j]: if s[0..i-1] matches p[0..j-1]
     * if p[j - 1] != '*'
     *      f[i][j] = f[i - 1][j - 1] && s[i - 1] == p[j - 1]
     * if p[j - 1] == '*', denote p[j - 2] with x
     *      f[i][j] is true iff any of the following is true
     *      1) "x*" repeats 0 time and matches empty: f[i][j - 2]
     *      2) "x*" repeats >= 1 times and matches "x*x": s[i - 1] == x && f[i - 1][j]
     * '.' matches any single character
     */
    int m = s.size(), n = p.size();
    vector<vector<bool>> f(m + 1, vector<bool>(n + 1, false));
    
    f[0][0] = true;
    for (int i = 1; i <= m; i++)
        f[i][0] = false;
    // p[0.., j - 3, j - 2, j - 1] matches empty iff p[j - 1] is '*' 
  	// and p[0..j - 3] matches empty
    for (int j = 1; j <= n; j++)
        f[0][j] = j > 1 && '*' == p[j - 1] && f[0][j - 2];
    
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (p[j - 1] != '*') {
                f[i][j] = f[i - 1][j - 1] && (s[i - 1] == p[j - 1] 
                                              || '.' == p[j - 1]);
            }
            else
                // p[0] cannot be '*' so no need to check "j > 1" here
                f[i][j] = f[i][j - 2] || (s[i - 1] == p[j - 2] 
                                          || '.' == p[j - 2]) && f[i - 1][j];
    
    return f[m][n];
}
```

#### 拓展

* 尝试用NFA解决真正的`regex`问题，尝试自己土制了一个小 [regex lib](https://github.com/Noeyfan/noey_algos/blob/master/noey_regex.h).
* 还有Tim的 [compile time regex (no parsing)](https://gist.github.com/Noeyfan/1c60fa6555f6cdc50fd2f55d78aed8a9)

#### 相似题目

`// placeholder，将遇到的相似题目加入此处`
