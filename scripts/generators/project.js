const path = require('path');
const fs = require('fs');

hexo.extend.generator.register('projects', function (locals) {
  const projects = [];
  const projectsDir = path.join(hexo.source_dir, '_projects');
  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(projectsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
        if (frontMatterMatch) {
          const frontMatter = frontMatterMatch[1];
          const body = frontMatterMatch[2];
          const titleMatch = frontMatter.match(/title:\s*(.+)/);
          const coverMatch = frontMatter.match(/cover:\s*(.+)/);
          const dateMatch = frontMatter.match(/date:\s*(.+)/);
          const techMatch = frontMatter.match(/tech:\s*\[(.*)\]/);
          const demoMatch = frontMatter.match(/demo:\s*(.+)/);
          const repoMatch = frontMatter.match(/repo:\s*(.+)/);
          const projectObj = {
            slug: file.replace('.md', ''),
            title: titleMatch ? titleMatch[1].trim() : file.replace('.md', ''),
            cover: coverMatch ? coverMatch[1].trim() : null,
            date: dateMatch ? new Date(dateMatch[1].trim()) : new Date(),
            tech: techMatch ? techMatch[1].split(',').map(t => t.trim()) : [],
            demo: demoMatch ? demoMatch[1].trim() : null,
            repo: repoMatch ? repoMatch[1].trim() : null,
            content: body.trim()
          };
          projects.push(projectObj);
        }
      }
    });
  }
  const listPage = {
    path: 'project/index.html',
    layout: 'projects',
    data: {
      title: '我的项目',
      projects: projects,
      menu_id: 'project'
    }
  };
  const pages = [listPage];
  projects.forEach(project => {
    pages.push({
      path: `project/${project.slug}/index.html`,
      layout: 'project',
      data: {
        title: project.title,
        project: project,
        menu_id: 'project'
      }
    });
  });
  return pages;
}); 