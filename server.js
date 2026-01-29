const express = require('express');
const axios = require('axios');
const app = express();
const createMessageData = require('./massage01.js');
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const PORT = 8888;
const LINE_BOT_API = 'https://api.line.me/v2/bot';
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
};

const sendMessage = async (userId, messageData) => {
    const body = { ...messageData, to: userId };
    // body.to = userId;

    try {
        const response = await axios.post(`${LINE_BOT_API}/message/push`, body, { headers: header });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const createMainMenuQuickReply = () => {
    return {
        "quickReply": {
            "items": [
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "📅 เลือกเดือน",
                        "text": "เลือกเดือน"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "👥 เลือกทีม",
                        "text": "เลือกทีม"
                    }
                },
                // {
                //     "type": "action",
                //     "action": {
                //         "type": "message",
                //         "label": "📊 ดูทั้งหมด",
                //         "text": "ดูทั้งหมด"
                //     }
                // },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "❓ ช่วยเหลือ",
                        "text": "ช่วยเหลือ"
                    }
                }
            ]
        }
    };
};

const createMonthQuickReply = () => {
    const months = [
        { label: 'Jan', text: 'Jan' },
        { label: 'Feb', text: 'Feb' },
        { label: 'Mar', text: 'Mar' },
        { label: 'Apr', text: 'Apr' },
        { label: 'May', text: 'May' },
        { label: 'Jun', text: 'Jun' },
        { label: 'Jul', text: 'Jul' },
        { label: 'Aug', text: 'Aug' },
        { label: 'Sep', text: 'Sep' },
        { label: 'Oct', text: 'Oct' },
        { label: 'Nov', text: 'Nov' },
        { label: 'Dec', text: 'Dec' }
    ];
     return {
        "quickReply": {
            "items": months.slice(0, 13).map(month => ({
                "type": "action",
                "action": {
                    "type": "message",
                    "label": month.label,
                    "text": month.text
                }
            }))
        }
    };
};

const createTeamQuickReply = () => {
    return {
        "quickReply": {
            "items": [
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "อ้น",
                        "text": "อ้น"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ดา",
                        "text": "ดา"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 3",
                        "text": "ทีม 3"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 4",
                        "text": "ทีม 4"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 5",
                        "text": "ทีม 5"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 6",
                        "text": "ทีม 6"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 7",
                        "text": "ทีม 7"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 8",
                        "text": "ทีม 8"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 9",
                        "text": "ทีม 9"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 10",
                        "text": "ทีม 10"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 11",
                        "text": "ทีม 11"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม 12",
                        "text": "ทีม 12"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "🔙 กลับเมนูหลัก",
                        "text": "เมนูหลัก"
                    }
                }
            ]
        }
    };
};

const sendMessageWithQuickReply = async (replyToken, text, quickReply) => {
    const message = {
        "type": "text",
        "text": text,
        ...quickReply
    };

    try {
        const response = await axios.post(
            `${LINE_BOT_API}/message/reply`,
            {
                replyToken: replyToken,
                messages: [message]
            },
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending Quick Reply:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const replyFlexWithQuickReply = async (replyToken, messageData) => {
    try {
        const messages = [...messageData.messages];
        const lastMessage = messages[messages.length - 1];
        
        // const quickReplyMessage = {
        //     "type": "text",
        //     "text": "เลือกเมนูด้านล่างเพื่อดูข้อมูลเพิ่มเติม",
        //     ...createMainMenuQuickReply()
        // };
        
        // messages.push(quickReplyMessage);

        const response = await axios.post(
            `${LINE_BOT_API}/message/reply`,
            {
                replyToken: replyToken,
                messages: messages
            },
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending Flex with Quick Reply:', error.response ? error.response.data : error.message);
        throw error;
    }
};

app.post('/webhook', async (req, res) => {
    const { events } = req.body;
    console.log(req.body)
    if (!events || events.length === 0) {
        res.json({
            message: "Ok"
        })
        return false
    }

    try {
        const lineEvent = events[0];
        const userId = lineEvent.source.userId;
        const replyToken = lineEvent.replyToken;
        const keyword = lineEvent.message.text;
        console.log('User Message:', keyword);
                if (keyword === 'เลือกเดือน') {
            await sendMessageWithQuickReply(
                replyToken,
                "เลือกเดือนที่ต้องการดูข้อมูล:",
                createMonthQuickReply()
            );
        } 
        else if (keyword === 'เลือกทีม') {
            await sendMessageWithQuickReply(
                replyToken,
                "เลือกทีมที่ต้องการดูข้อมูล:",
                createTeamQuickReply()
            );
        }
        else if (keyword === 'เมนูหลัก' || keyword === 'สวัสดี' || keyword === 'hello') {
            await sendMessageWithQuickReply(
                replyToken,
                "สวัสดีครับ! ยินดีต้อนรับสู่ระบบ\nเลือกเมนูด้านล่างเพื่อเริ่มต้นใช้งาน",
                createMainMenuQuickReply()
            );
        }
        else if (keyword === 'ช่วยเหลือ') {
            await sendMessageWithQuickReply(
                replyToken,
                "📖 วิธีการใช้งาน:\n\n" +
                "1. 📅 เลือกเดือน - ดูข้อมูลตามเดือน\n" +
                "2. 👥 เลือกทีม - ดูข้อมูลตามทีม\n",
                createMainMenuQuickReply()
            );
        }
        else if (keyword === 'ดูทั้งหมด') {
            // ดึงข้อมูลทั้งหมด
            const messageData = await createMessageData(null);
            await replyFlexWithQuickReply(replyToken, messageData);
        }
        else {
            // ค้นหาตาม keyword และแสดง Quick Reply ด้วย
            const messageData = await createMessageData(keyword);
            await replyFlexWithQuickReply(replyToken, messageData);
        }

        // const messageData = await createMessageData(keyword);
        // const response = await sendMessage(userId, messageData);

        return res.status(200).send({ success: true, data: response });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);

        return res.status(500).send({
            details: error.response ? error.response.data : error.message
        });
    }

})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});