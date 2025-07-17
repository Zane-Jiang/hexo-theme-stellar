const fs = require('fs');
const path = require('path');

hexo.extend.generator.register('about', function(locals) {
  // 检查 source/about/index.md 是否存在
  const aboutMd = path.join(hexo.source_dir, 'about/index.md');
  if (fs.existsSync(aboutMd)) {
    return []; // 用户已自定义 about，不自动生成
  }

  // 自动生成 about 页面
  const config = hexo.config;
  const avatar = config.avatar || '/images/avatar.png';
  const author = config.author || config.title || 'About Me';
  const description = config.description || '';

  return [{
    path: 'about/index.html',
    layout: 'about',
    data: {
      title: 'About',
      avatar,
      author,
      description
    }
  }];
});