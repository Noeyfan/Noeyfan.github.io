---
layout: post
title: "Github Notes"
date: 2014-10-16 17:00:06 -0400
comments: true
published: true
categories: [git, tech]
---
###Normal Usage
```
git reset --hard 加上要回滚到的那个hash tag

git init 

git status

git add filename

git add '\*.name'

git log 

git remote add origin https://github.com/try-git/try\_git.git

git push -u origin master  记得加上remote name(origin) 和branch name(master)

git pull  origin master 

git diff HEAD

git add octofamily/octodog.txt

git diff --staged

git reset octofamily/octodog.txt 但是文件还会存在

git checkout -- octocat.txt 回到octocat的last commit时候

git checkout -- octocat.txt 新建clean up branch , 且同时switch to it

git branch 

git rm '\*.txt'

git commit -m ""

git checkout master

git merge clean\_up

git branch -d clean\_up

git push
```

###Bvw Learn
```
git clean -f  清除所有untrack的文件

git add -u 添加所有改动文件

git checkout -- <filename> 解除单个文件的改动

git reset 取消add变回untracked file

```
###Stash
```
git status 查看那些改动

git stash 将所有改动放进stash

git stash list 看stash里的东西

git checkout -b <branch name> 创建新branch

git stash apply 将所有改动放进去

//在branch 里修改以后回到master进行merge

git checkout master

git merge <branch name>

git branch -d <branch name>
```
