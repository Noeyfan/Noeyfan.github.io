---
layout: post
title: "621. Task Scheduler with Gaps"
date: 2019-03-17 17:53:38 -0700
comments: true
categories: [interview, leetcode, priority_queue, greedy]
---

https://leetcode.com/problems/task-scheduler/

https://leetcode.com/problems/rearrange-string-k-distance-apart/

与一般的Scheduling问题不同，这题要求每个task之间最少间隔`x` gaps.

做法是priority_queue + greedy (未证明)，以"AAABBC"，x=3为例，greedy的过程大致为，从frequency最高的元素开始，依次填空

1. `A__A__A__`
2. `AB_AB_A__`
3. `ABCAB_A__` (注意trailing idle time是不需要的)

所以最终的结果是`ABCAB_A`= `7`



Implementation 复杂度为 `O(nlogn)` 应为每个元素都会被插入pq一次，这题有`O(n)`的[解法](https://leetcode.com/problems/task-scheduler/discuss/104500/Java-O(n)-time-O(1)-space-1-pass-no-sorting-solution-with-detailed-explanation)

```c++
class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        unordered_map<char, int> taskCounts;
        priority_queue<int> taskQ;
        
      	// O(t) count
        for (auto t : tasks) {
            ++taskCounts[t];
        }
        
      	// O(tlogt) insert
        for (auto [t, freq]: taskCounts) {
            taskQ.push(freq);
        }
        
        int cycle = 0;
        while (!taskQ.empty()) {
            vector<int> remainingTasks;
            
            int idle = 0;
            int gaps = n;
          	// note while (--i) and while (i--) executes different times
          	// * while (--i) i-1 times
          	// * while (i--) i   times
            while (gaps-- >= 0) {
                if (!taskQ.empty()) {
                    remainingTasks.push_back(taskQ.top());
                    taskQ.pop(); 
                    ++cycle;
                } else {
                    ++idle;
                }
            }
            
            for (auto tf : remainingTasks) {
                if (--tf > 0) {
                    taskQ.push(tf);
                }
            }
            
            if (!taskQ.empty()) {
                // to avoid trailing idle time
                cycle += idle;
            }
        }
        
        return cycle;
    }
};
```