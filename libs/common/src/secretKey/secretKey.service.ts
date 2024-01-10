import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class SecretKeyService {
  private readonly publicKey: string;
  private readonly privateKey: string;
  constructor() {
    try {
      this.publicKey = readFileSync(
        resolve(process.cwd(), './secretKey/public.key'),
        'utf-8',
      );
      this.privateKey = readFileSync(
        resolve(process.cwd(), './secretKey/private.key'),
        'utf-8',
      );
    } catch (error) {}
  }
  public getPublicKey(): string {
    return this.publicKey ?? '';
  }
  public getPrivateKey(): string {
    return this.privateKey ?? '';
  }
}
