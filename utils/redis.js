const Redis = require('async-redis').createClient();
/* Using Redis Memory Store */

module.exports = {
    set: async (id, value) => await Redis.set(id.toString(), JSON.stringify(value)),
    get: async (id) => JSON.parse(await Redis.get(id.toString())),
    drop: async (id) => JSON.parse(id.toString())
}