import {UserMusicStatistic} from "@prisma/client";

const kafka = require('./client');

export async function updateUserStatistic(statistics: UserMusicStatistic) {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic: "statistic",
        messages: [
            {
                partition: 0,
                key: "statistic-update",
                value: statistics
            }
        ]
    });
    await producer.disconnect();
}