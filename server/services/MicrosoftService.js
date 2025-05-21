const https = require('https');
const Session = require('../models/session.model');

class MicrosoftService {
    static async synchroniseEvents(accessToken) {
        const sessions = await Session.find().populate('group');
        const graphUrl = 'https://graph.microsoft.com/v1.0/me/events';

        const existingEvents = await new Promise((resolve, reject) => {
            const url = new URL(graphUrl);
            const options = {
                method: 'GET',
                hostname: url.hostname,
                path: url.pathname + url.search,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.value || []);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', reject);
            req.end();
        });

        const eventMatchesSession = (event, session) => {
            const bodyContent = event.body && event.body.content;
            if (bodyContent && bodyContent.includes(`SessionID:${session._id}`)) {
                return true;
            }
            return false;
        };

        for (const session of sessions) {
            const event = existingEvents.find(ev => eventMatchesSession(ev, session));
            const shouldBeInCalendar = !session.deleted && !session.finished;

            if (shouldBeInCalendar && !event) {
                const eventBody = {
                    subject: session.group.title,
                    body: { 
                        contentType: "HTML", 
                        content: `SessionID:${session._id}`
                    },
                    start: { dateTime: session.startDateTime, timeZone: "Europe/Riga" },
                    end: { dateTime: session.endDateTime, timeZone: "Europe/Riga" },
                    location: { displayName: "Riga, Latvia" },
                };
                await new Promise((resolve, reject) => {
                    const url = new URL(graphUrl);
                    const options = {
                        method: 'POST',
                        hostname: url.hostname,
                        path: url.pathname + url.search,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const req = https.request(options, (res) => {
                        res.on('data', () => { });
                        res.on('end', resolve);
                    });
                    req.on('error', reject);
                    req.write(JSON.stringify(eventBody));
                    req.end();
                });
            } else if ((!shouldBeInCalendar) && event) {
                await new Promise((resolve, reject) => {
                    const url = new URL(`${graphUrl}/${event.id}`);
                    const options = {
                        method: 'DELETE',
                        hostname: url.hostname,
                        path: url.pathname + url.search,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const req = https.request(options, (res) => {
                        res.on('data', () => { });
                        res.on('end', resolve);
                    });
                    req.on('error', reject);
                    req.end();
                });
            }
        }
        return;
    }
}

module.exports = MicrosoftService;