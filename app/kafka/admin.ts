const kafka = require('./client');

async function initialize(): Promise<void> {
    const admin = kafka.admin();
    admin.connect();

    await admin.createTopics({
        topics: [
            {
                topic: 'statistic',
                numPartitions: 1
            }
        ]
    })

    await admin.disconnect();
}

initialize().then();