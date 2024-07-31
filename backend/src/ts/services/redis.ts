import Bull from "bull";

const mainQueue = new Bull('main-queue', {
    redis: { host: 'redis', port: 6379 }
});

export { 
    mainQueue 
}