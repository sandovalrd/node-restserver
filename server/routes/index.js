module.exports = app => {
    require('./userRoutes')(app);
    require('./login')(app);
}