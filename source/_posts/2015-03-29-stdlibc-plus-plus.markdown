---
layout: post
title: "libstdc++ 初窥"
date: 2015-03-29 00:02:53 -0400
comments: true
categories: [stdlibc++]
---
写了两周stdlibc++.纪录点对c++的理解吧.

###[default constructor](http://en.cppreference.com/w/cpp/language/default_constructor)

1. constructor 是不能被定义在class外的
2. 当constructor被定义为default, compiler 会生成一个implicity declared constructor, calls the default constructors of the bases and of the non-static members of this class. 

###[copy constructors](http://en.cppreference.com/w/cpp/language/copy_constructor)

1. 当user没有定义copy ctor的时候, compiler 会生成一个implicity declared的版本.
2. 这个implicity的版本在一定情况下会被delete,详情见cppreference.

###[SFINAE](http://en.cppreference.com/w/cpp/language/sfinae)

Substitution failure is not an error - 编译器不会立刻炸,会搜索next

###类型擦除(把原来的类型去掉，换成统一类型,换言之cast)

```
char a[10];
void* ap = (void*)a;
int b;
void* bp = (void*)&b;
```
这里就都cast成了void指针。

再来看个Any的例子:

```
class Any {
public:
  Any() : ptr(nullptr) {}

  Any(const Any& other) {
      ptr = other.ptr->Copy();
  }

  Any& operator=(const Any& other) {
      this->~Any();
      ptr = other.ptr->Copy();
      return *this;
  }

  ~Any() {
      if (ptr != nullptr) {
	  delete ptr;
      }
  }

  template<typename T>
    void Assign(const T& data) {
	this->~Any();
	ptr = new Wrapper<T>(data);
    }

  template<typename T>
    T* Get() {
	auto wrapper = dynamic_cast<Wrapper<T>*>(ptr);
	if (wrapper != nullptr) {
	    return &wrapper->data;
	}
	return nullptr;
    }

private:
  struct AnyData {
      virtual ~AnyData() { }

      virtual AnyData* Copy() = 0;
  };

  template<typename T>
    struct Wrapper : public AnyData {
	Wrapper(const T& data) : data(data) {}

	AnyData* Copy() override {
	    return new Wrapper<T>(data);
	}

	T data;
    };

  AnyData* ptr;
};

#include <iostream>

int main() {
    Any a;
    a.Assign<int>(3);
    std::cout << (a.Get<char>() == nullptr) << "\n";
    std::cout << (*a.Get<int>() == 3) << "\n";

    Any b;
    b = a;
    std::cout << (*b.Get<int>() == 3) << "\n";

    return 0;
}

```
###Placement new

通常的new = malloc + ctor, 所以palcement new 就是在分配好的内存地址上再调用一次ctor

通常的delete = dctor + free

###Vtable 的 C 实现

```
#include <stdio.h>

typedef void (*GenericFuncPtr)(void);
//use general ptr array store vf pointer

struct Cat {
    GenericFuncPtr* vtable_ptr;
};

void cat_speak(struct Cat* this) {
    printf("miao");
}

void cat_die(struct Cat* this) {
    printf("ewww");
}

GenericFuncPtr cat_vtable[] = {
    // do in the compile time
    (GenericFuncPtr)cat_speak,
    (GenericFuncPtr)cat_die,
};

void construct_cat(struct Cat* c) {
    c->vtable_ptr = cat_vtable;
}

struct Lion {
    struct Cat base;
};

void lion_speak(struct Lion* this) {
    printf("ow");
}

void lion_die(struct Lion* this) {
    printf("ahhh");
}

GenericFuncPtr lion_vtable[] = {
    (GenericFuncPtr)lion_speak,
    (GenericFuncPtr)lion_die,
};

void construct_lion(struct Lion* l) {
    construct_cat(&l->base);
    l->base.vtable_ptr = lion_vtable;
}

int main () {
    struct Lion l;
    struct Cat* c;
    construct_lion(&l);
    c = &l.base;
    // c->speak
    ((void (*)(struct Lion*))c->vtable_ptr[0])((struct Lion*)c);
    // c->die
    ((void (*)(struct Lion*))c->vtable_ptr[1])((struct Lion*)c);
    return 0;
}
```
###[Partial specialization](http://en.cppreference.com/w/cpp/language/partial_specialization)
Partial specialization 只是针对模版参数,而且function不支持partial specialization.

```
template <typename _Tp> // primary
class A {
};

template <typename _Tp>
class A<_Tp[]> {
};

template <typename _Tp>
class A<_Tp*> {
};

//template <typename _Tp> //error
//class A<_Tp> {
//};
```

###[Universal ref](http://isocpp.org/blog/2012/11/universal-references-in-c11-scott-meyers)
```
template<typename T>
struct A {
    void Foo(T&& /*rvalue ref*/);
};
struct A {
    template<typename T>
      void Foo(T&& /*forwarding ref, or `universal ref`*/);
};
//上面的例子虽然T是模板参数，但不是等着被推出来的。
```

###[Variadic functions](http://en.cppreference.com/w/cpp/utility/variadic)

用法与用处。

```
#include <iostream>
template <typename T>
class A {
public:
  A() { std::cout << "without size" << "\n"; }
  A(size_t size) { std::cout << "with size" << "\n"; }
  A(size_t size, size_t idx) { std::cout << "with size, idx" << "\n"; }
  ~A() { std::cout << "dtor" << "\n"; }
};

template <typename _Tp, typename... Args>
class B : A<_Tp> {
public:
  //B() { std::cout << "B ctor" << "\n"; } B<int>b1 wont work;
  B(Args&&... _args) : A<_Tp>(_args...) { }
private:
  //A<_Tp> _a;
};

class Tmp {
public:
  Tmp() { std::cout << "Tmp ctor" << "\n"; }
};

int main () {
    //B<int> b1;
    B<int,size_t> b2(1);
    //B<int,size_t> b(1,2); //error
    B<int,size_t,size_t> b3(1,2);

    Tmp tmp;
    Tmp tmp1(); // function !!!!!!!!!!!!
}
```
###[function specialization](http://stackoverflow.com/questions/6627651/enable-if-method-specialization)
