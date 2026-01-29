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
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "📊 ดูทั้งหมด",
                        "text": "ดูทั้งหมด"
                    }
                },
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

// ฟังก์ชันสร้าง Quick Reply สำหรับเลือกเดือน
const createMonthQuickReply = () => {
    const months = [
        { label: 'Jan 2026', text: 'Jan 2026' },
        { label: 'Feb 2026', text: 'Feb 2026' },
        { label: 'Mar 2026', text: 'Mar 2026' },
        { label: 'Apr 2026', text: 'Apr 2026' },
        { label: 'May 2026', text: 'May 2026' },
        { label: 'Jun 2026', text: 'Jun 2026' },
        { label: 'Jul 2026', text: 'Jul 2026' },
        { label: 'Aug 2026', text: 'Aug 2026' },
        { label: 'Sep 2026', text: 'Sep 2026' },
        { label: 'Oct 2026', text: 'Oct 2026' },
        { label: 'Nov 2026', text: 'Nov 2026' },
        { label: 'Dec 2026', text: 'Dec 2026' }
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

// ฟังก์ชันสร้าง Quick Reply สำหรับเลือกทีม
const createTeamQuickReply = () => {
    return {
        "quickReply": {
            "items": [
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม A",
                        "text": "ทีม A"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม B",
                        "text": "ทีม B"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "message",
                        "label": "ทีม C",
                        "text": "ทีม C"
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

// ฟังก์ชันส่งข้อความพร้อม Quick Reply
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

// ฟังก์ชันส่ง Flex Message พร้อม Quick Reply
const replyFlexWithQuickReply = async (replyToken, messageData) => {
    try {
        // เพิ่ม Quick Reply ไปที่ message สุดท้าย
        const messages = [...messageData.messages];
        const lastMessage = messages[messages.length - 1];
        
        // สร้าง text message พร้อม Quick Reply แทน
        const quickReplyMessage = {
            "type": "text",
            "text": "เลือกเมนูด้านล่างเพื่อดูข้อมูลเพิ่มเติม",
            ...createMainMenuQuickReply()
        };
        
        messages.push(quickReplyMessage);

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

module.exports = {
    createMainMenuQuickReply,
    createMonthQuickReply,
    createTeamQuickReply
};