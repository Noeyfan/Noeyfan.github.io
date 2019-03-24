---
layout: post
title: "322. Coin Change and Classic DP"
date: 2019-03-23 17:35:31 -0700
comments: true
categories: [interview, leetcode, dp, dfs]
---

这题是一道经典dp题，最初在写这题的时候由于使用了backtracking，逻辑混乱不堪，想了一下区分back tracking和dfs的题目：

* back tracking: 需要列出所有的combination
* dfs: 只需要一个最优解



####最直观解法 dfs + memorization (slow but polynomial time)

没什么好说的就是搜索加memorization.

```c++
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        unordered_map<int, int> cache;
        int result = imp(coins, amount, cache);
        return result == INT_MAX ? -1 : result;
    }
    
    int imp(vector<int>& coins, int remaining, unordered_map<int, int>& cache) {
        if (remaining == 0) return 0;
        if (remaining < 0) return INT_MAX;
        if (cache.count(remaining)) return cache[remaining];
        
        int resultMin = INT_MAX;
        for (int i = 0; i < coins.size(); ++i) {
            int curMin = imp(coins, remaining-coins[i], cache);
            if (curMin == INT_MAX) continue;  // handle overflow
            resultMin = min(curMin+1, resultMin);
        }
        
        cache[remaining] = resultMin;
        return resultMin;
    }
};
```

#### 最优解法 dp (O(A * N))

子问题其实由dfs的解法很容易发现，`dp[i] = min(dp[i], dp[i-c] + 1) `, c在这里意味着coins里的任何一个。翻译过来就是对于每一个amount的最优解就是当前存下的值或者是拿coins里的某一个c之前的最优值+1。

```c++
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount+1, amount+1);  // use amount+1 to prevent IN_MAX overflow.
        dp[0] = 0;
        for (int i = 1; i <= amount; ++i) {
            for (int j = 0; j < coins.size(); ++j) {
                if (coins[j] <= i) {
                    dp[i] = min(dp[i], dp[i - coins[j]] + 1);
                }
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
};
```

