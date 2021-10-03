import { Abstract, ModuleMetadata, Type } from '@nestjs/common';
import { Storage, StorageManagerConfig } from '@slynova/flydrive';

interface StorageConstructor<T extends Storage = Storage> {
  new (...args: any[]): T;
}

export interface Driver {
  name: string;
  driver: StorageConstructor;
}

export interface StorageModuleOptions {
  config?: StorageManagerConfig;
  drivers?: Driver[];
}

type ModuleOptions = Promise<StorageModuleOptions> | StorageModuleOptions;

export interface StorageOptionsFactory {
  createOptions(): ModuleOptions;
}

export interface AsyncStorageModuleOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: Array<Type<any> | string | symbol | Abstract<any> | Function>;
  useClass?: Type<StorageOptionsFactory>;
  useExisting?: Type<StorageOptionsFactory>;
  useFactory?: (...args: any[]) => ModuleOptions;
}
