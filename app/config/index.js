const dev = process.env.NODE_ENV !== 'production';
module.exports = eval('require')(dev ? __dirname + '/config.json' : process.cwd() + '/config.json');
