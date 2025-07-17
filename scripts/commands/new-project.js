// 自定义命令：hexo new project <title>
const path = require('path');
const fs = require('fs');

hexo.extend.console.register('new-project', 'Create a new project post', {
  arguments: [
    { name: 'title', desc: 'Project title' }
  ],
  options: [
    { name: '-r, --replace', desc: 'Replace if existed' }
  ]
}, function(args, callback) {
  const title = args._[0];
  if (!title) {
    console.log('Usage: hexo new project <title>');
    return callback();
  }

  const date = new Date();
  const filename = `${title}.md`;
  
  // 确保 _projects 目录存在
  const projectsDir = path.join(hexo.source_dir, '_projects');
  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }
  
  const filePath = path.join(projectsDir, filename);
  
  // 检查文件是否已存在
  if (fs.existsSync(filePath) && !args.replace) {
    console.log(`File ${filename} already exists. Use --replace to overwrite.`);
    return callback();
  }
  
  // 读取 scaffold 模板
  const scaffoldPath = path.join(hexo.base_dir, 'scaffolds', 'project.md');
  let content = '';
  
  if (fs.existsSync(scaffoldPath)) {
    content = fs.readFileSync(scaffoldPath, 'utf8');
  } else {
    // 默认模板
    content = `---
title: {{ title }}
date: {{ date }}
cover:
tech: []
demo:
repo:
layout: project
---

项目简介。
`;
  }
  
  // 替换模板变量
  content = content
    .replace(/\{\{\s*title\s*\}\}/g, title)
    .replace(/\{\{\s*date\s*\}\}/g, date.toISOString().split('T')[0]);
  
  // 写入文件
  fs.writeFileSync(filePath, content);
  
  console.log(`Created: ${filePath}`);
  callback();
}); 