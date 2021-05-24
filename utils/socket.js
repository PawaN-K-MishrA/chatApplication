const User = require("./../models/userModel.js");

const SocketAuthorization = require("./middlewares");
const Message = require("./../models/messaeModel");
const onlineUsersId = [];

async function socketConnecton(io) {
  io.use(SocketAuthorization);

  io.on("connection", async (socket) => {
    console.log(socket.client.conn.server.clientsCount + " users connected");
    onlineUsersId.push(socket.id);
    //  await User.findByIdAndUpdate(socket.id, { isOnline: true });
    //const onlineUsers = await User.find({ active: true });
    const onlineUsers = await User.find({ _id: { $in: onlineUsersId } });
    io.emit("online-users", { onlineUsers });

    /////////////////////on message event
    socket.on("message", async (data) => {
      // const messageAttributes = {
      //   userName: data.userName,
      //   content: data.content,
      //   userId: data.id,
      //   from: socket.id,
      // };
      try{
      let prev_mssg = await Message.findOne({$and:[{'from':socket.id},{'userId':data.id}]},{'content':1}).lean();
      if (prev_mssg){
        let d={}
        d[Date(Date.now())]=data.content;
        new_message=Object.assign(prev_mssg,d)
        let result=await Message.findOneAndUpdate({$and:[{'from':socket.id},{'userId':data.id}]},{'content':new_message})
        if (!result){
          throw new Error('Error in updating messages...')
        }
      }
    }
    catch(err){
      throw new Error(err.message);
      }
      // await Message.create(messageAttributes);
      io.to(data.id.toString()).emit("message", {
        messageAttributes,
        socketId: socket.id,
      });
    });

    //////////////disconnection event
    socket.on("disconnect", async () => {
      console.log("User disconnected");
      //await User.findByIdAndUpdate(socket.id, { isOnline: false });
      const offlineUser = onlineUsersId.indexOf(socket.id);
      onlineUsersId.splice(offlineUser, 1);
      console.log(socket.client.conn.server.clientsCount + " users connected");
      socket.broadcast.emit("online-users", { onlineUsers });
    });
  });
}

module.exports = socketConnecton;
