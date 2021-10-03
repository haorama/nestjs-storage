# NESTJS Storage

NESTJS Storage Manager based on [Flydrive](https://github.com/Slynova-Org/flydrive)

## Installation
NPM

```
npm install @haorama/nestjs-storage @slynova/flydrive
```

YARN
```
yarn add @haorama/nestjs-storage @slynova/flydrive
```

## Install External Driver
Please refer to [Flydrive Documentation](https://github.com/Slynova-Org/flydrive) to install external Drivers

## Registering Module
```typescript
import { StorageModule } from '@haorama/nestjs-storage';
import { Module } from '@nestjs/common';
import { resolve } from 'path';
import { AmazonWebServicesS3Storage } from '@slynova/flydrive-s3';

@Module({
  imports: [
    StorageModule.forRoot({
      config: {
        default: 'local',
        disks: {
          local: {
            driver: 'local',
            config: {
              root: resolve('./static/storage'),//if you're using dir/static/storage as the storage location folder
            }
          },
          s3: {
            driver: 's3',
            config: {
              key: 'key',
              secret: 'secret_access_key',
              region: 'region',
              bucket: 'bucketname,
            }
          }
        }
      },
      drivers: [{name: 's3', driver: AmazonWebServicesS3Storage}]
    }),
    //Your other modules
  ]
})
export class AppModule {}
```

if you're using external driver, `drivers` options are required.
`name` args are `disk` name, and `driver` are the `adapter` class of the external driver.
e.g `AmazonWebServicesS3Storage` are imported from `@slynova/flydrive-s3` for s3 driver adapter

if the configuration options its too long, use other file or contants to handle the configuration or use `forRootAsync`

```typescript
@Module({
  imports: [
    //example using `@nestjs/config`
    StorageModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return config.get('storage') // please refer to nestjs config to check how to use this
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    })
  ]
})
export class AppModule {}
```

After that `StorageManager` class from flydrive can be use like:

```typescript
import { StorageManager } from '@slynova/flydrive';

@Injectable()
export class BlogService {
  constructor(
    private storage: StorageManager
  ) {}

  async uploadPhoto(content: Buffer) {
    this.storage.disk().put('location', content);
    this.storage.disk('s3').put('location', content)
  }
}
```

### Problem with S3 Public Storage
[check this issue for solution](https://github.com/Slynova-Org/flydrive/issues/139#issuecomment-747839612)