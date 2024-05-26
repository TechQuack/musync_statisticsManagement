const Kafka = require('kafkajs');

exports.kafka = new Kafka({
   clientId: "statistic",
   brokers: ["kafka:9092"]
});