const gulp = require('gulp')
const exec = require('child_process');

function join(child) {
    return new Promise((_resolve, _reject) => {
        function resolve(result) {
            child.removeAllListeners()
            _resolve(result)
        }
        function reject(error) {
            child.removeAllListeners()
            _reject(error)
        }
        child.on('exit', (code, signal) => {
            if (code != null && code !== 0) {
                const error = new Error(`process exited with code ${code}`)
                const flowWorkaround = error
                flowWorkaround.code = code
                flowWorkaround.signal = null
                reject(error)
            }
            else if (signal) {
                const error = new Error(`process exited with signal ${signal}`)
                const flowWorkaround = error
                flowWorkaround.code = null
                flowWorkaround.signal = signal
                reject(error)
            }
            else resolve({ code, signal })
        })
        child.on('error', reject)
    })
}

async function pRun(command) {
    let run = exec.exec(command);

    run.stdout.pipe(process.stdout)
    run.stderr.pipe(process.stderr)

    run.on('exit', function (code) {
        //console.log('child process exited with code ' + code.toString());
    });
    await join(run)
}

gulp.task('client-start', () => {
    pRun('cd client-app && npm start');
});
