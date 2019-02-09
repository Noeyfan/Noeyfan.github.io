---
layout: post
title: "427. Generate Parentheses"
date: 2018-03-28 00:05:47 -0700
comments: true
categories: [lintcode, interview]
---

http://www.lintcode.com/en/problem/generate-parentheses/

这道题给定n，然后输出所有长度为2n的valid parentheses.

**解法一：**

最简单的解法是枚举，用两个变量num_of_left, num_of_right去track还有多少个左括号和右括号可以使用。只要有左括号可以用就可以继续递归generate，但是只有可用右括号大于左括号时候才可以继续递归generate，防止")("的情况。

```c++
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> ret;
        generate(ret, "", n, n);
        return ret;
    }

    void generate(
        vector<string>& ret,
        string s,
        int num_of_left,
        int num_of_right)
    {
        if (num_of_left == 0 && num_of_right == 0)
        {
            ret.push_back(s);
            return;
        }

        if (num_of_left > 0)
        {
            generate(ret, s+"(", num_of_left-1, num_of_right);
        }
        if (num_of_right > num_of_left)
        {
            generate(ret, s+")", num_of_left, num_of_right-1);
        }
    }
};
```

**解法二：**

dp的思路 ，想求第f(n)，就是将"()"加入f(n-1)的结果：

f(0): ""

f(1): "("f(0)")"

f(2): "("f(0)")"f(1), "("f(1)")"

f(3): "("f(0)")"f(2), "("f(1)")"f(1), "("f(2)")"

所以 f(n) = "("f(0)")"f(n-1) , "("f(1)")"f(n-2) "("f(2)")"f(n-3) … "("f(i)")"f(n-1-i) … "(f(n-1)")"

```c++
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<vector<string>> tmp = {{""}};
        for (int j = 1; j <= n; ++j)
        {
            vector<string> vec;
            for (int i = 0; i < j; ++i)
            {
                for (auto fst : tmp[i])
                {
                    for (auto snd : tmp[j-i-1])
                    {
                        vec.push_back("("+fst+")"+snd);
                    }
                }
            }
            tmp.push_back(vec);
        }
        return tmp.back();
    }
};
```

