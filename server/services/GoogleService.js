const { google } = require('googleapis');
const Session = require('../models/session.model');


class GoogleService {
    static getOAuth2Client() {
        return new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI,
        );
    }

    static async getTokens({ code }) {
        const oauth2Client = this.getOAuth2Client();
        const { tokens } = await oauth2Client.getToken(code);
        return tokens;
    }

    static async synchroniseEvents() {
        const oauth2Client = this.getOAuth2Client();
        oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        const calendar = google.calendar('v3');

        const sessions = await Session.find().populate('group');

        const existingEventsRes = await calendar.events.list({
            auth: oauth2Client,
            calendarId: 'primary',
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 2500,
        });
        const existingEvents = existingEventsRes.data.items || [];

        const eventMatchesSession = (event, session) => {
            const toMillis = dt => new Date(dt).getTime();
            return (
                toMillis(event.start.dateTime || event.start.date) === toMillis(session.startDateTime) &&
                toMillis(event.end.dateTime || event.end.date) === toMillis(session.endDateTime) &&
                event.summary === session.group.title
            );
        };

        for (const session of sessions) {
            const event = existingEvents.find(ev => eventMatchesSession(ev, session));
            const shouldBeInCalendar = !session.deleted && !session.finished;

            if (shouldBeInCalendar && !event) {
                await calendar.events.insert({
                    auth: oauth2Client,
                    calendarId: 'primary',
                    resource: {
                        summary: session.group.title,
                        description: "",
                        location: "Riga, Latvia",
                        start: { dateTime: session.startDateTime },
                        end: { dateTime: session.endDateTime },
                    },
                });
            } else if ((!shouldBeInCalendar) && event) {
                await calendar.events.delete({
                    auth: oauth2Client,
                    calendarId: 'primary',
                    eventId: event.id,
                });
            }
        }
        return;
    }
}

module.exports = GoogleService;