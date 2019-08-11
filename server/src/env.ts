import path from 'path';
import fs from 'fs';

let envVars: any = {};
const envjsonFile: any = path.resolve(__dirname, 'env.json');
if (fs.existsSync(envjsonFile)) {
  envVars = require(envjsonFile);
}

export default envVars;