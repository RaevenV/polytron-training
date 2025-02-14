const Redis = require('ioredis');
const config = require('./configuration')

const redis = new Redis({
    host: config['REDIS_HOST'],//redisConfig.host, //
    port: config['REDIS_PORT'],//redisConfig.port, //
    password: config['REDIS_PASS'],//redisConfig.password, //
    db: 1
});

const publisher = new Redis({
    host: config['REDIS_HOST'],//redisConfig.host, //
    port: config['REDIS_PORT'],//redisConfig.port, //
    password: config['REDIS_PASS'],//redisConfig.password, //
    db: 2
})

module.exports = {
    get: async function(key){
        var result = null
        var error = null
        try{
            result = await redis.get(key);
        }catch(err){
            console.log(err)
            error = err
        }
        return [result, error]
    },
    set: async function(key, value, exp){
        var result = false
        var error = null
        try {
            await redis.set(key, value, 'EX', exp);
            result = true
        } catch (err) {
            console.log(err)
            error = err
        }
        return [result, error]
    },
    flushdb: async function(){
        var result = false
        var error = null
        try {
            await redis.flushdb();
            result = true
        } catch (err) {
            console.log(err)
            error = err
        }
        return [result, error]
    },
    publish: async function(key, message){
        publisher.publish(key, JSON.stringify(message))
    }
}
