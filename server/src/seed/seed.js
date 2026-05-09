require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Skill = require('../models/Skill');
const Career = require('../models/Career');
const Progress = require('../models/Progress');

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

async function run() {
  await connectDB();
  await Promise.all([User.deleteMany(), Category.deleteMany(), Skill.deleteMany(), Career.deleteMany(), Progress.deleteMany()]);

  const user = await User.create({ name: 'Ava Shah', email: 'ava@example.com', password: 'password123' });

  const catData = [
    { name: 'Technology', icon: 'cpu', color: '#7c3aed' },
    { name: 'Business', icon: 'briefcase', color: '#2563eb' },
    { name: 'Healthcare', icon: 'heart', color: '#10b981' },
    { name: 'Creative Arts', icon: 'palette', color: '#f59e0b' },
    { name: 'Engineering', icon: 'wrench', color: '#0ea5e9' },
    { name: 'Education', icon: 'book', color: '#06b6d4' },
  ];
  const cats = await Category.insertMany(catData.map(c => ({ ...c, slug: slug(c.name) })));
  const byName = Object.fromEntries(cats.map(c => [c.name, c._id]));

  const skillNames = [
    ['Data Analysis', 88], ['Python', 86], ['SQL', 78], ['React', 84], ['Node.js', 80],
    ['UX Research', 70], ['Figma', 72], ['Leadership', 75], ['Communication', 82], ['Cybersecurity', 81],
    ['Machine Learning', 85], ['Project Management', 73],
  ];
  const skills = await Skill.insertMany(skillNames.map(([name, demandScore]) => ({ name, demandScore })));
  const sk = Object.fromEntries(skills.map(s => [s.name, s._id]));

  const img = (q) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=60`;

  await Career.insertMany([
    { title: 'Software Developer', description: 'Build applications and systems that power the digital world.', category: byName.Technology, skills: [sk.React, sk['Node.js'], sk.SQL], avgSalary: 95000, demand: 'High', image: img('photo-1517694712202-14dd9538aa97'), views: 320 },
    { title: 'Data Analyst', description: 'Turn data into insights to help businesses make decisions.', category: byName.Technology, skills: [sk['Data Analysis'], sk.Python, sk.SQL], avgSalary: 72000, demand: 'High', image: img('photo-1551288049-bebda4e38f71'), views: 280 },
    { title: 'UX Designer', description: 'Design meaningful experiences that users love.', category: byName['Creative Arts'], skills: [sk.Figma, sk['UX Research']], avgSalary: 85000, demand: 'Medium', image: img('photo-1557804506-669a67965ba0'), views: 210 },
    { title: 'Product Manager', description: 'Lead product strategy and build solutions people need.', category: byName.Business, skills: [sk.Leadership, sk.Communication, sk['Project Management']], avgSalary: 110000, demand: 'High', image: img('photo-1556761175-5973dc0f32e7'), views: 260 },
    { title: 'Cybersecurity Analyst', description: 'Protect systems and data from threats.', category: byName.Technology, skills: [sk.Cybersecurity, sk.Python], avgSalary: 98000, demand: 'High', image: img('photo-1518770660439-4636190af475'), views: 180 },
    { title: 'Business Analyst', description: 'Bridge business needs and technical solutions.', category: byName.Business, skills: [sk['Data Analysis'], sk.Communication], avgSalary: 78000, demand: 'Medium', image: img('photo-1454165804606-c3d57bc86b40'), views: 160 },
    { title: 'Frontend Developer', description: 'Craft beautiful, responsive interfaces.', category: byName.Technology, skills: [sk.React], avgSalary: 88000, demand: 'High', image: img('photo-1498050108023-c5249f4df085'), views: 240 },
    { title: 'Marketing Specialist', description: 'Grow brands through creative campaigns.', category: byName.Business, skills: [sk.Communication], avgSalary: 65000, demand: 'Medium', image: img('photo-1460925895917-afdab827c52f'), views: 140 },
    { title: 'Machine Learning Engineer', description: 'Build intelligent systems with ML.', category: byName.Technology, skills: [sk['Machine Learning'], sk.Python], avgSalary: 130000, demand: 'High', image: img('photo-1555255707-c07966088b7b'), views: 290 },
  ]);

  await Progress.insertMany([
    { user: user._id, skill: sk.Python, percent: 75, label: 'Python Basics' },
    { user: user._id, skill: sk['Data Analysis'], percent: 40, label: 'Data Analyst Path' },
    { user: user._id, skill: sk.SQL, percent: 65, label: 'Career Assessment' },
  ]);

  console.log('Seed complete. Login: ava@example.com / password123');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
