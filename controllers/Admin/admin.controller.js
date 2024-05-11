const Partner = require("../../model/partners/partners");
//const { getMessaging } = FireBaseAdmin;

confirmPartner = async (req, res)=>{
    try{
        const id = req.params.id
        const confirm = await Partner.findByIdAndUpdate(id,{
            partner_status:"true",
            partner_status_promiss:"ได้รับการอนุมัติ"
        },{new:true})
        if(confirm){
            return res
                    .status(200)
                    .send({status:true, data:confirm})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถค้นหา partner id เจอ"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

cancelPartner = async (req, res)=>{
    try{
        const id = req.params.id
        const cancel = await Partner.findByIdAndUpdate(id,{
            partner_status:"false",
            partner_status_promiss:"ยกเลิกการเป็นพาร์ทเนอร์"
        },{new:true})
        if(cancel){
            return res
                    .status(200)
                    .send({status:true, data:cancel})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถค้นหา partner id เจอ"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

sendNotification = async (req, res) => {
    const { text_title, text_body } = req.body
    try {
        var admin = require("firebase-admin");
        var serviceAccount = require("./demofires-01-firebase-adminsdk-sbd7f-d13d9819fb.json");

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const registrationToken = 'ef6etFEIVF7fA1nOfZ1kkl:APA91bHoWuNEqSECLI3Rth3yVnSIq-JMUu5tCxzp08jhGKI2kKrTZzqo6Ds_9PNXwCb3fQB-eskmI7Whg68sonLX-kQWOa1g2myqXn9_mc1dF8V0GvK1JcLNPoj-J_6Z-RtXyuaJTIyx';
        /* const registrationTokens = [
            'ef6etFEIVF7fA1nOfZ1kkl:APA91bHoWuNEqSECLI3Rth3yVnSIq-JMUu5tCxzp08jhGKI2kKrTZzqo6Ds_9PNXwCb3fQB-eskmI7Whg68sonLX-kQWOa1g2myqXn9_mc1dF8V0GvK1JcLNPoj-J_6Z-RtXyuaJTIyx',
        ]; */

        const message = {
            notification: {
                title: text_title + "",
                body: text_body + ""
            },
            android: {
                notification: {
                    clickAction: 'news_intent'
                }
            },
            apns: {
                payload: {
                    aps: {
                        'category': 'INVITE_CATEGORY'
                    }
                }
            },
            webpush: {
                fcmOptions: {
                    link: '/?breakingnews'
                }
            },
            token: registrationToken
        };

        const messaging = admin.messaging();

        //console.log(FireBaseAdmin)

        messaging.send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
                return res.json({
                    message: "success",
                    status: true,
                    data: response
                })
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                return res.json({
                    message: 'error',
                    data: error
                })
            });
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: err.message
        })
    }
}



module.exports = { confirmPartner, cancelPartner, sendNotification }