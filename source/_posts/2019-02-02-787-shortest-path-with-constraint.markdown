---
layout: post
title: "787. Shortest Path with Constraint"
date: 2019-02-02 13:08:21 -0800
comments: true
categories: [interview, leetcode, dfs, bfs]
---

https://leetcode.com/problems/cheapest-flights-within-k-stops/

在Weighted DAG里找到src到dst的最短路，且中间经过的点不能超过K. [Solution with Path Tracking](https://github.com/Noeyfan/CodingPractice/blob/master/leetcode/cheapestFlightsWitinKStopsImproved.cc)

##### Dijkstra, 使用priority_queue：

跟Dijkstra 最短路的思想类似，从src开始，一直往pq里插入所有可能的path，然后greedy的每轮只拿最小的vertice继续往前走，直到找到dst.

由于必须同时满足:

* v.k >= -1
* v.index == dst

而且一直都用priority_queue找最小的，所以不存在early return的情况。

这个解法有很多的element会被repeatedly insert，memory usage大约到达了第二种解法的两倍! （因为priority_queue不支持decreaseKey operation，所以我们没办法in-place update已经有的key）

```c++
class Solution {
    struct V {
        int dist, index, k;
    };
    
public:
    int findCheapestPriceDijk(int n,
                          const vector<vector<int>>& flights,
                          int src, int dst, int K) {
        // build graph
        unordered_map<int, unordered_map<int, int>> g;
        for (const auto& e : flights) {
            g[e[0]][e[1]] = e[2]; // from, to, weight
        }

        // tracker
        vector<int> pathTo(n);

        // Dijkstra
        using T = tuple<int, int, int>;
        priority_queue<T, vector<T>, greater<T>> pq;  // dis, k, cur
        pq.push({0, K, src});

        while (!pq.empty()) {
            auto [dis, k, from] = pq.top();
            pq.pop();

            if (k < -1) continue;
            if (from == dst) return dis;

            for (const auto& [to, price] : g[from]) {
                pq.push({price + dis, k - 1, to});
            }
        }

        return -1;
    }
};
```

##### SPFA, 使用queue:

SFPA（其实就是BFS!）从src一直往dst找，每轮挪动1，同时一直keep track cheapest，distTo存在的意义就在于cache 已经visited过的vertice (optimize performance)。

```c++
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int K) {
        int cheapest = -1;
        
        unordered_map<int, unordered_map<int, int>> adj_list;
        vector<int> distTo(n);
        distTo[src] = -1;
        
        for (const auto& flight : flights) {
            adj_list[flight[0]][flight[1]] = flight[2];
        }
        
        // {index, price}
        queue<pair<int, int>> q;
        q.push({src, 0});
        
        while (!q.empty() && K >= -1 ) {
            int size = q.size();            
            while (size-- > 0) {    // concise
                auto cur = q.front();
                int index = cur.first, price = cur.second;
                q.pop();
                
                if (index == dst) {
                    cheapest = -1 == cheapest ? price : min(cheapest, price);
                }
                else
                {
                    for (const auto& e : adj_list[index]) {
                        if (distTo[e.first] == 0 || distTo[e.first] > e.second + price) {
                            q.push({e.first, price + e.second});
                            distTo[e.first] = price + e.second;
                        }
                    }
                }
            }
            
            K--;
        }
        
        return cheapest;
    }
};
```

##### SPFA Rev2

```c++
class Solution {
public:
    int findCheapestPrice(int n,
                          const vector<vector<int>>& flights,
                          int src, int dst, int K) {
        // build graph
        unordered_map<int, unordered_map<int, int>> g;
        for (const auto& e : flights) {
            g[e[0]][e[1]] = e[2]; // from, to, weight
        }

        // SPFA
        // setup
        vector<int> distTo(n, INT_MAX);
        // vector<char> inQueue(n, false);  -> optional optimization
        queue<tuple<int, int, int>> q;   // cur, K, acc

        // init
        q.push({src, K, 0});
        // inQueue[src] = true;

        while (!q.empty()) {
            auto [cur, k, acc] = q.front();
            q.pop();
            // inQueue[src] = false;

            if (k < 0) {  // k stop, k+1 edges
                continue;
            }

            for (const auto& [to, weight] : g[cur]) {
                if (distTo[to] > acc + weight) {
                    distTo[to] = acc + weight;
                    // if (!inQueue[to]) {
                        q.push({to, k - 1, acc + weight});
                    // }
                }
            }
        }

        return distTo[dst] == INT_MAX ? -1 : distTo[dst];
    }
};
```

#### Floyd （复杂度高 O(n^3)）

基于动态规划的做法。

#### Dijkstra（不能处理负环和负边）

复杂度为`O(E*logV)`

适合dense 和 sparse graph

从这里让我想到了implement 一下Dijkstra。其实跟解法1确实非常相似，但是也有同样的问题就是priority_queue没办法in-place update key。

还有一点不一样的是，Dijkstra没有K的限制，所以可以keep track两个东西:

* distTo
* edgeTo

然后在插入的时候只有最优解的时候才插入，其他时候直接跳过。（priority_queue的解法则不行，必须得插入所有的元素因为不到找到dst不知道哪个会是最短的）

[Code](https://github.com/Noeyfan/noey_algos/blob/master/trivival/dijkstra.cc)

####Bellman-Ford （都能处理）

复杂度为`O(E*V)`

不适合dense graph

####SPFA（都能处理，但复杂度不稳定）

复杂度为`O(E*V)` in worst case，但是average running time是 `O(E)`, 可惜并没有办法证明。

不适合dense graph

[Code](https://github.com/Noeyfan/noey_algos/blob/master/trivival/spfa.cc)