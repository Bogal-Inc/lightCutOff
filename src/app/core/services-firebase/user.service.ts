import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import {DocumentReference} from '@firebase/firestore-types';
import { defaultReport, User } from '@Models/user.model';
import { Const } from 'src/environments/const';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore,
  ) {
    super(angularFireAuth, angularFirestore);
  }

  async addUser(user): Promise<DocumentReference<DocumentData>>{
    return await this.add<User>(
      `${Const.collections.users}`,
      {
        ...defaultReport,
        ...user
      } as unknown as User
    );
  }
}
