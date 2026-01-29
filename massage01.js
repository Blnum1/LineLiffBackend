const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const getSalesData = async (keyword) => {
    try {
        let query = `
            SELECT
                t.teamid AS teamId,
                t.team_name AS teamName,
                r.role_mds AS roleMds,
                r.role_name AS roleName,
                r.role_actual AS roleActual,
                r.role_target AS roleTarget,
                r.role_mds_month AS roleMdsMonth
            FROM company c 
            JOIN team t ON t.companyid = c.companyid 
            JOIN role r ON r.teamid = t.teamid
        `;
        if (keyword) {
            query += `
            WHERE concat(r.role_mds_month, r.role_name, t.teamid, t.team_name)
            ILIKE concat('%', CAST($1 AS TEXT), '%')
            `;
        } else {
            query += ` WHERE 1=1 `; 
        }
        const res = await pool.query(query, keyword ? [keyword] : []);
        return res.rows;
    } catch (err) {
        console.error('Database error:', err);
        throw new Error("Failed to fetch data from PostgreSQL");
    }
};

const createMessageData = async (keyword) => {
    try {
        const salesData = await getSalesData(keyword);

        if (!salesData || salesData.length === 0) {
            throw new Error("No data found");
        }

        // จัดกลุ่มข้อมูลตาม teamid และ month
        const groupedData = salesData.reduce((acc, item) => {
            const key = `${item.teamid}_${item.rolemdsmonth}`;
            if (!acc[key]) {
                acc[key] = {
                    teamId: item.teamid,
                    teamName: item.teamname,
                    month: item.rolemdsmonth,
                    roles: []
                };
            }
            acc[key].roles.push(item);
            return acc;
        }, {});

        const roleColors = ['#1E88E5', '#2E7D32', '#EF6C00', '#9C27B0', '#F57C00', '#5E35B1'];

        // สร้าง bubble สำหรับแต่ละ team-month combination
        const carouselContents = Object.values(groupedData).map((teamMonthData) => {
            const { teamName, month, roles } = teamMonthData;

            // คำนวณยอดรวมสำหรับ team-month นี้
            const totalTarget = roles.reduce((sum, item) => sum + parseFloat(item.roletarget), 0);
            const totalActual = roles.reduce((sum, item) => sum + parseFloat(item.roleactual), 0);
            const remaining = totalTarget - totalActual;
            const isOverTarget = totalActual > totalTarget;

            // สร้าง roleItems สำหรับ team-month นี้
            const roleItems = roles.map((role, index) => ({
                "type": "box",
                "layout": "baseline",
                "contents": [
                    {
                        "type": "text",
                        "text": role.rolename,
                        "color": roleColors[index % roleColors.length],
                        "flex": 3
                    },
                    {
                        "type": "text",
                        "text": `${role.rolemds} MDs`,
                        "align": "end",
                        "weight": "bold",
                        "flex": 5
                    }
                ]
            }));

            // แปลงเดือนเป็นชื่อเดือน (ถ้าต้องการ)
            const monthName = month || "Unknown";

            return {
                "type": "bubble",
                "size": "mega",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": `Sales Team ${teamName} ${monthName}`,
                            "weight": "bold",
                            "size": "lg"
                        },
                        {
                            "type": "text",
                            "text": "Capacity Overview",
                            "size": "sm",
                            "color": "#666666"
                        }
                    ]
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "md",
                    "contents": [
                        ...roleItems,
                        {
                            "type": "separator"
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "Sale Overview",
                                    "color": "#666666",
                                    "flex": 3
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "Target",
                                    "color": "#1E88E5",
                                    "flex": 3
                                },
                                {
                                    "type": "text",
                                    "text": totalTarget.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }),
                                    "align": "end",
                                    "weight": "bold",
                                    "flex": 5
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "Actual",
                                    "color": "#2E7D32",
                                    "flex": 3
                                },
                                {
                                    "type": "text",
                                    "text": totalActual.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }),
                                    "align": "end",
                                    "weight": "bold",
                                    "flex": 5
                                }
                            ]
                        },
                        {
                            "type": "separator"
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "Remaining",
                                    "color": isOverTarget ? "#2E7D32" : "#EF6C00",
                                    "flex": 3
                                },
                                {
                                    "type": "text",
                                    "text": Math.abs(remaining).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }),
                                    "align": "end",
                                    "weight": "bold",
                                    "flex": 5
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": isOverTarget ? "Over Target" : "Under Target",
                                    "color": isOverTarget ? "#2E7D32" : "#C62828",
                                    "align": "center",
                                    "weight": "bold",
                                    "size": "sm",
                                    "flex": 5
                                }
                            ]
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                        {
                            "type": "button",
                            "style": "primary",
                            "color": "#1E88E5",
                            "action": {
                                "type": "uri",
                                "label": "View Detail",
                                "uri": "http://example.com"
                            }
                        }
                    ]
                }
            };
        });

        const messageData = {
            "messages": [
                {
                    "type": "flex",
                    "altText": "Sales Team Capacity Overview",
                    "contents": {
                        "type": "carousel",
                        "contents": carouselContents
                    }
                }
            ]
        };

        console.log("Message Data created successfully");
        return messageData;

    } catch (error) {
        console.error('Error creating message data:', error);
        throw error;
    }
};

module.exports = createMessageData;
