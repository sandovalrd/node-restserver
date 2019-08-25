module.exports = app => {
    require('./userRoutes')(app);
    require('./categoryRoutes')(app);
    require('./productRoutes')(app);
    require('./login')(app);
}