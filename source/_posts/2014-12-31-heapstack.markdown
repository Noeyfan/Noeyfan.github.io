---
layout: post
title: "关于堆分配和栈分配思考以及指针和引用"
date: 2014-12-31 01:33:26 -0500
comments: true
categories: [tech]
---
####栈分配
传统栈分配的例子:
```C
int GiveVal(int a) {
	int x = a;
	return x;
}
```
这是合法的栈分配意思是在执行完整个方法后,将里边的数据copy一份,return给外边以后,再将自身的数据a,x释放掉。

####堆分配的产生
由于栈分配在小规模操作的时候还好,但是上升到大规模的运算时候,拷贝的速度会变的非常的慢。
所以就干脆不释放运算过程中的数据，直接将地址return出来。
传统做法是这样的:
```C
FWidget* CreateWidget(int x, int y, int z)
{
	FWidget* NewWidgetPointer = new FWidget(x,y,z);
	return NewWidgetPointer;
}
```

####引用
int b = 3;
int& a = b;
这个等价于
int b = 3;
int* ap = &b;
a = 4; 等价于 *ap = 4;
&a 等价于 ap
唯一不等价的是你没法改ap指向谁
ap只能指向b，不能换人

####例题
下图方法有什么问题:
```C
FWidget& CreateWidget(int x, int y, int z)
{
	FWidget NewWidget(x,y,z); // 栈分配
	return NewWidget;
}
```
等价写法:
```C
FWidget* CreateWidget(int x, int y, int z)
{
	FWidget  NewWidget(x,y,z);
	return &NewWidget;
}
```
问题:
return 出去以后原来的东西就被释放了。
