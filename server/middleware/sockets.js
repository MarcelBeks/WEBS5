module.exports = function (io) {
    io.on('connection', function(socket){
        socket.on('ADDED_RACE', function(data) {
            io.emit('RACE', data)
        }),
        socket.on('RACE_STARTED', function(data) {
            io.emit('RACE_START', data.index)
        }),
        socket.on('CHECKED_IN', function(data) {
            io.emit('CHECK_IN', data)
        })
    })
}