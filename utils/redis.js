const Redis = require('async-redis').createClient({
    url: process.env.REDIS_URL
});
/* Using Redis Memory Store */

module.exports = {
    set: async (id, value) => await Redis.set(id.toString(), JSON.stringify(value)),
    get: async (id) => JSON.parse(await Redis.get(id.toString())),
    drop: async (id) => await Redis.del(id.toString())
}