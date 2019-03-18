---
layout: post
title: "324.Wiggle Sort II and Dutch National Flag Problem"
date: 2019-02-28 12:16:37 -0800
comments: true
categories: [interview, leetcode, partition]
---

一种特殊排序，排完以后要满足奇数位大于左右，偶数位小于左右。

`nums[0] < nums[1] > nums[2] < nums[3] > nums[4]...`

##### 解法一 O(nlogn) time, O(n) space

将原数组拷贝然后排序，最后从拷贝交叉插入原数组。

值得注意的点在于 `j = (n+1)/2`的选取，原因是当数组为奇数的时候，选取靠后的index可以避免`m` underflow.

```c++
class Solution {
public:
    void wiggleSort(vector<int>& nums) {
        vector<int> tmp = nums;
        int n = nums.size(), m = (n+1)/2, k = n;
        
        sort(tmp.begin(), tmp.end());
        for (int i = 0; i < n; ++i) {
            nums[i] = i & 1 ? tmp[--k] : tmp[--m];
        }
    }
};
```

##### 解法二 O(n) time, O(n) space

其实为了得到交叉排序的数组并不需要sort整个数组，只需要将数组一分为二 (按照median 做 partition)，然后再做交叉插入

```c++
class Solution {
public:
    void wiggleSort(vector<int>& nums) {
        if (nums.size() < 2) return;
        
        int n = nums.size(), m = (n+1)/2;
        vector<int> copy = nums;
        
        // find median
        nth_element(nums.begin(), nums.begin() + m, nums.end());
        int mid = nums[m];
        
        threeWay(copy, mid);
        
        // if odd pick from right partition
        // if even pick from left partition
        for (int i = 0; i < nums.size(); ++i) {
            nums[i] = i & 1 ? copy[--n] : copy[--m];
        }
    }
    
    // https://en.wikipedia.org/wiki/Dutch_national_flag_problem
    void threeWay(vector<int>& A, int mid) {
        int i = 0, j = 0, k = A.size() - 1;
        
        while(j <= k) {
            if (A[j] < mid) {
                swap(A[i], A[j]);
                i++; j++;
            } else if (A[j] > mid) {
                swap(A[j], A[k]);
                k--;
            } else {
                j++;
            }
        }
    }
};
```