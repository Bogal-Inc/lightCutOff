import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore, DocumentData} from '@angular/fire/compat/firestore';
import {DocumentReference} from '@firebase/firestore-types';
import {Const} from '../../../environments/const';
import {defaultDevice, Device} from '@Models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends BaseService{

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore,
  ) {
    super(angularFireAuth, angularFirestore);
  }

  async create(device): Promise<void>{

    return await this.set<Device>(
      `${Const.collections.devices}`,
      {
        ...defaultDevice,
        ...device
      } as unknown as Device
    );
  }
}
