import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway(3002, {
  transports: ['websocket'],
  namespace: '/',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor() { }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  // handleEvent함수 파라미터값에 client:Socket을 이용하면 해당 이벤트를 발생시킨 클라이언트를 특정할 수 있다.
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  // 서버가 실행하면 이 함수 실행
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
  }
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
