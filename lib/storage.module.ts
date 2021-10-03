import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  AsyncStorageModuleOptions,
  StorageModuleOptions,
  StorageOptionsFactory,
} from './interfaces';
import { StorageManager } from '@slynova/flydrive';
import { STORAGE_MODULE_OPTIONS } from './constants';

@Module({})
export class StorageModule {
  static forRoot(options: StorageModuleOptions): DynamicModule {
    const provider: Provider = {
      provide: StorageManager,
      useValue: new StorageManager(options.config),
    };

    return {
      global: true,
      module: StorageModule,
      providers: [provider],
      exports: [StorageManager],
    };
  }

  static forRootAsync(options: AsyncStorageModuleOptions): DynamicModule {
    const provider: Provider = {
      provide: StorageManager,
      inject: [STORAGE_MODULE_OPTIONS],
      useFactory: (options: StorageModuleOptions) => {
        const storage = new StorageManager(options.config);

        if (options.drivers) {
          options.drivers.map((driver) => {
            storage.registerDriver(driver.name, driver.driver);
          });
        }

        return storage;
      },
    };

    const imports = [];

    if (options.imports) imports.push(...options.imports);

    return {
      imports,
      global: true,
      module: StorageModule,
      exports: [StorageManager],
      providers: [provider, ...this.createAsyncProviders(options)],
    };
  }

  private static createAsyncProviders(
    options: AsyncStorageModuleOptions,
  ): Provider[] {
    const optionsProvider = this.createAsyncOptionsProvider(options);

    if (options.useExisting || options.useFactory) {
      return [optionsProvider];
    }

    return [
      optionsProvider,
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: AsyncStorageModuleOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: STORAGE_MODULE_OPTIONS,
        useFactory: options.useFactory,
      };
    }

    return {
      inject: [options.useExisting || options.useClass],
      provide: STORAGE_MODULE_OPTIONS,
      useFactory: (optionsFactory: StorageOptionsFactory) =>
        optionsFactory.createOptions(),
    };
  }
}
