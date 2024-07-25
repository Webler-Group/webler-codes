import Bull from "bull";

const queue = new Bull('my-queue', {
    redis: { host: 'redis', port: 6379 }
});

export { 
    queue 
}