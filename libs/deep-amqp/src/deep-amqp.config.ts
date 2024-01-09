import { configLoader } from '@app/common/configLoader';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

export const amqpConfig: RabbitMQConfig = configLoader('rabbitmq');
