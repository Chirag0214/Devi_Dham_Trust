import fs from 'fs';
import path from 'path';

(async () => {
  try {
    const url = 'http://localhost:3000/api/admin/projects';
    const form = new FormData();
    form.append('title', 'TestProject-node');
    form.append('description', 'created-by-node-test');
    form.append('status', 'Active');
    const imgPath = path.join(process.cwd(), 'public', 'images', 'projects', 'project-1759923617993-plantation.avif');
    form.append('projectImage', fs.createReadStream(imgPath));

    const res = await fetch(url, { method: 'POST', body: form });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log(text);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
