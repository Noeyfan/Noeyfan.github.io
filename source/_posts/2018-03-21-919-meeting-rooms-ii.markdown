---
layout: post
title: "919. Meeting Rooms II"
date: 2018-03-21 22:24:39 -0700
comments: true
categories: [interview, lintcode, array]
---
考察Interval intersection, 一次遍历内解决问题和多维数组一直是我的弱项。

#### 920. [Meeting Rooms](http://www.lintcode.com/en/problem/meeting-rooms/)

这道题给一个Interval list只考察Interval有无交集，所以从第二个element开始，只要test自己的start是否小于前一个Interval的end。(前提：List以Interval start sorted)

```c++
class Solution {
public:
    bool canAttendMeetings(vector<Interval> &intervals) {
        if (intervals.size() <= 1) return true;
        sort(
            intervals.begin(),
            intervals.end(),
            [](const Interval &a, const Interval &b)
            {
                return a.start < b.start;
            });
        for (int i = 1; i < intervals.size(); ++i)
        {
            if (intervals[i].start < intervals[i-1].end) return false;
        }
        return true;
    }
};
```

#### 919. [Meeting Rooms II](http://www.lintcode.com/en/problem/meeting-rooms-ii/)

这道题唯一的区别是要算出在同一时间点，有多少同时进行的meeting，得出需要多少个不同的meeting room。

我的初始想法是将每一个interval的时间点都存入hashmap，然后遍历一遍map，算出最大值。这个解法works，但是耗费了很多空间，大部分的时间点存在hashmap里都毫无意义，唯有start和end才是我们关注的，所以改进的解法是将start和end同时存进一个vector并mark上每个点是start还是end，然后sort这个vector，最后遍历一遍vector，start的点counter++，end的点counter\-\-，同时track max value。

```c++
class Solution {
public:
    bool START = true;
    bool END = false;

    int minMeetingRooms(vector<Interval> &intervals) {
        vector<pair<int, bool>> vec;
        for (const auto& itv : intervals)
        {
            vec.push_back(make_pair(itv.start, START));
            vec.push_back(make_pair(itv.end, END));
        }

        std::sort(vec.begin(), vec.end(),
        [](const auto& l, const auto& r) {
            return l.first < r.first;
        });

        int rooms = 0, current = 0;
        for (const auto& it : vec)
        {
            if (it.second)
            {
                current++;
            }
            else
            {
                current--;
            }
            rooms = std::max(rooms, current);
        }

        return rooms;
    }
};
```

同时在网上看到了两个不错的解法。

##### 解法一：

还是使用hashmap，但是只存start和end点的count，最后遍历map，然后sum所有start和end，并且track max value，最后max value就是结果。

```c++
class Solution {
public:
    int minMeetingRooms(vector<Interval>& intervals) {
        map<int, int> m;
        for (auto a : intervals) {
            ++m[a.start];
            --m[a.end];
        }
        int rooms = 0, res = 0;
        for (auto it : m) {
            res = max(res, rooms += it.second);
        }
        return res;
    }
};
```

##### 解法二：

使用最小堆去track离当前最近的会议结束的时间(last.end)，如果last.end <= cur.start，就表示上一个会议已经结束，可以将其从heap里pop出去，这样我们动态的maintain了一个heap，heap的size就表示当前的会议一共要多少间会议室。

```c++
class Solution {
public:
    int minMeetingRooms(vector<Interval>& intervals) {
        sort(intervals.begin(), intervals.end(), [](const Interval &a, const Interval &b){return a.start < b.start;});
        priority_queue<int, vector<int>, greater<int>> q;
        for (auto a : intervals) {
            if (!q.empty() && q.top() <= a.start) q.pop();
            q.push(a.end);
        }
        return q.size();
    }
};
```
