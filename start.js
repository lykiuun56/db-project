import { exec } from 'child_process';
import open from 'open';

const startServer = () => {
    exec('npm run serve', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error: ${err}`);
            return;
        }
        console.log(stdout);
        console.error(stderr);
    });
};

startServer();

(async () => {
    // Wait for the server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    // Open the browser
    await open('http://localhost:8080');
})();
