import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DeepAmqpService implements OnModuleInit {
  private readonly EXCHANGE = 'EXCHANGE';
  private readonly ROUTING_KING = 'ROUTING_KING';
  constructor(private readonly amqp: AmqpConnection) {}
  async onModuleInit() {
    this.monitorConnection();
  }
  monitorConnection() {
    const conn = this.amqp.managedConnection;
    if (conn) {
      conn.on('connect', () => {
        console.log('RabbitMQ  broker连接成功');
      });
      conn.on('disconnect', () => {
        console.log('RabbitMQ  broker连接失败');
      });
    }
    const chan = this.amqp.managedChannel;
    if (chan) {
      chan.on('connect', () => {
        console.log('RabbitMQ  通道连接成功');
      });
      chan.on('error', () => {
        console.log('RabbitMQ  通道连接失败');
      });
      chan.on('close', () => {
        console.log('RabbitMQ  通道连接关闭');
      });
    }
  }
  async publish<T = any>(message: T) {
    await this.amqp.publish(this.EXCHANGE, this.ROUTING_KING, message);
  }
}
