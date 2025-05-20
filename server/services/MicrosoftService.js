const axios = require('axios');
const Session = require('../models/session.model');

// class MicrosoftService {
//     static async synchroniseEvents(accessToken) {
//         const sessions = await Session.find().populate('group');
//         const graphUrl = 'https://graph.microsoft.com/v1.0/me/events';

//         for (const session of sessions) {
//             const event = {
//                 subject: session.group.title,
//                 body: { contentType: "HTML", content: "" },
//                 start: { dateTime: session.startDateTime, timeZone: "Europe/Riga" },
//                 end: { dateTime: session.endDateTime, timeZone: "Europe/Riga" },
//                 location: { displayName: "Riga, Latvia" },
//             };

//             await axios.post(graphUrl, event, {
//                 headers: { Authorization: `Bearer ${accessToken}` }  
//             });
//         }
//     }
// }

class MicrosoftService {
    static async synchroniseEvents(accessToken) {
        const sessions = await Session.find().populate('group');
        const graphUrl = 'https://graph.microsoft.com/v1.0/me/onlineMeetings';

        for (const session of sessions) {
            const meeting = {
                subject: session.group.title,
                startDateTime: session.startDateTime,
                endDateTime: session.endDateTime,
                participants: {
                    organizer: {
                        identity: {
                            user: {
                                id: "me"
                            }
                        }
                    }
                    // You can add attendees here if you want
                }
            };

            const response = await axios.post(graphUrl, meeting, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            // You can save response.data.joinUrl to your DB or return it to the client
            console.log('Teams meeting created:', response.data.joinUrl);
        }
    }
}

module.exports = MicrosoftService;