---
layout: post
title: "TCP Server-Client 实现"
date: 2014-11-24 22:22:50 -0500
comments: true
categories: [c, tech]
---
出于练习目的，决定自己实现一遍client-server的基础模型.
[源码](https://github.com/Noeyfan/crack_code_interview/tree/master/socket)

####Server端

1.申明并取得启用服务地址的一系列参数(这里通过命令行输入).

```C
struct sockaddr_in server;
struct sockaddr_in client;
int port, connectfd, sin_size;
sin_size = sizeof(struct sockaddr_in);

port = htons(atoi(argv[2])); //端叙转换,atoi只用于转换数字
//转化时跳过前面的空格字符，直到遇上数字或正负符号才开始做转换，而再遇到非数字或字符串结束时('/0')才结束转换，并将结果返回。

server.sin_family = AF_INET;
server.sin_port = port;
server.sin_addr.s_addr = htonl(INADDR_ANY); //localhost
```

2.创建socket, 并设置为resuable(并发服务器)

```C
int socketfd = socket(AF_INET, SOCK_STREAM, 0); //返回int
int opt = SO_REUSEADDR;
setsockopt(socketfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
```

3.bind 和listen

```C
if(bind(socketfd, (struct sockaddr *) &server, sizeof(struct sockaddr)) == -1) {
	perror("Bind error");
	exit(1);
}

if(listen(socketfd, 5) == -1) {
	perror("listen() error\n");
	exit(1);
}
```

4.accept卡住程序，等待客户连入，一但连入，开thread处理client

```C
if((connectfd = accept(socketfd, (struct sockaddr *)&client, (socklen_t *)&sin_size)) == -1){ //connectfd is only for process request
	perror ("accept() error \n");
	exit(1);

	struct ARG* arg = (struct ARG*)malloc(sizeof(struct ARG));
	arg->connfd = connectfd;
	connarr[cnt++] = connectfd;
	printf("connect fd after is : %d", arg->connfd);
	arg->client = client;
	if(pthread_create(&thread, NULL, start_routine, (void*)arg)) { //if get strange thing, most likely is pass parameter
		perror("pthread create error");
		exit(1);
	}
}
```

####Client端

1.载入server参数

```C
struct sockaddr_in server_addr;
//两种方法获取server_addr
//1. 可以读取localhost
struct hostent *server;
server = gethostbyname(argv[1]);
bcopy(server->h_addr, &server_addr.sin_addr,server->h_length);

//2. 直接对server_addr放入ipaddr
socketaddr.sin_addr.s_addr = inet_addr("127.0.0.1"); // 127.0.0.1可以是任何string
```

2.connect to the Server

```C
if(connect(sockfd, (const struct sockaddr *)&server_addr,sizeof(server_addr)) < 0) {
	printf("fail to connect");
}
```

3.开thread去处理服务器发来的信息
```C
if(pthread_create(&thread1, NULL, &start_receive, (void*)arg)){
	perror("listen create error");
	exit(1);
}
```

4.在另外的while loop里进行发送
```C
while(1) { // must
	sendRequest(sockfd, argv[3]);
	//在sendRequest里用fegets卡住程序.
}
```

####I/O复用提高效率
基本概念(从非阻塞轮询到select/poll到epoll)

1.非阻塞轮询:不停检测所有io,有数据则读取
```
while(true) {
	for (i in stream[]){
		if (i has data){
			read all;
		}
	}
}
```

2.为了避免cpu空转:引入select代理
同时观察许多流的I/O事件，在空闲的时候，会把当前线程阻塞掉，当有一个或多个流有I/O事件时，就从阻塞态中醒来，于是我们的程序就会轮询一遍所有的流
```
while(true) {
	select(stream[]);
	for (i in stream[]){
		if (i has data){
			read all;
		}
	}
}
```
于是，如果没有I/O事件产生，我们的程序就会阻塞在select处。但是依然有个问题，我们从select那里仅仅知道了，有I/O事件发生了，但却并不知道是那几个流（可能有一个，多个，甚至全部），我们只能无差别轮询所有流，找出能读出数据，或者写入数据的流，对他们进行操作。使用select，我们有O(n)的无差别轮询复杂度，同时处理的流越多，每一次无差别轮询时间就越长。

3.epoll (event poll)
epoll会把哪个流发生了怎样的I/O事件通知我们。此时我们对这些流的操作都是有意义的,复杂度降低到了O(k)，k为产生I/O事件的流的个数.
```
while(true) {
	active_stream[] = epoll_wait(epollfd)
		for (i in active_stream[]) {
			read or write till unavailable
		}
}
```
