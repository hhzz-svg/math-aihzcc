const fs = require('fs');
const vm = require('vm');
const path = require('path');

const dataPath = path.resolve(__dirname, '..', 'data.js');
const source = fs.readFileSync(dataPath, 'utf8') + '\nthis.__data={PLAN_META,phases,topics,problems,tips,mockExams,dailyRules};';
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: dataPath });
const { PLAN_META, phases, topics, problems, tips, mockExams } = sandbox.__data;

const checks = [];
const unique = (items) => new Set(items).size === items.length;
checks.push(['9 topics', topics.length === 9]);
checks.push(['topic weights sum to 100', topics.reduce((sum, item) => sum + item.weight, 0) === 100]);
checks.push(['36 original examples', problems.length === 36]);
checks.push(['4 examples per topic', topics.every((topic) => problems.filter((p) => p.topic === topic.id).length === 4)]);
checks.push(['unique problem ids', unique(problems.map((p) => p.id))]);
checks.push(['all problem topics exist', problems.every((p) => topics.some((t) => t.id === p.topic))]);
checks.push(['6 study phases', phases.length === 6]);
checks.push(['phase dates ordered', phases.every((p, i) => i === 0 || phases[i - 1].end < p.start)]);
checks.push(['exam date after plan', phases.at(-1).end < PLAN_META.examDate]);
checks.push(['6 mock exams', mockExams.length === 6]);
checks.push(['all mock references valid', mockExams.every((mock) => mock.problems.every((id) => problems.some((p) => p.id === id)))]);
checks.push(['18 technique cards', tips.length === 18]);

checks.forEach(([name, ok]) => console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`));
if (checks.some(([, ok]) => !ok)) process.exit(1);

