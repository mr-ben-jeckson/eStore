const Redis = require('async-redis').createClient(); 
/* Redis does't need { process.env.REDIS_URL } if you could install redis on internel server */ 
/* Using Redis Memory Store */

module.exports = {
    set: async (id, value) => await Redis.set(id.toString(), JSON.stringify(value)),
    get: async (id) => JSON.parse(await Redis.get(id.toString())),
    drop: async (id) => await Redis.del(id.toString())
}