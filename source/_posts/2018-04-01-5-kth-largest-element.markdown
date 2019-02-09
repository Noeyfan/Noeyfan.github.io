---
layout: post
title: "5. Kth Largest Element (快排之思)"
date: 2018-04-01 14:23:39 -0700
comments: true
categories: [interview, lintcode]
---

起因源于我与同事争论，find kth largest element是O(n)的复杂度还是O(nlogn) 。我一直认为find kth largest element 最优解与快排同源，所以应该是O(nlogn)，事实证明我是错的，实际的解法是快速选择，O(n)最优情况，O(n^2)最差情况。

解法都大同小异如下: （我取了中间点作为pivot，最简单的做法是取头或者尾作为pivot）

```c++
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        return find(nums, 0, nums.size()-1, k);
    }
    
    int partition(vector<int>& nums, int begin, int end, int k)
    {
        if (begin > end) return -1; // should not happend
        int p = nums[(end + begin)/2];
        int i  = begin, j = end;
        while(i != j)
        {
            if (nums[j] > p)
            {
                j--;
            }
            else if (nums[i] < p)
            {
                i++;
            }
            else
            {
                std::swap(nums[i], nums[j]);
                if (nums[j] == p) i++; // edge case where after swap if nums[j] == p then we can't --j
                else j--;
            }
        }
        int diff = end-i+1-k;
        if (diff == 0)
        {
            return nums[i];
        }
        else if (diff > 0)
        {
            return find(nums,i+1,end,k); // i j are the same anyways
        }
        else
        {
            return find(nums,begin,j-1,-diff); // i j are the same anyways
        }
    }
};
```

关键在于复杂度的分析。

#### 快排：

快排的(average)复杂度之所以为O(nlogn)，因为每次partition需要O(n)，

**最差情况：**每次partition正好为```[]和[0..n]``` ，也就是```T(n)=T(n-1)+T(0)+O(n) -> T(n)=T(n-1)+O(n)-> T(n)=O(n^2) ```

**最优情况：**每次partition正好为```[0..n/2-1]和[n/2..n]``` ，也就是```T(n)=2T(n/2)+O(n) -> T(n)=O(nlogn)``` 

同时也可以简单理解为最差需要partition O(n)次而最优只需要partition O(logn)次

#### **快速选择：**

快速选择的(average)复杂度之所以为O(n)，因为每次递归只需要partition整个array的一半，

**最差情况：**依旧与快排类似，如果每次pivot都选择了最小或者最大，那么还是需要O(n^2)去完成整个操作

**最优情况：**如果pivot正好选择了中间值，那么```T(n)=T(n/2)+O(n) -> T(n)=2O(n) -> T(n)=O(n)```