---
layout: post
title: "269. Alien Dictionary and Topological Sort"
date: 2019-02-08 23:42:37 -0800
comments: true
categories: [interview, leetcode]
---

好久没碰到过拓扑排序的题目了，今天突然写到，花了4个小时 :( 这题的难点在于，找到它和拓扑排序的关系，以及如何构建graph.

##### 如何构建graph

一开始想的有些复杂，其实就是两成对，找到第一个不相同的pair of char，即为graph的一条边

##### 拓扑排序

拓扑排序适用于：

* 多src和dependency的排序
* 找graph里是否有环

这题正好需要这两点，拓扑排序首先将没有incoming edge的点加入queue中，当queue不为空时，一直循环并update queue里所有点的neighbor的 incoming edge count，如果update之后 count == 0则加入queue中。

如果有环的话那么环中的每个node的incoming edge都永远不会是0，所有最后只要比较一下结果的size是不是包含了所有node，就可以知道有没有环了。

```c++
class Solution {
public:
    string mergeOrders(
        unordered_map<char, unordered_set<char>>& g,
        unordered_map<char, int>& cnt
    ) {       
        queue<char> q;
        
        for (const auto& [ch, c] : cnt) {
            if (c == 0) {
                q.push(ch);
            }
        }
        
        string ret = "";
        while(!q.empty()) {
            char c = q.front();
            q.pop();
            
            ret += c;
            for (const auto& e : g[c]) {
                cnt[e]--;
                if (cnt[e] == 0) q.push(e);
            }
        }
        
        if (ret.size() != cnt.size()) return "";
        return ret;
    }
    
    string alienOrder(vector<string>& words) {
        unordered_map<char, unordered_set<char>> g;
        unordered_map<char, int> cnt;
        
        for (int i = 0; i < words.size(); ++i) {
            for (int j = 0; j < words[i].size(); ++j) {
                cnt[words[i][j]] = 0;
            }
        }
        
        for (int i = 0; i < words.size()-1; ++i) {
            string& cur = words[i];
            string& next = words[i+1];
            
            int limit = min(cur.size(), next.size());
            for (int j = 0; j < limit; ++j) {
                if (cur[j] != next[j]) {
                    if (g[cur[j]].find(next[j]) == g[cur[j]].end()) {
                        g[cur[j]].insert(next[j]);
                        cnt[next[j]] += 1;
                    }
                    break;
                }
            }
        }
        
        return mergeOrders(g, cnt);
    }
};
```

